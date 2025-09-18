from django.contrib import admin
from . import models


@admin.register(models.PublicationCategory)
class PublicationCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "position", "created_at")
    list_editable = ("position",)
    search_fields = ("name", "name_si", "description", "description_si")
    readonly_fields = ("created_at", "updated_at")
    prepopulated_fields = {"slug": ("name",)}
    fieldsets = (
        ("English", {"fields": ("name", "description")}),
        ("Sinhala", {"fields": ("name_si", "description_si")}),
        ("Ordering", {"fields": ("position",)}),
        ("System", {"fields": ("slug", "created_at", "updated_at")}),
    )


class PublicationImageInline(admin.TabularInline):
    model = models.PublicationImage
    extra = 1
    fields = ("image", "caption", "caption_si")


@admin.register(models.PublicationEntry)
class PublicationEntryAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "year", "published_at", "is_active", "is_featured")
    list_filter = ("is_active", "is_featured", "category", "year")
    search_fields = (
        "title",
        "title_si",
        "subtitle",
        "subtitle_si",
        "authors",
        "authors_si",
        "description",
        "description_si",
    )
    readonly_fields = ("created_at", "updated_at")
    inlines = [PublicationImageInline]
    fieldsets = (
        ("English", {
            "fields": (
                "category",
                "title",
                "subtitle",
                "authors",
                "year",
                "description",
            )
        }),
        ("Sinhala", {
            "fields": (
                "title_si",
                "subtitle_si",
                "authors_si",
                "description_si",
            )
        }),
        ("Media", {
            "fields": ("cover", "pdf_file", "external_url")
        }),
        ("Status & Dates", {
            "fields": ("published_at", "is_active", "is_featured")
        }),
        ("System", {
            "fields": ("created_at", "updated_at")
        }),
    )

