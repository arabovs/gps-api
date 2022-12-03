import React from "react";
import { client } from "apollo";
import { gql, useSubscription } from "@apollo/client";
import { Container, Grid, Button, Box, IconButton, Input } from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

const API_ENDPOINT_UPLOAD = "http://localhost:3000/api/image-upload";
const API_ENDPOINT_DELETE = "http://localhost:3000/api/image-delete";

const IndexPage = () => {
  const { data, loading, error } = useSubscription(
    gql`
      subscription($limit: Int) {
        myx_image(limit: $limit) {
          id
          thumb_path
          image
        }
      }
    `,
    {
      variables: {
        limit: 30,
      },
      client,
    }
  );
  if (loading) return null;
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      <Container
        sx={{
          mt: 2,
          mb: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formdata = new FormData();
                formdata.append(
                  "image",
                  e.target.myFile.files[0],
                  e.target.myFile.files[0].name
                );
                fetch(API_ENDPOINT_UPLOAD, {
                  method: "POST",
                  body: formdata,
                  redirect: "follow",
                });
              }}
            >
              <Input type="file" id="myFile" name="filename" />
              <Button type="submit">Submit file</Button>
            </form>
          </Grid>
          {data.myx_image.map(({ thumb_path, image }) => (
            <Grid item xs={12} sm={6} md={4}>
              <Box>
                <img src={thumb_path} width={250} />
                <Button
                  onClick={() => {
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    fetch(API_ENDPOINT_DELETE, {
                      headers: myHeaders,
                      method: "POST",
                      body: JSON.stringify({ image }),
                      redirect: "follow",
                      mode: "cors",
                    });
                  }}
                  variant="contained"
                  component="label"
                >
                  Delete Image
                </Button>
                <IconButton size="small" sx={{ mb: 3 }}>
                  <RemoveRedEyeOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default IndexPage;
