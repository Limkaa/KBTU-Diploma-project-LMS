import datetime

from django.utils import timezone
from telegram import ParseMode, Update
from telegram.ext import CallbackContext


def connect_tgbot_help_text(update: Update, context: CallbackContext) -> None:
    user_id = update.message.from_user.id
    message = f'Hello dear user! This bot was created for notifications system of StudyMate LMS platform. '\
        'Our website: studymate.kz. If you registered there you can update telegram_id of your profile '\
        'and we will send you some notifications, which will be related to you.\n\n'\
        f'Just put this id ({user_id}) to your profile or ask manager of your school to do it'
    update.message.reply_text(text=message)