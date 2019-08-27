import gql from 'graphql-tag';

export const SUBSCRIBE_TAG = gql`
  mutation subscribeTag($id: ID!, $name: String!) {
    subscribeTag(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const UNSUBSCRIBE_TAG = gql`
  mutation unsubscribeTag($id: ID!, $name: String!) {
    unsubscribeTag(id: $id, name: $name)
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
