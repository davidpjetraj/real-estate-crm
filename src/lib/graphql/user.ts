import { gql } from "@apollo/client";

export const GET_CURRENT_USER = gql`
  query Account {
  account {
    id
    first_name
    last_name
    name
    email
    phone
    birthday
    status
    deleted
    created_at
  }
}
`;
