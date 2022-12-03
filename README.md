# myxrobotics

This application is part of my interview process with MYX Robotics and consists of a BE and FE applications.

BE: 
Node RestAPI with PostGre which takes HTTP request to store images to file system and database and provides image hosting

FE:
React MUI with PostGre

Steps to run both applications:
git clone https://github.com/arabovs/myxrobotics.git
yarn
yarn workspace be start
yarn workspace fe start 


BE Endpoints:
POST uploading images - takes a file upload and stores it files system and database ( can be extended to handle multiple file uploads ): 
    Endpoint: /api/image-upload
    Headers: Content-Type: from-data
    Req: "form-data": ("image", fileInput.files[0], <input_file_name>.<ext>)
    Res: "message": "File uploaded successfully."

POST delete images - takes filename and deletes from database and filesystem ( can be extended to handle multiple deletions, or delete based on different criteria) :
    Endpoint: /api/image-delete
    Headers: Content-Type: application/json
    Req: "raw": {"image": "<input_file_name>.<ext>"}
    Res: "message": "File deleted successfully."

GET image - takes a filename and returns URI (or binary File)
    Endpoint: /api/image-get
    Headers: Content-Type: text-plain
    Req: "raw": {"uri": "http://<URL>:3000/images/<filename>.<ext>"}
    Res: "uri": "http://localhost:3000/images/undefined"
    
GET image thumbnail - takes a filename and returns thumbnail's URI (or binary File)
    Endpoint: /api/thumbnail-get
    Headers: Content-Type: text-plain
    Req: "raw": {"uri": "http://<URL>:3000/thumbnails/<filename>.<ext>"}
    Res: "uri": "http://localhost:3000/thumbnails/undefined"
   
GET all images within a Geographical Bounding Box - takes four parameters: Min Latitude, Max Latitude, Min Longitude, Max Longitude and returns an array of all images within the GeoBB
    Endpoint: /api/image-get
    Headers: Content-Type: text-plain
    Req: "raw": {
        "minlat": 50.1,
        "maxlat": 53,
        "minlon": 1,
        "maxlon": 2.5
    }
    Res: "images": {
            "myx_image": [
                {
                    "__typename": "myx_image",
                    "id": "23eccea6-5960-484b-b692-68553b7d828d",
                    "GPSLongitude": 2.056832583333333,
                    "GPSLatitude": 52.642868138888886,
                    "thumb_path": "http://localhost:3000/thumbnails/thumbnail-06aea741a5dfa2182fc2730975d11add.jpeg",
                    "image_path": "http://localhost:3000/images/06aea741a5dfa2182fc2730975d11add.jpeg"
                },


