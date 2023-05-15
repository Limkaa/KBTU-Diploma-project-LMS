import logging
import sys

import telegram
from telegram import Bot

from django.conf import settings


try:
    bot = Bot(settings.TELEGRAM_TOKEN)
except telegram.error.Unauthorized:
    logging.error("Invalid TELEGRAM_TOKEN.")
    sys.exit(1)