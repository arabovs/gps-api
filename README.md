<h1 class="code-line" data-line-start=0 data-line-end=1 ><a id="GPS-API"></a>GPS-API</h1>
<p class="has-line-data" data-line-start="2" data-line-end="3">This application is part of my interview process with MYX Robotics and consists of a BE and FE applications.</p>
<p class="has-line-data" data-line-start="4" data-line-end="6">Backend:<br>
Node RestAPI with PostGre which takes HTTP request to store images to file system and database and provides image hosting</p>
<p class="has-line-data" data-line-start="7" data-line-end="9">Frontend:<br>
React MUI with PostGre that allows users to Upload, Delete images and interact with the RestAPI backend</p>
<p class="has-line-data" data-line-start="7" data-line-end="9">Database System:<br>
Hosted on Neon, connecting via Hasura GQL engine: https://cloud.hasura.io/project/bb874bd4-941b-461d-8aff-2a3901eea265/console/data/default/schema/public/tables/myx_image/browse</p>
<p class="has-line-data" data-line-start="10" data-line-end="15">Steps to run both applications:<br>
<pre><code>git clone <a href="https://github.com/arabovs/saa-interview-exercicse.git">https://github.com/arabovs/saa-interview-exercicse.git</a><br>
yarn<br>
yarn workspace be start<br>
yarn workspace fe start</p></code></pre><p class="has-line-data" data-line-start="17" data-line-end="23">BE Endpoints:<br>
<pre><code>POST uploading images - takes a file upload and stores it files system and database ( can be extended to handle multiple file uploads ):<br>
Endpoint: /api/image-upload<br>
Headers: Content-Type: from-data<br>
Req: “form-data”: (“image”, fileInput.files[0], &lt;input_file_name&gt;.&lt;ext&gt;)<br>
Res: “message”: “File uploaded successfully.”</p>

POST delete images - takes filename and deletes from database and filesystem ( can be extended to handle multiple deletions, or delete based on different criteria) :
    Endpoint: /api/image-delete
    Headers: Content-Type: application/json
    Req: &quot;raw&quot;: {&quot;image&quot;: &quot;&lt;input_file_name&gt;.&lt;ext&gt;&quot;}
    Res: &quot;message&quot;: &quot;File deleted successfully.&quot;

GET image - takes a filename and returns URI (or binary File)
    Endpoint: /api/image-get
    Headers: Content-Type: text-plain
    Req: &quot;raw&quot;: {&quot;uri&quot;: &quot;http://&lt;URL&gt;:3000/images/&lt;filename&gt;.&lt;ext&gt;&quot;}
    Res: &quot;uri&quot;: &quot;http://localhost:3000/images/undefined&quot;

GET image thumbnail - takes a filename and returns thumbnail's URI (or binary File)
    Endpoint: /api/thumbnail-get
    Headers: Content-Type: text-plain
    Req: &quot;raw&quot;: {&quot;uri&quot;: &quot;http://&lt;URL&gt;:3000/thumbnails/&lt;filename&gt;.&lt;ext&gt;&quot;}
    Res: &quot;uri&quot;: &quot;http://localhost:3000/thumbnails/undefined&quot;
   
GET all images within a Geographical Bounding Box - takes four parameters: Min Latitude, Max Latitude, Min Longitude, Max Longitude and returns an array of all images     within the GeoBB
    Endpoint: /api/image-get
    Headers: Content-Type: text-plain
    Req: &quot;raw&quot;: {
        &quot;minlat&quot;: 50.1,
        &quot;maxlat&quot;: 53,
        &quot;minlon&quot;: 1,
        &quot;maxlon&quot;: 2.5
    }
    Res: &quot;images&quot;: {
            &quot;myx_image&quot;: [
                {
                &quot;__typename&quot;: &quot;myx_image&quot;,
                &quot;id&quot;: &quot;23eccea6-5960-484b-b692-68553b7d828d&quot;,
                &quot;GPSLongitude&quot;: 2.056832583333333,
                &quot;GPSLatitude&quot;: 52.642868138888886,
                &quot;thumb_path&quot;: &quot;http://localhost:3000/thumbnails/thumbnail-06aea741a5dfa2182fc2730975d11add.jpeg&quot;,
                &quot;image_path&quot;: &quot;http://localhost:3000/images/06aea741a5dfa2182fc2730975d11add.jpeg&quot;
            },....
        ]
    }
</code></pre>
