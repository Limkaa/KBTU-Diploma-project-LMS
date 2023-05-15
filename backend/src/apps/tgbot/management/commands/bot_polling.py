from django.core.management.base import BaseCommand
from django.conf import settings

from telegram.ext import Updater

from apps.tgbot.dispatcher import setup_dispatcher

class Command(BaseCommand):
    def handle(self, *args, **options):
        updater = Updater(settings.TELEGRAM_TOKEN, use_context=True)
        dp = updater.dispatcher
        dp = setup_dispatcher(dp)
        updater.start_polling()
        updater.idle()
        