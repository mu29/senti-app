import gql from 'graphql-tag';

export const FETCH_DRAFT = gql`
  query fetchDraft {
    draft @client {
      cover
      message
    }
  }
`;

export const UPDATE_DRAFT = gql`
  mutation updateDraft($cover: String, $message: String) {
    updateDraft(cover: $cover, message: $message) @client
  }
`;

export const FETCH_MAIN_STORY_FEED = gql`
  query fetchMainStoryFeed($cursor: ID) {
    mainStoryFeed(cursor: $cursor) {
      stories {
        id
        cover
        message
        tags
        user {
          id
          name
          photoUrl
        }
        audio {
          id
          url
          duration
        }
      }
      cursor
    }
  }
`;

export const FETCH_TAG_STORY_FEED = gql`
  query fetchTagStoryFeed($tagId: ID!, $cursor: ID) {
    tagStoryFeed(tagId: $tagId, cursor: $cursor) {
      stories {
        id
        cover
        message
        tags
        user {
          id
          name
          photoUrl
        }
        audio {
          id
          url
          duration
        }
      }
      cursor
    }
  }
`;

export const CREATE_STORY = gql`
  mutation createStory($input: CreateStoryInput!) {
    createStory(input: $input) {
      id
      cover
      message
      tags
      user {
        id
        name
        photoUrl
      }
      audio {
        id
        url
        duration
      }
    }
  }
`;
