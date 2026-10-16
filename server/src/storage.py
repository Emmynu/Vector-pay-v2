import boto3
from botocore.config import Config
from src.config import config
from fastapi import File, status, HTTPException, UploadFile
import filetype
from datetime import datetime


s3_client = boto3.client(
    "s3",
    aws_access_key_id = config.SUPABASE_STORAGE_ACCESS_KEY,
    aws_secret_access_key = config.SUPABASE_STORAGE_SECRET_KEY,
    region_name=config.SUPABASE_STORAGE_REGION_NAME,
    endpoint_url=config.SUPABASE_STORAGE_ENDPOINT_URL,
    config = Config(signature_version="s3v4", s3={ "addressing_style" : "path" })
)


MAX_SIZE = 1024 * 1024 * 20
CHUNK_SIZE = 1024 * 1024 * 1
SUPABASE_STORAGE_URL = "https://lgbwtjxyjaljjpzxytfx.supabase.co/storage/v1/object/public"


async def handle_file_type(mime_types:dict, file: UploadFile = File(...)):
    if(file.content_type not in mime_types):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Invalid File Format Uploaded",
            "description": "Please upload a valid image file in JPEG, JPG, or PNG format."
        })

    magic_numbers = await file.read(2048)

    await file.seek(0)

    file_type = filetype.guess(magic_numbers)

    if(not filetype):
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={
            "status": "error",
            "msg": "Unable to determine real file type.",
            "description": "The server could not verify the file signature. Please try again with a different image."
        })

    if(file_type.mime not in mime_types):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Invalid File Format Uploaded",
            "description": "Please upload a valid image file in JPEG, JPG, or PNG format."
        }) 

    return file


async def handle_file_size(file: UploadFile = File(...)):
    total_size_in_bytes = 0

    if(file.size > MAX_SIZE):
        raise HTTPException(status_code=status.HTTP_413_CONTENT_TOO_LARGE, detail={
            "status": "error",
            "msg": "File Size Exceeded",
            "description": "The uploaded file exceeds the maximum allowed size. Please upload a file smaller than 20MB."
        })

    while chunk := await file.read(CHUNK_SIZE):
        total_size_in_bytes += len(chunk)

        if(total_size_in_bytes > MAX_SIZE):
            await file.close()
            raise HTTPException(status_code=status.HTTP_413_CONTENT_TOO_LARGE, detail={
                "status": "error",
                "msg": "File Size Exceeded",
                "description": "The uploaded file exceeds the maximum allowed size. Please upload a file smaller than 20MB."
            })

    await file.seek(0)

    return file

        
async def handle_upload(mime_types:dict, bucket:str, key:str, document : UploadFile = File(...)):
    docs = await handle_file_type(mime_types, document)

    if(docs):
        file = await handle_file_size(docs)

        if(file):
            try:
                s3_client.upload_fileobj(
                    Fileobj=file.file,
                    Bucket=bucket,
                    Key=key,
                    ExtraArgs={ "ContentType": file.content_type, "CacheControl": "no-cache" }
                )
    
                url = f"{SUPABASE_STORAGE_URL}/{bucket}/{key}?v={datetime.now().timestamp()}"
                
                return url
            except Exception as e:
                print(str(e))
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={
                    "status": "error",
                    "msg": "File Upload Failed",
                    "description": "The server encountered an error while uploading the file. Please try again later."+ str(e)
                })


def get_file_url(bucket:str, key:str):
    url = s3_client.generate_presigned_url(
        ClientMethod='get_object',
        Params={
            'Bucket': bucket,
            'Key': key
        },
        ExpiresIn=3600  # URL expiration time in seconds (1 hour)
    )

    return url