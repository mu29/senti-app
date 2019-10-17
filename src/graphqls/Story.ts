import gql from 'graphql-tag';

export const FETCH_DRAFT = gql`
  query fetchDraft {
    draft @client {
      cover
      tags
    }
  }
`;

export const UPDATE_DRAFT = gql`
  mutation updateDraft($cover: String, $tags: [String]) {
    updateDraft(cover: $cover, tags: $tags) @client
  }
`;

export const FETCH_MAIN_STORY_FEED = gql`
  query fetchMainStoryFeed($cursor: ID) {
    mainStoryFeed(cursor: $cursor) {
      stories {
        id
        cover
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
        createdAt
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
        createdAt
      }
      cursor
    }
  }
`;

export const FETCH_MY_STORY_FEED = gql`
  query fetchMyStoryFeed($cursor: ID) {
    myStoryFeed(cursor: $cursor) {
      stories {
        id
        cover
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
        createdAt
      }
      cursor
    }
  }
`;

export const CREATE_STORY = gql`
  mutation createStory($input: CreateStoryInput!) {
    createStory(input: $input) {
      story {
        id
        cover
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
        createdAt
      }
    }
  }
`;

export const DELETE_STORY = gql`
  mutation deleteStory($id: ID!) {
    deleteStory(id: $id)
  }
`;
