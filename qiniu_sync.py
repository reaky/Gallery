# -*- coding: utf-8 -*-
from qiniu import Auth, put_file, etag, urlsafe_base64_encode
from qiniu import BucketManager
import qiniu.config
import json

#需要填写你的 Access Key 和 Secret Key
access_key = 'bb59XAvY0gc3PdegqEgllJHqJ5oUXfz-RE5j346L'
secret_key = '87J0UIe84qSyyZg_0_-I7vUv0KIBjgZpyGIIXXXD'
#构建鉴权对象
q = Auth(access_key, secret_key)
#要上传的空间
bucket_name = 'reaky'

def upload_file(bucket_name, localfile, key=''):
    #上传到七牛后保存的文件名
    #key = 'my-python-logo.png';
    #生成上传 Token，可以指定过期时间等
    token = q.upload_token(bucket_name, key, 3600)
    #要上传文件的本地路径
    #localfile = './sync/bbb.jpg'

    ret, info = put_file(token, key, localfile)
    print(info)
    assert ret['key'] == key
    assert ret['hash'] == etag(localfile)
    print("upload %s ok"%localfile)

def delete_file(bucket_name, key):
    #初始化BucketManager
    bucket = BucketManager(q)
    #你要测试的空间， 并且这个key在你空间中存在
    #key = 'python-logo.png'
    #删除bucket_name 中的文件 key
    ret, info = bucket.delete(bucket_name, key)
    print(info)
    assert ret == {}
    print("delete %s ok"%key)
