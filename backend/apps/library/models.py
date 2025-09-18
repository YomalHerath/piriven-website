from django.db import models
from django.utils.text import slugify
from django.core.exceptions import ValidationError

class TimeStamped(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        abstract = True

class PublicationCategory(TimeStamped):
    name = models.CharField(max_length=200, unique=True)
    name_si = models.CharField(max_length=200, blank=True)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField(blank=True)
    description_si = models.TextField(blank=True)
    position = models.PositiveIntegerField(default=0, help_text="Order categories by this field (ascending).")

    class Meta:
        ordering = ["position", "name"]
        verbose_name = "Publication Category"
        verbose_name_plural = "Publication Categories"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:220]
        super().save(*args, **kwargs)

class PublicationEntry(TimeStamped):
    category = models.ForeignKey(
        PublicationCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="publications",
    )
    title = models.CharField(max_length=255)
    title_si = models.CharField(max_length=255, blank=True)
    subtitle = models.CharField(max_length=255, blank=True)
    subtitle_si = models.CharField(max_length=255, blank=True)
    authors = models.CharField(max_length=255, blank=True, help_text="Comma-separated author names")
    authors_si = models.CharField(max_length=255, blank=True, help_text="Sinhala author names (optional)")
    year = models.PositiveIntegerField(null=True, blank=True)
    description = models.TextField(blank=True)
    description_si = models.TextField(blank=True)

    cover = models.ImageField(upload_to="publication_covers/", blank=True, null=True)
    pdf_file = models.FileField(upload_to="publications/", blank=True, null=True, help_text="Optional PDF for the book")
    external_url = models.URLField(blank=True, help_text="If provided, link to this instead of pdf_file")

    published_at = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False, help_text="Show in homepage Publications section")

    class Meta:
        ordering = ["-published_at", "-created_at"]
        verbose_name = "Publication (Book)"
        verbose_name_plural = "Publications (Books)"

    def clean(self):
        if not self.pdf_file and not self.external_url:
            raise ValidationError("Upload a PDF file or provide an external URL.")

    def __str__(self):
        return self.title

    @property
    def download_href(self) -> str:
        if self.external_url:
            return self.external_url
        return self.pdf_file.url if self.pdf_file else ""

class PublicationImage(TimeStamped):
    publication = models.ForeignKey(
        PublicationEntry,
        on_delete=models.CASCADE,
        related_name="images",
    )
    image = models.ImageField(upload_to="publication_images/")
    caption = models.CharField(max_length=255, blank=True)
    caption_si = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["created_at"]
        verbose_name = "Publication Image"
        verbose_name_plural = "Publication Images"

    def __str__(self):
        return f"Image for {self.publication.title}"

