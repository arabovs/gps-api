import os
import requests
import time

url = "http://localhost:3000/api/image-upload"
directory = '157_photos'

x = 0
for filename in os.listdir(directory):
    f = os.path.join(directory, filename)
    if os.path.isfile(f):
        payload={}
        files=[
          ('image',("157_photos/" + filename,open("157_photos/" + filename,'rb'),'image/jpeg'))
        ]
        headers = {}
        response = requests.request("POST", url, headers=headers, data=payload, files=files)
        x+=1
        if x % 55 == 0:
          time.sleep(60)
          x = 0
        