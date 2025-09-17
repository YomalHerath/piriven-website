from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from . import models, serializers
from . import serializers as s


class NewsViewSet(viewsets.ModelViewSet):
    queryset = models.News.objects.all().order_by("-published_at")
    serializer_class = s.NewsSerializer

    @action(detail=False, methods=["get"])
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True)[:5]
        return Response(self.get_serializer(qs, many=True).data)


class NoticeViewSet(viewsets.ModelViewSet):
    queryset = models.Notice.objects.all()
    serializer_class = s.NoticeSerializer


class PublicationViewSet(viewsets.ModelViewSet):
    queryset = models.Publication.objects.filter(is_active=True).order_by("-published_at")
    serializer_class = s.PublicationSerializer


class VideoViewSet(viewsets.ModelViewSet):
    queryset = models.Video.objects.all().order_by("-published_at")
    serializer_class = s.VideoSerializer


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = models.Album.objects.all()
    serializer_class = serializers.AlbumSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["is_active", "slug"]
    search_fields = ["title", "description"]
    ordering_fields = ["position", "published_at", "created_at"]
    ordering = ["position", "-published_at", "-created_at"]

class GalleryImageViewSet(viewsets.ModelViewSet):
    queryset = models.GalleryImage.objects.all()
    serializer_class = serializers.GalleryImageSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["album"]
    ordering_fields = ["position", "created_at"]


class EventViewSet(viewsets.ModelViewSet):
    queryset = models.Event.objects.all().order_by("start_date")
    serializer_class = s.EventSerializer


class StatViewSet(viewsets.ModelViewSet):
    queryset = models.Stat.objects.all()
    serializer_class = s.StatSerializer


class ExternalLinkViewSet(viewsets.ModelViewSet):
    queryset = models.ExternalLink.objects.all()
    serializer_class = s.ExternalLinkSerializer


class HeroSlideViewSet(viewsets.ModelViewSet):
    queryset = models.HeroSlide.objects.all().order_by("position")
    serializer_class = s.HeroSlideSerializer


class NewsletterSubscriptionViewSet(mixins.CreateModelMixin,
                                    mixins.ListModelMixin,
                                    viewsets.GenericViewSet):
    queryset = models.NewsletterSubscription.objects.all().order_by("-created_at")
    serializer_class = s.NewsletterSubscriptionSerializer


class DownloadCategoryViewSet(viewsets.ModelViewSet):
    queryset = models.DownloadCategory.objects.all().order_by("position")
    serializer_class = s.DownloadCategorySerializer


class ContactMessageViewSet(mixins.CreateModelMixin,
                            mixins.ListModelMixin,
                            viewsets.GenericViewSet):
    queryset = models.ContactMessage.objects.all().order_by("-created_at")
    serializer_class = s.ContactMessageSerializer


class ContactInfoViewSet(viewsets.ModelViewSet):
    queryset = models.ContactInfo.objects.all().order_by("-created_at")
    serializer_class = s.ContactInfoSerializer
