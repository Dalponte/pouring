import { gql } from "@apollo/client";

export const DISPENSE_ADDED = gql`
  subscription DispenseAdded {
    dispenseAdded {
      id
      type
      meta
      clientId
      tapId
      createdAt
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

export const TAP_ADDED = gql`
  subscription TapAdded {
    tapAdded {
      id
      name
      meta
      deleted
      createdAt
      updatedAt
    }
  }
`;

export const TAP_UPDATED = gql`
  subscription TapUpdated {
    tapUpdated {
      id
      name
      meta
      deleted
      createdAt
      updatedAt
    }
  }
`;

export const TAP_DELETED = gql`
  subscription TapDeleted {
    tapDeleted {
      id
      name
      meta
      deleted
      createdAt
      updatedAt
    }
  }
`;

export const TAP_RESTORED = gql`
  subscription TapRestored {
    tapRestored {
      id
      name
      meta
      deleted
      createdAt
      updatedAt
    }
  }
`;

export const CLIENT_ADDED = gql`
  subscription ClientAdded {
    clientAdded {
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

export const CLIENT_UPDATED = gql`
  subscription ClientUpdated {
    clientUpdated {
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

export const CLIENT_DELETED = gql`
  subscription ClientDeleted {
    clientDeleted {
      id
      name
      meta
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

