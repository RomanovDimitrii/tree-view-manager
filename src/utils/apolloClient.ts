// apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const httpLink = new HttpLink({
  uri: 'http://80.90.190.26:8081/graphql'
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;
