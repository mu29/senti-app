import gql from 'graphql-tag';

export const FETCH_MAIN_STORY_FEED = gql`
  query fetchMainStoryFeed($cursor: ID) {
    mainStoryFeed(cursor: $cursor) {
      stories {
        id
        cover
        description
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
        description
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
