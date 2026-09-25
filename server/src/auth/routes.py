from fastapi import APIRouter, Depends, status, HTTPException, Request, BackgroundTasks
from fastapi.responses import Response
from fastapi.encoders import jsonable_encoder
from sqlalchemy.ext.asyncio.session import AsyncSession
from src.db.main import session
from src.db.enums import Roles
from src.auth.services import AuthServices
from src.auth.schema import CreateUserSchema, LoginSchema, ForgotPasswordSchema, ResetPasswordSchema, OtpVerifySchema, ResendVerificationSchema
from src.auth.utils import verifyHash, send_reset_password_link, verifyIdToken, generateOTP, generateJWTToken, saveCookies, send_verification_link, send_otp_code,decodeJWTToken
from .dependencies import OtpBearer, RefreshTokenBearer, AccessTokenBearer
from src.limiter import limiter
from src.account.services import AccountService
from datetime import datetime, timezone
from src.redis import redis_set_value, redis_delete_value, redis_get_value

router =  APIRouter()
authService = AuthServices()
accountService = AccountService()
verifyOtpSecurity =  OtpBearer()
refreshTokenBearer = RefreshTokenBearer()
accessTokenBearer = AccessTokenBearer()



@router.post("/register", status_code=status.HTTP_201_CREATED)
@limiter.limit("15/minute")
async def register_user(userData:CreateUserSchema, request:Request, background_tasks:BackgroundTasks,  session: AsyncSession = Depends(session)):

        if(userData.role ==Roles.ADMIN):

            admin_exists = await authService.adminExists(session)

            if(admin_exists):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={
                    "status": "error",
                    "msg": "Registration failed.",
                    "description": "An Admin account already exist"
                })

       
        user =  await authService.userExists(session=session, email=userData.email, role=userData.role)

        if(not user):

            newUser = await authService.create_user(session=session, userData=userData, request=request)

            if(not newUser):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                    "status": "error",
                    "msg": "Registration failed.",
                    "description": "Unable to create user profile with the provided details."
                })

            await session.commit()
            await session.refresh(newUser)

            name = f"{userData.firstName} {userData.lastName}"

            if(userData.role == Roles.USER):
                try:
                    #TODO: Integrate email 
                    
                    data = {
                        "email": userData.email,
                        "name": name,
                        "type": "send",
                    }

                    token =  await send_verification_link(data, request=request, background_tasks=background_tasks)

                    return { "status": "success", "msg": "Registration successful", "description": f"A verification link has been sent to {userData.email}", "user": newUser, "verificationToken": token}

                except Exception as e:
                    await session.rollback()

                    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={
                        "status": "error",
                        "msg": "Registration could not be completed.",
                        "description": "An internal error occurred while processing your request. Please try again later." 
                    })

            elif(userData.role == Roles.ADMIN):  
                return { "status": "success", "msg": "Registration successful", "description": f"Admin account has been created successfully", "admin": newUser}

        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={
            "status": "error",
            "msg": "Registration failed.",
            "description": "An account with this email address already exists."
        })
            


@router.post("/login", status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
async def sign_in_user(userData:LoginSchema,  request:Request, background_tasks:BackgroundTasks, session: AsyncSession =  Depends(session)):

    email =  userData.email
    password =  userData.password
    role =  userData.role
    user = await authService.userExists(session=session, email=email, role=role)

    if(not user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={
            "status": "error",
            "msg": "Invalid Credentials",
            "description": "Please enter a valid email address"
        })


    verifiedPassword = verifyHash(password=password, hash=user.password)

    if(not verifiedPassword):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={
            "status": "error",
            "msg": "Invalid Credentials",
            "description": "Please provide a valid password"
        })

    code = generateOTP()

    name = f"{user.firstName} {user.lastName}"

    data = {
        "email":user.email,
        "role": user.role,
        "name": name,
        "code":code
    }

    try:
        token = await send_otp_code(data, request, background_tasks)
        await accountService.reset_daily_spent(user, session)
        return {
            "status": "success", 
            "msg": "OTP sent successfully",
            "description": f"An OTP Code has been sent successfully to {user.email}.", 
            "user": jsonable_encoder(user), 
            "token": token
        }
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={
            "status": "error",
            "msg": "Login Failed",
            "description": "Unable to login to your account. Please try again."
        })
    
            

      
