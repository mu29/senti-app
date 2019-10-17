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
          name
        }
        readAt
        createdAt
      }
      cursor
    }
  }
`;

export const PURCHASE_MESSAGE = gql`
  mutation purchaseMessage($chattingId: ID!, $id: ID!) {
    purchaseMessage(chattingId: $chattingId, id: $id) {
      message {
        id
        audio {
          id
          url
          duration
        }
        readAt
      }
      chatting {
        id
        unreadMessageCount
      }
      profile {
        id
        coin
        canUseFreeCoinAt
        updatedAt
      }
    }
  }
`;

export const READ_MESSAGE = gql`
  mutation readMessage($chattingId: ID!, $id: ID!) {
    readMessage(chattingId: $chattingId, id: $id) {
      message {
        id
        readAt
      }
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation createMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      message {
        id
        audio {
          id
          url
          duration
        }
        user {
          id
          name
        }
        readAt
        createdAt
      }
    }
  }
`;
