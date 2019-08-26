import merge from 'lodash/merge';
import ApolloClient from 'apollo-client';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { getLanguage } from 'utils';
import * as resolvers from './resolvers';
import config from './config';
import firebase from 'react-native-firebase';

const customFetch = (uri: RequestInfo, options?: RequestInit) => {
  const { currentUser } = firebase.auth();
  if (options && options.headers && currentUser) {
    (options.headers as any).Authorization = currentUser.uid;
  }

  return fetch(uri, options);
};

const link = new BatchHttpLink({
  uri: `${config.apiUrl}?language=${getLanguage()}`,
  fetch: customFetch,
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  resolvers: Object.values(resolvers).reduce((c, r) => merge(c, r), {}),
  typeDefs: gql`
    type Modal {
      id: ID!
      isVisible: Boolean!
    }

    extend type Query {
      modal(id: ID!): Modal
    }

    extend type Mutation {
      showModal(id: ID!): Boolean
      hideModal(id: ID!): Boolean
    }
  `,
});

client.cache.writeData({
  data: {
    modals: [{
      __typename: 'Modal',
      id: 'Auth',
      isVisible: false,
    }],
  },
});

export default client;
