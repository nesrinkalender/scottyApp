import React from 'react';
import {FavoritesProvider} from './FavoritesProvider';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from '@apollo/react-hooks';

const client = new ApolloClient({
  uri: 'https://www.graphqlhub.com/graphql',
});
export const Providers = ({children}) => {
  return (
    <ApolloProvider client={client}>
      <FavoritesProvider>{children}</FavoritesProvider>
    </ApolloProvider>
  );
};
