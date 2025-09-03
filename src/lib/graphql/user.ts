import { gql } from "@apollo/client";

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      first_name
      last_name
      email
      avatar
      role
    }
  }
`;
