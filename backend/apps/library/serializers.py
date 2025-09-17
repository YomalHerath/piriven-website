from rest_framework import serializers
from . import models

# Small category used inside a book to avoid recursion
class PublicationCategoryMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PublicationCategory
        fields = ["id", "name", "slug"]

class PublicationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.PublicationImage
        fields = ["id", "image", "caption", "created_at", "updated_at"]

class PublicationEntrySerializer(serializers.ModelSerializer):
    # Read the category as a small embedded object, write via category_id
    category = PublicationCategoryMiniSerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=models.PublicationCategory.objects.all(),
        source="category",
        write_only=True,
        required=False,
        allow_null=True,
    )
    images = PublicationImageSerializer(many=True, read_only=True)
    download_href = serializers.ReadOnlyField()

    class Meta:
        model = models.PublicationEntry
        fields = [
            "id",
            "category", "category_id",
            "title", "subtitle", "authors", "year", "description",
            "cover", "pdf_file", "external_url", "download_href",
            "published_at", "is_active", "is_featured",
            "images",
            "created_at", "updated_at",
        ]

# Full category (no nested publications by default to avoid recursion)
class PublicationCategorySerializer(serializers.ModelSerializer):
    publications_count = serializers.IntegerField(
        source="publications.count", read_only=True
    )

    class Meta:
        model = models.PublicationCategory
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "position",
            "created_at",
            "updated_at",
            "publications_count",
        ]
