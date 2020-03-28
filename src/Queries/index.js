import gql from 'graphql-tag';

export const hostListQuery = gql`
  query hostLists($name: String!, $after: String!) {
    reddit {
      subreddit(name: $name) {
        hotListings(limit: 4, after: $after) {
          fullnameId
          title
          score
          url
        }
      }
    }
  }
`;
