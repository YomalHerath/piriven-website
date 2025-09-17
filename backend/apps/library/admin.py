from django.contrib import admin
from . import models

@admin.register(models.PublicationCategory)
class PublicationCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "position", "created_at")
    list_editable = ("position",)
    search_fields = ("name", "description")
    readonly_fields = ("created_at", "updated_at")
    prepopulated_fields = {"slug": ("name",)}

class PublicationImageInline(admin.TabularInline):
    model = models.PublicationImage
    extra = 1

@admin.register(models.PublicationEntry)
class PublicationEntryAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "year", "published_at", "is_active", "is_featured")
    list_filter = ("is_active", "is_featured", "category", "year")
    search_fields = ("title", "subtitle", "authors", "description")
    readonly_fields = ("created_at", "updated_at")
    inlines = [PublicationImageInline]
    fieldsets = (
        ("Basics", {
            "fields": ("category", "title", "subtitle", "authors", "year", "description")
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
