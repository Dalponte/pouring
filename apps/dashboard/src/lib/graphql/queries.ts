import { gql } from "@apollo/client";

// Client Queries
export const GET_CLIENTS = gql`
  query GetClients {
    getClients {
      id
      name
      meta
      createdAt
      updatedAt
      deletedAt
      tags {
        id
        code
        reference
      }
    }
  }
`;

export const GET_CLIENT = gql`
  query GetClient($id: String!) {
    getClient(id: $id) {
      id
      name
      meta
      createdAt
      updatedAt
      deletedAt
      tags {
        id
        code
        reference
      }
    }
  }
`;

// Tap Queries
export const GET_TAPS = gql`
  query GetTaps($includeDeleted: Boolean) {
    getTaps(includeDeleted: $includeDeleted) {
      id
      name
      meta
      deleted
      createdAt
      updatedAt
      dispenses {
        id
        type
        createdAt
      }
    }
  }
`;

export const GET_TAP = gql`
  query GetTap($id: String!, $includeDeleted: Boolean) {
    getTap(id: $id, includeDeleted: $includeDeleted) {
      id
      name
      meta
      deleted
      createdAt
      updatedAt
      dispenses {
        id
        type
        meta
        createdAt
        client {
          id
          name
        }
      }
    }
  }
`;

// Tag Queries
export const GET_TAGS = gql`
  query GetTags {
    getTags {
      id
      code
      reference
      meta
      createdAt
      updatedAt
      deletedAt
      clients {
        id
        name
      }
    }
  }
`;

export const GET_TAG = gql`
  query GetTag($id: Int!) {
    getTag(id: $id) {
      id
      code
      reference
      meta
      createdAt
      updatedAt
      deletedAt
      clients {
        id
        name
      }
    }
  }
`;

// Dispense Queries
export const GET_DISPENSES = gql`
  query GetDispenses {
    getDispenses {
      id
      type
      meta
      clientId
      tapId
      createdAt
      updatedAt
      client {
        id
        name
      }
      tap {
        id
        name
      }
    }
  }
`;

export const GET_DISPENSE = gql`
  query GetDispense($id: Float!) {
    getDispense(id: $id) {
      id
      type
      meta
      clientId
      tapId
      createdAt
      updatedAt
      client {
        id
        name
      }
      tap {
        id
        name
      }
    }
  }
`;
