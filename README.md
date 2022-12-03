# myxrobotics

1. Running the apps
1.1 git clone https://github.com/arabovs/myxrobotics.git
1.1 yarn
1.2 yarn workspace be start
1.3 yarn workspace fe start 


2. BE Endpoints:
2.1 Uploading images - takes a file upload and stores it files system and database ( can be extended to handle multiple file uploads ): 
    Endpoint: /api/image-upload
    Headers: Content-Type: from-data
    Req: "form-data": ("image", fileInput.files[0], fileName)
    Res: "message": "File uploaded successfully."

2.2 Deleting images - takes filename and deletes from database and filesystem ( can be extended to handle multiple deletions, or delete based on different criteria) :
    Endpoint: /api/image-delete
    Headers: Content-Type: from-data
    Req: "form-data": ("image", fileInput.files[0], fileName)
    Res: "message": "File uploaded successfully."
