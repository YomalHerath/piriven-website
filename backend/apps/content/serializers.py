from rest_framework import serializers
from . import models


class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.News
        fields = "__all__"


class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Notice
        fields = "__all__"


class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Publication
        fields = "__all__"


class DownloadCategorySerializer(serializers.ModelSerializer):
    publications = PublicationSerializer(many=True, read_only=True)

    class Meta:
        model = models.DownloadCategory
        fields = [
            "id",
            "name",
            "description",
            "position",
            "created_at",
            "updated_at",
            "publications",
        ]


class VideoSerializer(serializers.ModelSerializer):
    playback_url = serializers.SerializerMethodField()

    class Meta:
        model = models.Video
        fields = "__all__"   # includes file, url, thumbnail, etc.
        # Or list explicitly:
        # fields = ["id","title","file","url","thumbnail","description","published_at","created_at","updated_at","playback_url"]

    def get_playback_url(self, obj):
        # Return relative path for uploaded files (frontend uses mediaUrl to make it absolute)
        return obj.url or (obj.file.url if obj.file else "")


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.GalleryImage
        fields = ["id", "image", "caption", "position", "created_at", "updated_at"]

class AlbumSerializer(serializers.ModelSerializer):
    images = GalleryImageSerializer(many=True, read_only=True)

    class Meta:
        model = models.Album
        fields = [
            "id", "title", "slug", "description", "cover",
            "is_active", "position", "published_at",
            "images", "created_at", "updated_at",
        ]


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Event
        fields = "__all__"


class StatSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Stat
        fields = "__all__"


class ExternalLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ExternalLink
        fields = "__all__"


class HeroSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.HeroSlide
        fields = "__all__"


class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.NewsletterSubscription
        fields = "__all__"


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ContactMessage
        fields = ["id", "name", "email", "subject", "message", "created_at"]


class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ContactInfo
        fields = "__all__"
