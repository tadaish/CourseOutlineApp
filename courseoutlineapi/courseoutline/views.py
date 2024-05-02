from rest_framework import viewsets, generics, status, parsers, permissions
from courseoutline import serializers
from courseoutline.models import Category, Course, Outline, Comment, Assessment, User
from rest_framework.response import Response
from rest_framework.decorators import action


class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer


class CourseViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Course.objects.filter(active=True)
    serializer_class = serializers.CourseSerializer

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):
            q = self.request.query_params.get('q')
            if q:
                queryset = queryset.filter(namme__icontains=q)

            cate_id = self.request.query_params.get('category_id')
            if cate_id:
                queryset = queryset.filter(category_id=cate_id)

            credit = self.request.query_params.get('credit')
            if credit:
                queryset = queryset.outline_set.filter(credit=credit)

        return queryset

    @action(methods=['get'], url_path='outlines', detail=True)
    def get_outlines(self, request, pk):
        outlines = self.get_object().outline_set.filter(active=True)

        q = request.query_params.get('q')
        if q:
            outlines = outlines.filter(title__icontains=q)

        credit = request.query_params.get('credit')
        if credit:
            outlines = outlines.filter(credit=credit)

        return Response(serializers.OutlineSerializer(outlines, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='outline', detail=True)
    def add_outline(self, request, pk):

        outline = self.get_object().outline_set.create(
            lecturer=request.user,
            title=request.data.get('title'),
            content=request.data.get('content'),
            credit=request.data.get('credit'),
            resource=request.data.get('resource')
        )

        return Response(serializers.OutlineSerializer(outline).data, status=status.HTTP_201_CREATED)


class OutlineViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = Outline.objects.all()
    serializer_class = serializers.OutlineSerializer

    @action(methods=['get'], url_path='assessments', detail=True)
    def get_assessments(self, request, pk):
        assessments = self.get_object().assessment_set.all()

        return Response(serializers.AssessmentSerializer(assessments).data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='assessment', detail=True)
    def add_assessment(self, request, pk):
        assessment = self.get_object().assessment_set.create(
            name=request.data.get('name'),
            weight=request.data.get('weight'),
            outcomes=request.data.get('outcomes')
        )

        return Response(serializers.AssessmentSerializer(assessment).data, status=status.HTTP_201_CREATED)


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def get_permissions(self):
        if self.action in ['current_user']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()

        return Response(serializers.UserSerializer(user).data)


class AssessmentViewSet(viewsets.ViewSet, generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = Assessment.objects.all()
    serializer_class = serializers.AssessmentSerializer
