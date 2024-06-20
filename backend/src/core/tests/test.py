from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from core.models import Conversation


class APITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client = APIClient()
        self.client.login(username='testuser', password='testpassword')

    def test_conversation_list(self):
        url = reverse('conversation-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_conversation_create_and_stream(self):
        url = reverse('streaming_view')
        response = self.client.get(url, {'message': 'Hello, OpenAI!'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.streaming)

    def test_conversation_message_list(self):
        conversation = Conversation.objects.create(user=self.user, title="Test Conversation")
        url = reverse('conversation-detail', args=[conversation.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthorized_test_conversation_list(self):
        self.client.logout()
        url = reverse('conversation-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
