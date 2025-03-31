import { gql } from "@apollo/client";

// Client Mutations
export const CREATE_CLIENT = gql`
  mutation CreateClient($createClientInput: CreateClientInput!) {
    createClient(createClientInput: $createClientInput) {
      id
      name
      meta
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CLIENT = gql`
  mutation UpdateClient($id: String!, $updateClientInput: UpdateClientInput!) {
    updateClient(id: $id, updateClientInput: $updateClientInput) {
      id
      name
      meta
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_CLIENT = gql`
  mutation DeleteClient($id: String!) {
    deleteClient(id: $id) {
      id
      name
    }
  }
`;

// Tap Mutations
export const CREATE_TAP = gql`
  mutation CreateTap($name: String!, $meta: JSON) {
    createTap(name: $name, meta: $meta) {
      id
      name
      meta
      deleted
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TAP = gql`
  mutation UpdateTap($id: String!, $name: String, $meta: JSON) {
    updateTap(id: $id, name: $name, meta: $meta) {
      id
      name
      meta
      deleted
      createdAt
      updatedAt
    }
  }
`;

export const SOFT_DELETE_TAP = gql`
  mutation SoftDeleteTap($id: String!) {
    softDeleteTap(id: $id) {
      id
      name
      deleted
    }
  }
`;

export const RESTORE_TAP = gql`
  mutation RestoreTap($id: String!) {
    restoreTap(id: $id) {
      id
      name
      deleted
    }
  }
`;

export const HARD_DELETE_TAP = gql`
  mutation HardDeleteTap($id: String!) {
    hardDeleteTap(id: $id) {
      id
      name
    }
  }
`;

// Tag Mutations
export const CREATE_TAG = gql`
  mutation CreateTag($createTagInput: CreateTagInput!) {
    createTag(createTagInput: $createTagInput) {
      id
      code
      reference
      meta
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_TAG = gql`
  mutation UpdateTag($id: Int!, $updateTagInput: UpdateTagInput!) {
    updateTag(id: $id, updateTagInput: $updateTagInput) {
      id
      code
      reference
      meta
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_TAG = gql`
  mutation DeleteTag($id: Int!) {
    deleteTag(id: $id) {
      id
      code
      reference
    }
  }
`;

// Tag-Client relation mutations
export const ADD_TAG_TO_CLIENT = gql`
  mutation AddTagToClient($clientId: String!, $code: String!) {
    addTagToClientByCode(clientId: $clientId, code: $code) {
      id
      name
      tags {
        id
        code
        reference
      }
    }
  }
`;

export const REMOVE_TAG_FROM_CLIENT = gql`
  mutation RemoveTagFromClient($clientId: String!, $code: String!) {
    removeTagFromClientByCode(clientId: $clientId, code: $code) {
      id
      name
      tags {
        id
        code
        reference
      }
    }
  }
`;

// Dispense Mutations
export const CREATE_DISPENSE = gql`
  mutation CreateDispense($type: String!, $meta: JSON!, $clientId: String, $tapId: String) {
    createDispense(type: $type, meta: $meta, clientId: $clientId, tapId: $tapId) {
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
