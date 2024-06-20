from rest_framework import permissions
from core.models import Conversation


class CustomConversationPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        try:
            conversation = Conversation.objects.get(id=view.kwargs["pk"])
        except Conversation.DoesNotExist:
            return False
        return request.user == conversation.user


class CustomConversationCreatePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        try:
            conversation_id = request.query_params.get("conversation_id", None)
            if not conversation_id:
                return True
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return False

        return request.user == conversation.user
