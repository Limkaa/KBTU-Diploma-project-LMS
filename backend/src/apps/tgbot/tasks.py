import time
from typing import Union, List, Optional, Dict

import telegram

from project.celery import app
from celery import shared_task
from .utils import send_one_message


# @app.task(ignore_result=True)
@shared_task
def broadcast_message(
    user_ids: List[Union[str, int]],
    text: str,
    sleep_between: float = 0.4,
    parse_mode=telegram.ParseMode.HTML,
) -> None:
    for user_id in user_ids:
        if user_id not in [None, '']:
            try:
                send_one_message(
                    user_id=user_id,
                    text=text,
                    parse_mode=parse_mode,
                )
            except Exception as e:
                print(e)
            time.sleep(max(sleep_between, 0.1))

