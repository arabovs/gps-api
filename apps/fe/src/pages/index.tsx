import React from "react";
import { client } from "apollo";
import { gql, useSubscription, useMutation, useQuery } from "@apollo/client";
import {
  Container,
  Grid,
  Button,
  Box,
  IconButton,
  Input,
  Pagination,
  useMediaQuery,
} from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
const API_ENDPOINT_UPLOAD = "http://localhost:3000/api/image-upload";
const API_ENDPOINT_DELETE = "http://localhost:3000/api/image-delete";

const IndexPage = () => {
  const [page, setPage] = React.useState(1);
  const handlePageChange = (event, value: number) => {
    setPage(value);
  };
  const [changeStarred] = useMutation(
    gql`
      mutation MyMutation($starred: Boolean = true, $id: uuid!) {
        update_myx_image_by_pk(
          pk_columns: { id: $id }
          _set: { starred: $starred }
        ) {
          id
        }
      }
    `,
    { client }
  );

  const paginationCountQuery = useQuery(
    gql`
      query MyQuery {
        myx_image_aggregate {
          aggregate {
            count
          }
        }
      }
    `,
    { client }
  );

  const { data, loading, error } = useSubscription(
    gql`
      subscription($limit: Int, $offset: Int) {
        myx_image(
          limit: $limit
          order_by: { created_at: asc }
          offset: $offset
        ) {
          id
          thumb_path
          image
          starred
        }
      }
    `,
    {
      variables: {
        limit: 30,
        offset: 30 * page - 30,
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
          {data.myx_image.map(({ thumb_path, image, starred, id }) => (
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
                {starred ? (
                  <IconButton
                    onClick={() => {
                      changeStarred({ variables: { id, starred: false } });
                    }}
                    size="small"
                    sx={{ mb: 3 }}
                  >
                    <Star fontSize="small" />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      changeStarred({ variables: { id } });
                    }}
                    size="small"
                    sx={{ mb: 3 }}
                  >
                    <StarBorder fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </Grid>
          ))}
          <Grid item sm={12} sx={{ display: "flex", justifyContent: "center" }}>
            {paginationCountQuery?.data && (
              <Pagination
                count={Math.ceil(
                  paginationCountQuery.data?.myx_image_aggregate.aggregate
                    .count / 30
                )}
                page={page}
                onChange={handlePageChange}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default IndexPage;