@router.post("/otp-verify", status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
async def verify_otp(userData:OtpVerifySchema,  request:Request, response:Response, user = Depends(verifyOtpSecurity), session:AsyncSession = Depends(session)): 

    if(user["code"] == userData.code):

        #JWT
        accessToken = generateJWTToken(type="access", data=user["user"], exp=1200)
        refreshToken = generateJWTToken(type="refresh", data=user["user"], exp=3600)

        # save token to cookies
        saveCookies(key="access", val=accessToken, response=response, exp=1200) #20mins
        saveCookies(key="refresh", val=refreshToken, response=response, exp=3600) # 1hr

        await redis_delete_value(f"otp-code-{user['token']}")
        new_user_info = await authService.update_login_timestamp(user["user"]["id"], session)

        return { "status": "success", "msg": "Login successful", "user": jsonable_encoder(new_user_info)}
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Invalid Code",
            "description": "Please provide a valid otp code",
        })

@router.post("/verify/{token}", status_code=status.HTTP_200_OK)
@limiter.limit("5/minute")
async def verify_account(token: str,  request:Request, session:AsyncSession = Depends(session)):
    token = verifyIdToken(token=token, salt="verify-salt", max=1200)

    if(not token):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Invalid or expired verification token",
            "description": "Please provide a valid verification token"
        })
    else:
        user = await authService.get_user(session=session, email=token)

        if(user is not None):
            if(user.isVerified and user.tier == 2):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                "status": "error",
                "msg": "Invalid or expired verification token",
                "description": "This link has already been used. Please login"
            })
            else:
                user =  await authService.verify_user_account(token, session=session)
                    
                if(user):
                    return { "status": "success", "msg": "Account successfully verified", "user": user}
                
                else:
                    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                        "status": "error",
                        "msg": "Verification Failed",
                        "description": "Unable to verify your account. Please try again."
                })
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={
                    "status": "error",
                    "msg": "User not found",
                    "description": "Unable to verify your account. Please try again."
            })
        

@router.post("/resend-verification",  status_code=status.HTTP_200_OK)
@limiter.limit("3/minute")
async def resend_verification_link(userData:ResendVerificationSchema, request:Request, background_tasks: BackgroundTasks, session:AsyncSession= Depends(session)):
        
        user = await authService.get_user(session, userData.email)

        if(not user):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={
                "status": "error",
                "msg": "Invalid Credentials",
                "description": "Please enter a valid email address"
            })

        name = f"{user.firstName} {user.lastName}"

        try:
            data = {
                "email": userData.email,
                "name": name,
                "type": "resend",
            }
              
            await send_verification_link(data, request=request, background_tasks=background_tasks)

            return { "status": "success", "msg": f"Verification Link Sent", "description":"We've emailed an upgrade link to your inbox. Click it to verify your identity and complete your account upgrade." }
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                "status": "error",
                "msg": "Failed to send verification link",
                "description": "An error occured while sending a new verification link."
        })



@router.post("/resend-otp", status_code=status.HTTP_200_OK)
@limiter.limit("3/minute")
async def resend_otp_code(request:Request, background_tasks:BackgroundTasks, user = Depends(verifyOtpSecurity)):
    try:
        code = generateOTP()

        name = f"{ user["user"]["firstName"]} { user["user"]["lastName"]}"

        data = {
            "email":user["user"]["email"],
            "role": user["user"]["role"],
            "name": name,
            "code":code
        }

        token = await send_otp_code(data, request, background_tasks)

        return { "status": "success", "msg": f"A new otp code has been sent to {user["user"]["email"]}", "token": token}

       
    
    except Exception as e: 
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Failed to send OTP code",
            "description": "An error occured while sending a new OTP code."
        })


