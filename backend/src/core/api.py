from django.http import StreamingHttpResponse

from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from core.models import Conversation, ConversationMessage
from core.enums import MessageType
from core.permissions import CustomConversationPermission, CustomConversationCreatePermission
from core.serializers import (
    ConversationSerializer,
    ConversationCreateSerializer,
    ConversationMessageSerializer,
)

from openai import OpenAI


class ConversationListView(ListAPIView):
    serializer_class = ConversationSerializer
    queryset = serializer_class.Meta.model.objects.all()
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return self.serializer_class.Meta.model.objects.filter(
            user_id=self.request.user.pk
        ).order_by("-id")


class ConversationMessageListView(ListAPIView):
    serializer_class = ConversationMessageSerializer
    queryset = serializer_class.Meta.model.objects.all()
    permission_classes = (IsAuthenticated, CustomConversationPermission)

    def get_queryset(self):
        return ConversationMessage.objects.filter(conversation_id=self.kwargs["pk"])


class ConversationAPIView(APIView):
    permission_classes = (IsAuthenticated, CustomConversationCreatePermission)

    def get(self, request, *args, **kwargs):
        serializer = ConversationCreateSerializer(
            data=request.query_params, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        message = serializer.validated_data.get("message")
        conversation_id = serializer.validated_data.get("conversation_id")

        client = OpenAI()

        try:
            if not conversation_id:
                conversation_id = Conversation.objects.create(
                    user=request.user, title=message[:255]
                ).id
            ConversationMessage.objects.create(
                conversation_id=conversation_id, message=message, type=MessageType.USER
            )

        except Exception as e:
            return Response({"error": e}, status=status.HTTP_400_BAD_REQUEST)

        conversations = ConversationMessage.objects.filter(
            conversation_id=conversation_id
        ).values_list(
            "type",
            "message",
        )

        def event_stream():
            try:
                stream = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        *[
                            {"role": conversation[0], "content": conversation[1]}
                            for conversation in conversations
                        ],
                        {"role": "user", "content": message},
                    ],
                    stream=True,
                )
                whole_system_message = ""
                for chunk in stream:
                    try:
                        if chunk.choices[0].delta.content is not None:
                            whole_system_message += chunk.choices[0].delta.content
                            yield chunk.choices[0].delta.content

                        if chunk.choices[0].finish_reason == "stop":
                            ConversationMessage.objects.create(
                                conversation_id=conversation_id,
                                message=whole_system_message,
                                type=MessageType.SYSTEM,
                            )
                    except AttributeError:
                        pass
            except Exception:
                yield "Error occurred while streaming."

        response = StreamingHttpResponse(event_stream())
        response["Content-Type"] = "text/event-stream"
        return response
