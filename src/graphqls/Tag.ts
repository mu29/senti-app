import gql from 'graphql-tag';

export const SUBSCRIBE_TAG = gql`
  mutation subscribeTag($id: ID!) {
    subscribeTag(id: $id) {
      profile {
        id
        tags
      }
    }
  }
`;

export const UNSUBSCRIBE_TAG = gql`
  mutation unsubscribeTag($id: ID!) {
    unsubscribeTag(id: $id) {
      profile {
        id
        tags
      }
    }
  }
`;

export const FETCH_POPULAR_TAGS = gql`
  query fetchPopularTags {
    popularTags {
      id
      storyCount
    }
  }
`;

export const FETCH_SEARCH_QUERY = gql`
  query fetchSearchQuery {
    searchQuery @client
  }
`;

export const SEARCH_TAGS = gql`
  query searchTags($id: String!, $cursor: ID) {
    searchTags(id: $id, cursor: $cursor) {
      tags {
        id
        storyCount
      }
      cursor
    }
  }
`;
