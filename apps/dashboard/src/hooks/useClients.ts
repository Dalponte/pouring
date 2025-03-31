import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { GET_CLIENTS, GET_CLIENT } from "@/lib/graphql/queries";
import { CREATE_CLIENT, UPDATE_CLIENT, DELETE_CLIENT } from "@/lib/graphql/mutations";
import { CLIENT_ADDED, CLIENT_UPDATED, CLIENT_DELETED } from "@/lib/graphql/subscriptions";
import { Client } from "@/lib/types/graphql";
import { useEffect } from "react";

export function useClients(includeDeleted = false) {
    const { data, loading, error, refetch } = useQuery(GET_CLIENTS, {
        variables: { includeDeleted },
        fetchPolicy: "cache-and-network",
    });

    // Subscribe to client changes
    const { data: addedData } = useSubscription(CLIENT_ADDED);
    const { data: updatedData } = useSubscription(CLIENT_UPDATED);
    const { data: deletedData } = useSubscription(CLIENT_DELETED);

    // Update cache when subscriptions receive data
    useEffect(() => {
        if (addedData || updatedData || deletedData) {
            refetch();
        }
    }, [addedData, updatedData, deletedData, refetch]);

    const [createClientMutation] = useMutation(CREATE_CLIENT, {
        refetchQueries: [{ query: GET_CLIENTS, variables: { includeDeleted } }],
    });

    const [updateClientMutation] = useMutation(UPDATE_CLIENT, {
        refetchQueries: [{ query: GET_CLIENTS, variables: { includeDeleted } }],
    });

    const [deleteClientMutation] = useMutation(DELETE_CLIENT);

    const createClient = async (name: string, meta?: any) => {
        const result = await createClientMutation({
            variables: {
                createClientInput: {
                    name,
                    meta
                }
            }
        });
        return result.data.createClient;
    };

    const updateClient = async (id: string, name?: string, meta?: any) => {
        const result = await updateClientMutation({
            variables: {
                id,
                updateClientInput: {
                    name,
                    meta
                }
            }
        });
        return result.data.updateClient;
    };

    const deleteClient = async (id: string) => {
        const result = await deleteClientMutation({ variables: { id } });
        return result.data.deleteClient;
    };

    return {
        clients: data?.getClients as Client[] || [],
        loading,
        error,
        refetch,
        createClient,
        updateClient,
        deleteClient,
    };
}

export function useClient(id: string, includeDeleted = false) {
    const { data, loading, error, refetch } = useQuery(GET_CLIENT, {
        variables: { id, includeDeleted },
        skip: !id,
    });

    // Subscribe to client updates for this specific client
    const { data: updatedData } = useSubscription(CLIENT_UPDATED);
    const { data: deletedData } = useSubscription(CLIENT_DELETED);

    useEffect(() => {
        if (
            (updatedData?.clientUpdated && updatedData.clientUpdated.id === id) ||
            (deletedData?.clientDeleted && deletedData.clientDeleted.id === id)
        ) {
            refetch();
        }
    }, [updatedData, deletedData, id, refetch]);

    return {
        client: data?.getClient as Client,
        loading,
        error,
        refetch,
    };
}
