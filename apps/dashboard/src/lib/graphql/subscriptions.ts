import { gql } from "@apollo/client";

// Client Subscriptions
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

// Tap Subscriptions
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

export const TAP_HARD_DELETED = gql`
  subscription TapHardDeleted {
    tapHardDeleted {
      id
      name
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

// Dispense Subscriptions
export const DISPENSE_ADDED = gql`
  subscription DispenseAdded {
    dispenseAdded {
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

