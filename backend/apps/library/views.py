from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter

from . import models, serializers

class PublicationEntryViewSet(viewsets.ModelViewSet):
    queryset = models.PublicationEntry.objects.all()
    serializer_class = serializers.PublicationEntrySerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_fields = ["category", "category__slug", "is_active", "is_featured", "year"]
    ordering_fields = ["published_at", "created_at", "year", "title"]
    search_fields = ["title", "subtitle", "authors", "description"]

    def get_queryset(self):
        qs = super().get_queryset()
        p = self.request.query_params

        # default: only active unless active=false
        if p.get("active", "true").lower() != "false":
            qs = qs.filter(is_active=True)

        # featured=true
        if p.get("featured", "").lower() in ("true", "1", "yes"):
            qs = qs.filter(is_featured=True)

        # category by id OR slug (same ?category= param)
        v = p.get("category")
        if v:
            qs = qs.filter(category_id=int(v)) if v.isdigit() else qs.filter(category__slug=v)

        return qs

    @action(detail=False, methods=["get"])
    def latest(self, request):
        limit = int(request.query_params.get("limit", 6))
        qs = self.get_queryset().order_by("-published_at", "-created_at")[:limit]
        ser = self.get_serializer(qs, many=True)
        return Response(ser.data)

class PublicationCategoryViewSet(viewsets.ModelViewSet):
    queryset = models.PublicationCategory.objects.all().order_by("position", "name")
    serializer_class = serializers.PublicationCategorySerializer
    filter_backends = [SearchFilter]
    search_fields = ["name", "description"]
