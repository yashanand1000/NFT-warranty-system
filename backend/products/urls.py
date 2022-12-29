from django.urls import path, include
from rest_framework import routers
from .views import ProductViewSet, ItemViewSet, OrderViewSet

router = routers.DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'items', ItemViewSet)
router.register(r'orders', OrderViewSet)
urlpatterns = [
    path('', include(router.urls)),
]
