from fastapi.templating import Jinja2Templates
from fastapi.requests import Request

templates = Jinja2Templates(directory="src/templates")


async def verification_message(request:Request, name:str, link:str):
    return templates.TemplateResponse(request, "verification.html", { "name": name, "verificationLink": link}).body.decode("utf-8")



async def otp_message(request:Request, name:str, code:str):
    return templates.TemplateResponse(request, "otp.html", { "name": name, "code": code }).body.decode("utf-8")


async def reset_password_message(request:Request, resetLink:str, name:str):
    return templates.TemplateResponse(request, "reset-password.html", { "resetLink": resetLink, "name":name }).body.decode("utf-8")