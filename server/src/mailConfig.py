import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from .config import config

def sendMail(to_mail:str, subject:str, msg):
    tokenInfo =  config.MAIL_TOKEN

    cred = Credentials.from_authorized_user_info(tokenInfo)

    service = build("gmail", "v1", credentials=cred)
    
    message = MIMEMultipart("alternative")

    message["to"] = to_mail
    message["from"] = "VectorPay"
    message["subject"] = subject

    text = MIMEText(msg, "plain")
    html = MIMEText(msg, "html")

    message.attach(text)
    message.attach(html)

    raw_message =  base64.urlsafe_b64encode(message.as_bytes()).decode("utf-8")


    try:
        result  =  service.users().messages().send(userId="me", body={"raw": raw_message}).execute()
        print("successful")

        return result
    except Exception as e:
        print(e)