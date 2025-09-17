from rest_framework.routers import DefaultRouter
from .views import PublicationCategoryViewSet, PublicationEntryViewSet

router = DefaultRouter()
router.register(r"book-categories", PublicationCategoryViewSet, basename="book-category")
router.register(r"books", PublicationEntryViewSet, basename="book")

urlpatterns = router.urls
