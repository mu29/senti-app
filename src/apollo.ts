import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import merge from 'lodash/merge';
import ApolloClient from 'apollo-client';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import gql from 'graphql-tag';
import covers from 'constants/covers';
import { getLanguage } from 'utils';
import * as resolvers from './resolvers';
import config from './config';

export async function configureClient() {
  const customFetch = async (uri: RequestInfo, options?: RequestInit) => {
    const { currentUser } = firebase.auth();
    if (options && options.headers && currentUser) {
      (options.headers as any).Authorization = await currentUser.getIdToken();
    }

    return fetch(uri, options);
  };

  const link = new BatchHttpLink({
    uri: `${config.apiUrl}?language=${getLanguage()}`,
    fetch: customFetch,
  });

  const cache = new InMemoryCache();

  await persistCache({
    cache,
    storage: AsyncStorage as any,
  });

  const client = new ApolloClient({
    link,
    cache,
    resolvers: Object.values(resolvers).reduce((c, r) => merge(c, r), {}),
    typeDefs: gql`
      type Modal {
        id: ID!
        params: String
        isVisible: Boolean!
      }

      extend type Query {
        modal(id: ID!): Modal
        searchQuery: String
      }

      extend type Mutation {
        showModal(id: ID!): Boolean
        hideModal(id: ID!): Boolean
        shuffleCovers: Boolean
      }
    `,
  });

  const initialData = {
    data: {
      modals: [{
        __typename: 'Modal',
        id: 'Auth',
        params: null,
        isVisible: false,
      }, {
        __typename: 'Modal',
        id: 'Reply',
        params: null,
        isVisible: false,
      }, {
        __typename: 'Modal',
        id: 'Cover',
        params: null,
        isVisible: false,
      }],
      searchQuery: '',
      covers,
      draft: {
        __typename: 'Draft',
        cover: '',
        message: '',
      },
      candidate: {
        __typename: 'Candidate',
        name: null,
        gender: null,
      },
    },
  };

  client.cache.writeData(initialData);

  client.onResetStore(() => {
    client.cache.writeData(initialData);
    return Promise.resolve();
  });

  return client;
}

export default configureClient;
