from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        User.objects.create_user(
            username='admin@admin.com',
            email='admin@admin.com',
            password='admin'
        )
