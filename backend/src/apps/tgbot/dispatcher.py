from telegram.ext import (
    Dispatcher, Filters, MessageHandler,
)

from .handlers.help import connect_tgbot_help_text
from .bot import bot

def setup_dispatcher(dp):
    dp.add_handler(MessageHandler(Filters.all, connect_tgbot_help_text)) # type: ignore
    return dp

dispatcher = setup_dispatcher(Dispatcher(bot, update_queue=None, workers=4, use_context=True)) # type: ignore