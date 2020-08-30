import {
  ApolloLink,
  HttpLink,
  split,
  ApolloClient,
  InMemoryCache,
  Observable,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { Platform, AsyncStorage } from 'react-native';

const HTTP_URL = 'http://';
const HTTPS_URL = 'https://';
const WS_URL = 'ws://';
const WSS_URL = 'wss://';
const DEV_URL = `${Platform.OS === 'ios' ? 'localhost' : '192.168.43.134'}:5000/graphql`;
const BASE_URL = 'https://movies-api-gql.herokuapp.com/graphql';

const httpLink = new HttpLink({
  uri: `${HTTP_URL}${DEV_URL}`,
  credentials: 'include',
});

// Create a WebSocket link
const wsLink = new WebSocketLink({
  uri: `${WS_URL}${DEV_URL}`,
  options: {
    lazy: true,
    reconnect: true
  }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const request = async (operation) => {
  const token = await AsyncStorage.getItem('token');
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });
};

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle;
      Promise.resolve(operation)
        .then(oper => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          });
        })
        .catch(observer.error.bind(observer));
        return () => {
          if (handle) handle.unsubscribe();
        }
    })
);

const client = new ApolloClient({
  link: ApolloLink.from([requestLink, link]),
  cache: new InMemoryCache(),
});

export default client;
