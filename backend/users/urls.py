from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from users.views import owner_login, MyTokenObtainPairView, OwnerRegisterView, OwnerUpdateView, RegisterView, RetailerUpdateView

router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('update/<int:pk>/', RetailerUpdateView.as_view(), name='auth_update'),
    path('owner/login/', owner_login, name='owner_login'),
    path('owner/register/', OwnerRegisterView.as_view(), name='owner_register'),
    path('owner/update/<int:pk>/', OwnerUpdateView.as_view(), name='owner_update'),
]
