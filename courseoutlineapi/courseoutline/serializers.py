from rest_framework import serializers
from courseoutline.models import Category, Course, Outline, Comment, Assessment, User


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

    category = CategorySerializer(many=False)


class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = ['method', 'weight', 'outline']
        extra_kwargs = {'outline': {'required': False}}


class OutlineSerializer(serializers.ModelSerializer):
    assessments = AssessmentSerializer(many=True)

    class Meta:
        model = Outline
        fields = ['id', 'title', 'content', 'assessments', 'credit', 'resource', 'lecturer', 'course']
        extra_kwargs = {'lecturer': {'required': False}}

    def validate_assessments(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("Phải có ít nhất 2 cột đánh giá")
        if len(value) > 5:
            raise serializers.ValidationError("Chỉ đuợc nhiều nhất 5 cột đánh giá")
        total_weight = sum(assessment['weight'] for assessment in value)
        if total_weight != 100:
            raise serializers.ValidationError("Tổng các cột điểm đánh giá phải là 100%")

        return value

    def create(self, validated_data):
        assessments = validated_data.pop('assessments')
        outline = Outline.objects.create(lecturer=self.context['request'].user, **validated_data)
        for assessment in assessments:
            Assessment.objects.create(outline=outline, **assessment)

        return outline

    def update(self, instance, validated_data):
        assessments = validated_data.pop('assessments')
        instance.title = validated_data.get('title')
        instance.content = validated_data.get('content')


class UserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        data = validated_data.copy()
        u = User(**data)
        u.set_password(u.password)
        u.save()

        return u

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.avatar:
            rep['avatar'] = instance.avatar.url

        return rep

    class Meta:
        model = User
        fields = ['id', 'fullname', 'email', 'username', 'password', 'role', 'avatar']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_date', 'updated_date', 'user']
