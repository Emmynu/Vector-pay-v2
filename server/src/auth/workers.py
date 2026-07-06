from celery import Celery
from src.config import config
from src.mailConfig import sendMail

celery_app = Celery(
    "tasks",
    broker= config.RABBITMQ_URL,
    backend=config.RABBITMQ_URL
)

@celery_app.task(name="tasks.send_mail")
def send_mail(to_mail:str, subject:str, msg):
    sendMail(to_mail=to_mail, subject=subject, msg=msg)

    print("success")