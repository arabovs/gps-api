import os
import requests

url = "http://localhost:3000/api/image-upload"
directory = 'testdata'

x = 0
for filename in os.listdir(directory):
    f = os.path.join(directory, filename)
    if os.path.isfile(f):
        print(filename)
        payload={}
        files=[
          ('image',("testdata/" + filename,open("testdata/" + filename,'rb'),'image/jpeg'))
        ]
        headers = {}

        response = requests.request("POST", url, headers=headers, data=payload, files=files)

        print(response.text)
        x+=1
        if x == 30:
          break