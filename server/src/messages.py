from fastapi.templating import Jinja2Templates
from fastapi.requests import Request

templates = Jinja2Templates(directory="src/templates")


def verification_message(request:Request, name:str, link:str):
    return templates.TemplateResponse(request, "verification.html", { "name": name, "verificationLink": link }).body.decode("utf-8")



def otp_message(request:Request, name:str, code:str):
    return templates.TemplateResponse(request, "otp.html", { "name": name, "code": code }).body.decode("utf-8")


def reset_password_message(request:Request, resetLink:str, name:str):
    return templates.TemplateResponse(request, "reset-password.html", { "resetLink": resetLink, "name":name }).body.decode("utf-8")


def resend_verification_message(request:Request, name:str, link:str):
    return templates.TemplateResponse(request, "resend-verification.html", { "name": name, "verificationLink": link }).body.decode("utf-8")


def pin_reset_message(request:Request, name:str, code:str):
    return templates.TemplateResponse(request, "pin-reset.html", { "name": name, "code": code }).body.decode("utf-8")



def broadcast_message(request:Request, title:str, content:str):
    return templates.TemplateResponse(request, "broadcasts.html", { "content": content }).body.decode("utf-8")