from django.contrib import admin
from django.utils.html import format_html
from . import models


@admin.register(models.News)
class NewsAdmin(admin.ModelAdmin):
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:40px;border-radius:4px;" />', obj.image.url)
        return ""

    list_display = ("title", "published_at", "is_featured", "image_preview")
    list_filter = ("is_featured", "published_at")
    search_fields = ("title", "excerpt")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        (None, {"fields": ("title", "slug", "excerpt", "content")}),
        ("Media", {"fields": ("image",)}),
        ("Publishing", {"fields": ("is_featured", "published_at", "created_at", "updated_at")}),
    )


@admin.register(models.Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ("title", "published_at", "expires_at", "priority")
    list_filter = ("published_at", "expires_at")
    search_fields = ("title", "content")

    def image_preview(self, obj):
        from django.utils.html import format_html
        return format_html('<img src="{}" style="height:40px;border-radius:4px" />', obj.image.url) if obj.image else "-"
    image_preview.short_description = "Image"


@admin.register(models.Publication)
class PublicationAdmin(admin.ModelAdmin):
    def cover_preview(self, obj):
        if getattr(obj, 'cover', None):
            try:
                return format_html('<img src="{}" style="height:40px;border-radius:4px;" />', obj.cover.url)
            except Exception:
                return ""
        return ""

    list_display = ("title", "category", "published_at", "is_active", "cover_preview")
    list_filter = ("category", "is_active", "published_at")
    search_fields = ("title", "description")
    autocomplete_fields = ("category",)
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        (None, {"fields": ("title", "description", "category")}),
        ("File / Link", {"fields": ("file", "external_url")}),
        ("Cover", {"fields": ("cover",)}),
        ("Publishing", {"fields": ("is_active", "published_at", "created_at", "updated_at")}),
    )


@admin.register(models.Video)
class VideoAdmin(admin.ModelAdmin):
    def thumb(self, obj):
        if getattr(obj, "thumbnail", None):
            try:
                return format_html('<img src="{}" style="height:40px;border-radius:4px;" />', obj.thumbnail.url)
            except Exception:
                return ""
        return ""

    list_display = ("title", "published_at", "thumb")
    list_filter = ("published_at",)
    search_fields = ("title", "description")
    fieldsets = (
        ("Basics", {"fields": ("title", "description")}),
        ("Source (choose one)", {"fields": ("file", "url")}),   # ← updated
        ("Media", {"fields": ("thumbnail",)}),
        ("Publishing", {"fields": ("published_at",)}),
    )


class GalleryImageInline(admin.TabularInline):  # or StackedInline if you prefer
    model = models.GalleryImage
    extra = 3
    fields = ("image", "caption", "position", "preview")
    readonly_fields = ("preview",)

    def preview(self, obj):
        try:
            return format_html('<img src="{}" style="height:60px;border-radius:4px" />', obj.image.url)
        except Exception:
            return ""


@admin.register(models.Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active", "position", "published_at", "thumb")
    list_editable = ("is_active", "position")
    search_fields = ("title", "description")
    list_filter = ("is_active", "published_at")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [GalleryImageInline]
    fieldsets = (
        ("Basics", {"fields": ("title", "slug", "description")}),
        ("Cover", {"fields": ("cover",)}),
        ("Status", {"fields": ("is_active", "position", "published_at")}),
    )

    def thumb(self, obj):
        if obj.cover:
            try:
                return format_html('<img src="{}" style="height:40px;border-radius:4px" />', obj.cover.url)
            except Exception:
                return ""
        return ""


@admin.register(models.Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "start_date", "end_date")
    list_filter = ("start_date", "end_date")
    search_fields = ("title", "description")


@admin.register(models.Stat)
class StatAdmin(admin.ModelAdmin):
    list_display = ("label", "value")
    search_fields = ("label",)


@admin.register(models.ExternalLink)
class ExternalLinkAdmin(admin.ModelAdmin):
    list_display = ("name", "url", "position")
    list_editable = ("position",)
    search_fields = ("name",)


class PublicationInline(admin.TabularInline):
    model = models.Publication
    fields = ("title", "file", "external_url", "published_at", "is_active")
    extra = 1


@admin.register(models.DownloadCategory)
class DownloadCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "position", "created_at")
    list_editable = ("position",)
    search_fields = ("name", "description")
    inlines = [PublicationInline]


@admin.register(models.HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:40px;border-radius:4px;" />', obj.image.url)
        return ""

    list_display = ("title", "position", "created_at", "image_preview")
    list_editable = ("position",)
    search_fields = ("title", "subtitle")
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        (None, {"fields": ("title", "subtitle")}),
        ("Media", {"fields": ("image",)}),
        ("Button", {"fields": ("button_label", "button_url")}),
        ("Ordering", {"fields": ("position",)}),
        ("Meta", {"fields": ("created_at", "updated_at")}),
    )


@admin.register(models.NewsletterSubscription)
class NewsletterSubscriptionAdmin(admin.ModelAdmin):
    list_display = ("email", "created_at")
    search_fields = ("email",)


@admin.register(models.ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "created_at", "is_handled")
    list_filter = ("is_handled", "created_at")
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = ("created_at", "updated_at")


@admin.register(models.ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ("organization", "phone", "email", "created_at")
    readonly_fields = ("created_at", "updated_at")

    def has_add_permission(self, request):
        if models.ContactInfo.objects.exists():
            return False
        return super().has_add_permission(request)
