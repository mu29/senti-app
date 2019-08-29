import gql from 'graphql-tag';

export const SUBSCRIBE_TAG = gql`
  mutation subscribeTag($tag: ID!) {
    subscribeTag(tag: $tag)
  }
`;

export const UNSUBSCRIBE_TAG = gql`
  mutation unsubscribeTag($tag: ID!) {
    unsubscribeTag(tag: $tag)
  }
`;

export const FETCH_POPULAR_TAGS = gql`
  query fetchPopularTags {
    popularTags {
      id
      name
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
  query searchTags($tag: String!, $cursor: ID) {
    searchTags(tag: $tag, cursor: $cursor) {
      tags {
        id
        name
        storyCount
      }
      cursor
    }
  }
`;
