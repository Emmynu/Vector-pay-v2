from redis import asyncio as aioredis
from .config import config
from typing import Optional
import socket
           
redis_client = None


async def init_redis():
    global redis_client

    redis_client = aioredis.from_url(config.REDIS_URL, 
    decode_responses = True, 
    socket_timeout=5.0, 
    # socket_keepalive=True, 
    # socket_options=[(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)],
    socket_connect_timeout=5.0, 
    ssl_cert_reqs=None, 
    health_check_interval = 15, 
    retry_on_timeout = True, 
    # retry_on_error = [
    #     aioredis.ConnectionError, 
    #     aioredis.TimeoutError
    # ],

    )

    await redis_client.ping()

async def redis_close():
    global redis_client
    if(redis_client):
        await redis_client.aclose()


async def redis_set_value(key:str, val:str, ex:Optional[int]):
    result = await redis_client.set(key, val, ex)
    return result 

async def redis_get_value(key:str,):
    result = await redis_client.get(key)
    return result if result is not None else False


async def redis_delete_value(key:str,):
    result = await redis_client.delete(key)
    return result 







