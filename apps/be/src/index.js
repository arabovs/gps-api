const express = require("express");
const { client } = require("apollo");
const fetch = require("cross-fetch");
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");
const ExifImage = require("exif").ExifImage;
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const { gql } = require("@apollo/client");

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/images", express.static("images"));
app.use("/thumbnails", express.static("thumbnails"));

const URI_URL = "http://localhost:3000/images/";
const THUMBNAIL_URL = "http://localhost:3000/thumbnails/";

// Postgre insert image to db
const insertImagePostGre = async (image, GPSLatitude, GPSLongitude) => {
  return client.mutate({
    mutation: gql`
      mutation GetRates(
        $image: String!
        $image_path: String!
        $thumb_path: String!
        $GPSLatitude: float8!
        $GPSLongitude: float8!
      ) {
        insert_myx_image(
          objects: {
            image: $image
            image_path: $image_path
            thumb_path: $thumb_path
            GPSLatitude: $GPSLatitude
            GPSLongitude: $GPSLongitude
          }
        ) {
          affected_rows
        }
      }
    `,
    variables: {
      image,
      image_path: URI_URL + image,
      thumb_path: THUMBNAIL_URL + "thumbnail-" + image,
      GPSLatitude: GPSLatitude,
      GPSLongitude: GPSLongitude,
    },
  });
};

// Postgre get all images within a Geographical Bounding Box
const getGeoBB = async (minlat, maxlat, minlon, maxlon) => {
  return client.query({
    query: gql`
      query MyQuery(
        $minlat: float8!
        $maxlat: float8!
        $minlon: float8!
        $maxlon: float8!
      ) {
        myx_image(
          where: {
            GPSLatitude: { _gte: $minlat }
            GPSLongitude: { _gte: $minlon }
            _and: {
              GPSLatitude: { _lte: $maxlat }
              GPSLongitude: { _lte: $maxlon }
            }
          }
          order_by: { GPSLatitude: asc, GPSLongitude: asc }
          limit: 10
        ) {
          id
          GPSLongitude
          GPSLatitude
          thumb_path
          image_path
        }
      }
    `,
    variables: {
      minlat,
      maxlat,
      minlon,
      maxlon,
    },
  });
};

// Postgre delete image
const deletePostGre = async (image) => {
  return client.mutate({
    mutation: gql`
      mutation GetRates($image: String!) {
        delete_myx_image(where: { image: { _eq: $image } }) {
          affected_rows
        }
      }
    `,
    variables: {
      image,
    },
  });
};

// processes image EXIF data and stores it to database
const processImage = async (file_name) => {
  try {
    new ExifImage(
      { image: "images/" + file_name },
      async function (error, exifData) {
        if (error) console.log("Error: " + error.message);
        else {
          console.log(exifData.gps);
          const GPSLatitude =
            exifData.gps["GPSLatitude"][0] +
            exifData.gps["GPSLatitude"][1] / 60 +
            exifData.gps["GPSLatitude"][2] / 3600;
          const GPSLongitude =
            exifData.gps["GPSLongitude"][0] +
            exifData.gps["GPSLongitude"][1] / 60 +
            exifData.gps["GPSLongitude"][2] / 3600;

          setTimeout(function cb() {
            sharp("./images/" + file_name)
              .resize(250, 250)
              .toFile(
                "thumbnails/" + "thumbnail-" + file_name,
                (err, resizeImage) => {
                  if (err) {
                    console.log(err);
                  } else {
                    insertImagePostGre(file_name, GPSLatitude, GPSLongitude);
                  }
                }
              );
          }, 500);
        }
      }
    );
  } catch (error) {
    console.log("Error: " + error.message);
  }
};

// Storing image to file and image processing
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    const file_name = file.originalname;
    console.log(file_name);
    try {
      setTimeout(function cb() {
        processImage(file_name);
      }, 500);
    } catch (error) {
      console.log("unable to save file");
    }
    cb(null, file_name);
  },
});

const upload = multer({ storage: storage });

// Delete file from file system
const deleteFile = (file) => {
  fs.unlink("images/" + file, (err) => {
    if (err) {
      console.error("File missing");
      return;
    }
    console.log("File deleted: " + file);
  });
};

/** Endpoints */
// Upload Image
app.post("/api/image-upload", upload.single("image"), (req, res) => {
  const image = req.image;
  res.json({ message: "File uploaded successfully.", image });
  console.log("Image saved in images folder");
});

// Delete Image
app.post("/api/image-delete", (req, res) => {
  console.log(req.body);
  deleteFile(req.body.image);
  deletePostGre(req.body.image);
  res.json({ message: "File deleted successfully." });
});

// Get Image
app.get("/api/image-get", function (req, res) {
  res.json({ uri: URI_URL + req.body.file });
  //res.sendFile("images/" + req.body.file, { root: "." });
});

// Get Image's thumbnail
app.get("/api/thumbnail-get", async function (req, res) {
  res.json({ uri: THUMBNAIL_URL + "thumbnail-" + req.body.file });
  //res.sendFile("images/" + "thumbnail-" + req.body.file, { root: "." });
});

// Get images within a Geographical Bounding Box
app.get("/api/image-geobb-get", async function (req, res) {
  const results = await getGeoBB(
    req.body.minlat,
    req.body.maxlat,
    req.body.minlon,
    req.body.maxlon
  );

  images = results.data;
  res.json({ images });
});

app.listen(3000, () => {
  console.log("Server started on port 3000...");
});
