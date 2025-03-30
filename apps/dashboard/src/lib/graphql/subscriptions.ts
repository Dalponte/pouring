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
