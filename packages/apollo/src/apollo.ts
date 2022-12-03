import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
  DocumentNode,
} from "@apollo/client";
import isNode from "is-node";
import ws from "ws";

const wsLink = new GraphQLWsLink(
  createClient({
    url: "wss://engaging-lamb-32.hasura.app/v1/graphql",
    webSocketImpl: isNode ? ws : null,
    connectionParams: () => {
      return {
        headers: {
          "x-hasura-access-key":
            "2zd0hMBzf8WTOy6qXg25XQCy7DLy3vE2ZIzuoq4uxfr82bk6TuSBf7p1mu8ScyJb",
        },
      };
    },
  })
);

const httpLink = createHttpLink({
  uri: "https://engaging-lamb-32.hasura.app/v1/graphql",
  fetch,
  headers: {
    "x-hasura-access-key":
      "2zd0hMBzf8WTOy6qXg25XQCy7DLy3vE2ZIzuoq4uxfr82bk6TuSBf7p1mu8ScyJb",
  },
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});
function getMainDefinition(query: DocumentNode) {
  throw new Error("Function not implemented.");
}
