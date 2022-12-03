<h1 class="code-line" data-line-start=0 data-line-end=1 ><a id="myxrobotics_0"></a>myxrobotics</h1>
<p class="has-line-data" data-line-start="2" data-line-end="3">This application is part of my interview process with MYX Robotics and consists of a BE and FE applications.</p>
<p class="has-line-data" data-line-start="4" data-line-end="6">BE:<br>
Node RestAPI with PostGre which takes HTTP request to store images to file system and database and provides image hosting</p>
<p class="has-line-data" data-line-start="7" data-line-end="9">FE:<br>
React MUI with PostGre</p>
<p class="has-line-data" data-line-start="10" data-line-end="15">Steps to run both applications:<br>
git clone <a href="https://github.com/arabovs/myxrobotics.git">https://github.com/arabovs/myxrobotics.git</a><br>
yarn<br>
yarn workspace be start<br>
yarn workspace fe start</p>
<p class="has-line-data" data-line-start="17" data-line-end="23">BE Endpoints:<br>
POST uploading images - takes a file upload and stores it files system and database ( can be extended to handle multiple file uploads ):<br>
Endpoint: /api/image-upload<br>
Headers: Content-Type: from-data<br>
Req: “form-data”: (“image”, fileInput.files[0], &lt;input_file_name&gt;.&lt;ext&gt;)<br>
Res: “message”: “File uploaded successfully.”</p>
<p class="has-line-data" data-line-start="24" data-line-end="29">POST delete images - takes filename and deletes from database and filesystem ( can be extended to handle multiple deletions, or delete based on different criteria) :<br>
Endpoint: /api/image-delete<br>
Headers: Content-Type: application/json<br>
Req: “raw”: {“image”: “&lt;input_file_name&gt;.&lt;ext&gt;”}<br>
Res: “message”: “File deleted successfully.”</p>
<p class="has-line-data" data-line-start="30" data-line-end="35">GET image - takes a filename and returns URI (or binary File)<br>
Endpoint: /api/image-get<br>
Headers: Content-Type: text-plain<br>
Req: “raw”: {“uri”: “http://&lt;URL&gt;:3000/images/&lt;filename&gt;.&lt;ext&gt;”}<br>
Res: “uri”: &quot;<a href="http://localhost:3000/images/undefined">http://localhost:3000/images/undefined</a>&quot;</p>
<p class="has-line-data" data-line-start="36" data-line-end="41">GET image thumbnail - takes a filename and returns thumbnail’s URI (or binary File)<br>
Endpoint: /api/thumbnail-get<br>
Headers: Content-Type: text-plain<br>
Req: “raw”: {“uri”: “http://&lt;URL&gt;:3000/thumbnails/&lt;filename&gt;.&lt;ext&gt;”}<br>
Res: “uri”: &quot;<a href="http://localhost:3000/thumbnails/undefined">http://localhost:3000/thumbnails/undefined</a>&quot;</p>
<p class="has-line-data" data-line-start="42" data-line-end="61">GET all images within a Geographical Bounding Box - takes four parameters: Min Latitude, Max Latitude, Min Longitude, Max Longitude and returns an array of all images within the GeoBB<br>
Endpoint: /api/image-get<br>
Headers: Content-Type: text-plain<br>
Req: “raw”: {<br>
“minlat”: 50.1,<br>
“maxlat”: 53,<br>
“minlon”: 1,<br>
“maxlon”: 2.5<br>
}<br>
Res: “images”: {<br>
“myx_image”: [<br>
{<br>
“__typename”: “myx_image”,<br>
“id”: “23eccea6-5960-484b-b692-68553b7d828d”,<br>
“GPSLongitude”: 2.056832583333333,<br>
“GPSLatitude”: 52.642868138888886,<br>
“thumb_path”: &quot;<a href="http://localhost:3000/thumbnails/thumbnail-06aea741a5dfa2182fc2730975d11add.jpeg">http://localhost:3000/thumbnails/thumbnail-06aea741a5dfa2182fc2730975d11add.jpeg</a>&quot;,<br>
“image_path”: &quot;<a href="http://localhost:3000/images/06aea741a5dfa2182fc2730975d11add.jpeg">http://localhost:3000/images/06aea741a5dfa2182fc2730975d11add.jpeg</a>&quot;<br>
},</p>
