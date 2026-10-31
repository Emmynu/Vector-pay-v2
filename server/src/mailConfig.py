from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from src.config import config
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import base64


def sendMail(to_mail:str, subject:str, msg):

    mail_token = config.MAIL_TOKEN

    credentials = Credentials.from_authorized_user_info(mail_token)

    service = build("gmail", "v1", credentials=credentials)

    message = MIMEMultipart("alternative")

    message["from"] = "VectorPay"
    message["to"] = "loluwasimi54@gmail.com"

    message["bcc"] = to_mail
    message["subject"] = subject

    message.attach(MIMEText(msg, "html"))

    raw_msg = base64.urlsafe_b64encode(message.as_bytes()).decode("utf-8")

    try:
        response = service.users().messages().send(userId="me", body={ "raw": raw_msg }).execute()
        return response
    except HttpError as http:
        print(str(http))
        return False

