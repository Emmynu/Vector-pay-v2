from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.responses import Response
from sqlalchemy.ext.asyncio.session import AsyncSession
from src.db.main import session
from src.auth.services import AuthServices
from src.auth.schema import CreateUserSchema, GetUserSchema, ForgotPasswordSchema, ResetPasswordSchema, OtpVerifySchema, ResendVerificationSchema
from src.auth.utils import verifyHash, send_reset_password_link, verifyIdToken, loadUnsafeIdToken, generateOTP, generateJWTToken, saveCookies, send_verification_link, send_otp_code
from .dependencies import OtpBearer, RefreshTokenBearer


router =  APIRouter()
authService = AuthServices()
verifyOtpSecurity =  OtpBearer()
refreshTokenBearer = RefreshTokenBearer()


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(userData:CreateUserSchema, session: AsyncSession = Depends(session)):
   
        userExists =  await authService.userExists(session=session, email=userData.email)

        if(userExists):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={
                "status": "error",
                "msg": "Oops!...something went wrong",
                "description": "User already exists"
            })
        else:    
            try:
                user = await authService.create_user(session=session, userData=userData)
                name = f"{userData.firstName} {userData.lastName}"

                #TODO: Integrate email 
                
                send_verification_link(userData.email, name)
                return { "status": "success", "msg": f"A verification link has been sent to {userData.email}", "user": user}
            
            except Exception as e:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                "status": "error",
                "msg": "Oops!...something went wrong",
                "description": str(e)
                })




@router.post("/login", status_code=status.HTTP_200_OK)
async def sign_in_user(userData:GetUserSchema, session: AsyncSession =  Depends(session)):
    email =  userData.email
    password =  userData.password
    userExist = await authService.get_user(session=session, email=email)

    if(userExist):
       verifiedPassword = verifyHash(password=password, hash=userExist.password)

       if(verifiedPassword):
     
           #TODO: generate and send
           code = generateOTP()

           data = {
               "user": {
                "id": str(userExist.id),
                "email": userExist.email,
                "firstName": userExist.firstName,
                "lastName": userExist.lastName,
                "userName": userExist.userName,
                "accountNumber": userExist.accountNumber,
               },
               "code" : code
           }
           
           name = f"{userExist.firstName} {userExist.lastName}"
           token = send_otp_code(userExist.email, data, code, name)
          
           return { "status": "success", "msg": "Login successful", "user": userExist, "token": token}
       else: 
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
                "status": "error",
                "msg": "Invalid Credentials",
                "description": "Please provide a valid password"
                })
    else:
         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
                "status": "error",
                "msg": "Invalid Credentials",
                "description": "Please enter a valid email address"
                })

      
@router.post("/otp-verify", status_code=status.HTTP_200_OK)
async def verify_otp(userData:OtpVerifySchema, response:Response, user = Depends(verifyOtpSecurity)):
   
    if(user["code"] == userData.code):

        #JWT
        accessToken = generateJWTToken(type="access", data=user["user"])
        refreshToken = generateJWTToken(type="refresh", data=user["user"])

        # save token to cookies
       
        saveCookies(key="access", val=accessToken, response=response, exp=1200) #20mins
        saveCookies(key="refresh", val=refreshToken, response=response, exp=3600) # 1hr

        return { "status": "success", "msg": "Login successful", "user": user["user"]}
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Invalid Code",
            "description": "Please provide a valid otp code",
            # "code": user["code"] #remove
        })

@router.post("/verify/{token}", status_code=status.HTTP_200_OK)
async def verify_account(token: str, session:AsyncSession = Depends(session)):
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
                        "msg": "Oops!...something went wrong",
                        "description": "An error occured verifying your account."
                })
        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                    "status": "error",
                    "msg": "Oops!...something went wrong",
                    "description": "An error occured verifying your account."
            })
        

@router.post("/resend-verification",  status_code=status.HTTP_200_OK)
async def resend_verification_link(userData:ResendVerificationSchema):
    try:
        send_verification_link(userData.email, userData.name)
        return { "status": "success", "msg": f"A new verification link has been sent to {userData.email}"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Oops!...something went wrong",
            "description": str(e)
    })



@router.post("/resend-otp", status_code=status.HTTP_200_OK)
async def resend_otp_code(user = Depends(verifyOtpSecurity)):
    try:
        code = generateOTP()

        data = {
            "user": {
                "id": str(user["user"]["id"]),
                "email": user["user"]["email"],
                "firstName": user["user"]["firstName"],
                "lastName": user["user"]["lastName"],
                "userName": user["user"]["userName"],
                "accountNumber": user["user"]["accountNumber"],
               },
               "code" : code
        }
        name: f"{ user["user"]["firstName"]} { user["user"]["lastName"]}"
        
        token = send_otp_code(user["user"]["email"], data, code, name)
        return { "status": "success", "msg": f"A new otp code has been sent to {user["user"]["email"]}", "token": token}
    
    except Exception as e: 
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Oops!...something went wrong",
            "description": str(e)
        })


@router.post("/forgot-password" , status_code=status.HTTP_200_OK)
async def forgot_password(userData:ForgotPasswordSchema, session:AsyncSession = Depends(session)):
    user =  await authService.get_user(email=userData.email, session=session)

    if(not user):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={
            "status": "error",
            "msg": "Invalid Credentials",
            "description": "Please enter a valid email address"
        })

    if(user is not None):
        token = send_reset_password_link(userData, user)
        return { "status": "success", "msg": f"Password reset link has been sent to {userData.email}", "token": token }
  
    
    

@router.post("/reset-password",  status_code=status.HTTP_200_OK)
async def reset_password(userData:ResetPasswordSchema,  resp:Response, session:AsyncSession = Depends(session)):

    email = loadUnsafeIdToken(userData.token)

    user = await authService.get_user(session, email)

    if (not user):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
                "status": "error",
                "msg": "Invalid Credentials",
                "description": "Please enter a valid email address"
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
                saveCookies(resp, "access", "", 0)
                saveCookies(resp, "refresh", "", 0)

                return { "status": "success", "msg": "Password update successful", "user": user}
            else:

                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                    "status": "error",
                    "msg": "Oops!...something went wrong",
                    "description": "An error occured verifying your account."
            })

@router.post("/refresh",  status_code=status.HTTP_200_OK)
async def refresh(resp:Response, user=Depends(refreshTokenBearer)):
    accessToken = generateJWTToken(type="access", data=user["user"])

    saveCookies(response=resp, key="access", val=accessToken, exp=1200)
    return {"status": "success", "msg": "A new access token has been created", }
    

@router.post("/signout")
async def sign_out(resp:Response):
      saveCookies(resp, "access", "", 0)
      saveCookies(resp, "refresh", "", 0)

      return { "status" : "success", "msg": "Logout successfully" }
