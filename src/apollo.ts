import merge from 'lodash/merge';
import ApolloClient from 'apollo-client';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import * as resolvers from './resolvers';
import config from './config';

const client = new ApolloClient({
  link: new BatchHttpLink({ uri: config.apiUrl }),
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
