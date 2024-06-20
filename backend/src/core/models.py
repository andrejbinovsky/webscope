from django.db import models
from django.contrib.auth.models import User
from core.enums import MessageType


class Conversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)


class ConversationMessage(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    message = models.TextField()
    type = models.CharField(
        max_length=10, choices=MessageType.CHOICES
    )
