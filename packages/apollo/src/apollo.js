const { GraphQLWsLink } = require("@apollo/client/link/subscriptions");
const { createClient } = require("graphql-ws");
const {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
  DocumentNode,
} = require("@apollo/client");
const { getMainDefinition } = require("@apollo/client/utilities");
const isNode = require("is-node");
const ws = require("ws");

const WS_URL = "wss://engaging-lamb-32.hasura.app/v1/graphql";
const HTTP_URL = "https://engaging-lamb-32.hasura.app/v1/graphql";
const ACCESS_TOKEN =
  "2zd0hMBzf8WTOy6qXg25XQCy7DLy3vE2ZIzuoq4uxfr82bk6TuSBf7p1mu8ScyJb";
const HEADERS = {
  headers: {
    "x-hasura-access-key": ACCESS_TOKEN,
  },
};

const wsLink = new GraphQLWsLink(
  createClient({
    url: WS_URL,
    webSocketImpl: isNode ? ws : null,
    connectionParams: () => {
      return HEADERS;
    },
  })
);

const httpLink = createHttpLink({
  uri: HTTP_URL,
  fetch,
  ...HEADERS,
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

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

exports.client = client;
