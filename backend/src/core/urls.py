from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from core.api import (
    ConversationListView,
    ConversationAPIView,
    ConversationMessageListView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/openai/ask/", ConversationAPIView.as_view(), name="streaming_view"),
    path(
        "api/conversations/",
        ConversationListView.as_view(),
        name="conversation-list-create",
    ),
    path(
        "api/conversations/<int:pk>/messages/",
        ConversationMessageListView.as_view(),
        name="conversation-detail",
    ),
]
