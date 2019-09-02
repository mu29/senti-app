import gql from 'graphql-tag';

export const FETCH_MESSAGE_FEED = gql`
  query fetchMessageFeed($chattingId: ID!, $cursor: ID) {
    messageFeed(chattingId: $chattingId, cursor: $cursor) {
      messages {
        id
        audio {
          id
          url
          duration
        }
        user {
          id
          name,
        }
        readAt
        createdAt
      }
      cursor
    }
  }
`;

export const FETCH_MESSAGE = gql`
  query fetchMessage($chattingId: ID!, $id: ID!) {
    message(chattingId: $chattingId, id: $id) {
      id
      audio {
        id
        url
        duration
      }
      readAt
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation createMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      id
      audio {
        id
        url
        duration
      }
      user {
        id
        name,
      }
      readAt
      createdAt
    }
  }
`;
