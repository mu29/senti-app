import gql from 'graphql-tag';

export const FETCH_CHATTING = gql`
  query fetchChatting($id: ID!) {
    chatting(id: $id) {
      id
      partner {
        id
        name
        photoUrl
      }
      messageCount
      unreadMessageCount
      updatedAt
    }
  }
`;

export const FETCH_CHATTING_FEED = gql`
  query fetchChattingFeed($cursor: ID) {
    chattingFeed(cursor: $cursor) {
      chattings {
        id
        partner {
          id
          name
          photoUrl
        }
        messageCount
        unreadMessageCount
        updatedAt
      }
      cursor
    }
  }
`;

export const CREATE_CHATTING = gql`
  mutation createChatting($input: CreateChattingInput!) {
    createChatting(input: $input) {
      chatting {
        id
        partner {
          id
          name
          photoUrl
        }
        messageCount
        unreadMessageCount
        updatedAt
      }
      profile {
        coin
      }
    }
  }
`;