@router.post("/forgot-password" , status_code=status.HTTP_200_OK)
@limiter.limit("3/minute")
async def forgot_password(userData:ForgotPasswordSchema, request:Request, background_tasks:BackgroundTasks, session:AsyncSession = Depends(session)):
    user =  await authService.userExists(email=userData.email, session=session, role=userData.role)

    if(not user):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={
            "status": "error",
            "msg": "Invalid Credentials",
            "description": "Please enter a valid email address"
        })

    if(user is not None):
        try:
            token = await send_reset_password_link(user, request, background_tasks)
            await redis_set_value(f"reset-mail-{token}", user.email, ex=1200)
            return { 
                "status": "success", 
                "msg": f"Password reset link has been sent to {userData.email}", 
                "token": token 
            }
        except: 
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={
                "status": "error",
                "msg": "Failed to send password reset link",
                "description": "An error occured while sending password reset link."
            })
              
    
    

@router.post("/reset-password",  status_code=status.HTTP_200_OK)
@limiter.limit("3/minute")
async def reset_password(userData:ResetPasswordSchema, request:Request,  resp:Response, session:AsyncSession = Depends(session)):

    email = await redis_get_value(f"reset-mail-{userData.token}")

    if(not email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
           "status": "error",
            "msg": "Password Reset Failed",
            "description": "Your password reset token has expired. Please request a new password reset token."
        })

    user = await authService.userExists(session, email, role=userData.role)

    if (not user):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={
            "status": "error",
            "msg": "User not found",
            "description": "Please provide a valid email address"
        })
    
    if (user is not None):
        token =  verifyIdToken(token=userData.token, salt=f"reset-salt-{user.password_reset_count}", max=1200)

        if(not token):

            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                "status": "error",
                "msg": "Invalid or expired reset token",
                "description": "Please provide a valid reset token"
            })
        else:
            user = await authService.update_password(session=session, email=token, password=userData.password)

            if(user):
                refreshToken = request.cookies.get("refresh")
                accessToken = request.cookies.get("access")

                if(refreshToken):
                    refreshTokenData = decodeJWTToken(refreshToken)
                    saveCookies(resp, "refresh", "", 0)
                    await redis_set_value(refreshTokenData["jti"], "blacklisted", None)
                    

                if(accessToken):
                    accessTokenData = decodeJWTToken(accessToken)
                    await redis_set_value(accessTokenData["jti"], "blacklisted", None)
                    saveCookies(resp, "access", "", 0)


                await redis_delete_value("reset-link")

                return { "status": "success", "msg": "Password update successful", "user": user}
            else:

                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                    "status": "error",
                    "msg": "Oops!...something went wrong",
                    "description": "An error occured verifying your account."
            })



@router.post("/refresh",  status_code=status.HTTP_200_OK)
@limiter.limit("3/minute")
async def refresh(resp:Response, request:Request, user=Depends(refreshTokenBearer)):


    now = datetime.now(timezone.utc)
    exp = datetime.fromtimestamp(user["exp"], tz=timezone.utc)

    if(not exp): 
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={
            "status": "error",
            "msg": "Invalid or expired refresh token",
            "description": "Please provide a valid refresh token"
        })

    if(now > exp):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={
            "status": "error",
            "msg": "Invalid or expired refresh token",
            "description": "Please provide a valid refresh token"
        })



    accessToken = generateJWTToken(type="access", data=user["user"],  exp=1200)
    # refreshToken = generateJWTToken(type="refresh", data=user["user"],  exp=3600)

    saveCookies(response=resp, key="access", val=accessToken, exp=1200)
    # saveCookies(response=resp, key="refresh", val=refreshToken, exp=3600)

    await redis_set_value(user["jti"],  "blacklisted", None)

    return {"status": "success", "msg": "A new access token has been created", "user": user["user"]}
    
 
@router.post("/signout")
@limiter.limit("3/minute")
async def sign_out(resp:Response,  request:Request):
    try:
        refreshToken = request.cookies.get("refresh")
        accessToken = request.cookies.get("access")

        if(refreshToken):
            refresh_token_data = decodeJWTToken(refreshToken)
            if(refresh_token_data):
                await redis_set_value(refresh_token_data["jti"],  "blacklisted", None)


        if(accessToken):
            access_token_data =  decodeJWTToken(accessToken)
            if(access_token_data):
                await redis_set_value(access_token_data["jti"],  "blacklisted", None)

        saveCookies(resp, "access", "", 0)
        saveCookies(resp, "refresh", "", 0)

        return { "status" : "success", "msg": "Logout successfully" }
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Sign out failed",
            "description": "An error occured while signing out your account."
        })



