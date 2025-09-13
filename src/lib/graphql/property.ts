import { gql } from "@apollo/client";

export const GET_PROPERTIES = gql`
  query GetProperties {
    properties {
      id
      title
      description
      price
      location
      bedrooms
      bathrooms
      area
      status
      created_at
      updated_at
    }
  }
`;

export const GET_PROPERTY_BY_ID = gql`
  query GetPropertyById($id: ID!) {
    property(id: $id) {
      id
      title
      description
      price
      location
      bedrooms
      bathrooms
      area
      status
      images {
        id
        url
        alt
      }
      agent {
        id
        name
        email
        phone
      }
      created_at
      updated_at
    }
  }
`;

export const CREATE_PROPERTY = gql`
  mutation CreateProperty($input: CreatePropertyInput!) {
    createProperty(input: $input) {
      id
      title
      description
      price
      location
      bedrooms
      bathrooms
      area
      status
      created_at
    }
  }
`;

export const UPDATE_PROPERTY = gql`
  mutation UpdateProperty($id: ID!, $input: UpdatePropertyInput!) {
    updateProperty(id: $id, input: $input) {
      id
      title
      description
      price
      location
      bedrooms
      bathrooms
      area
      status
      updated_at
    }
  }
`;

export const DELETE_PROPERTY = gql`
  mutation DeleteProperty($id: ID!) {
    deleteProperty(id: $id) {
      success
      message
    }
  }
`;
