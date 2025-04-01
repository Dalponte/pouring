import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { GET_CLIENTS, GET_CLIENT } from "@/lib/graphql/queries";
import { CREATE_CLIENT, UPDATE_CLIENT, DELETE_CLIENT, REMOVE_TAG_FROM_CLIENT, ADD_TAG_TO_CLIENT } from "@/lib/graphql/mutations";
import { CLIENT_DELETED } from "@/lib/graphql/subscriptions";
import { Client } from "@/lib/types/graphql";
import { useEffect } from "react";

export function useClients() {
    const { data, loading, error, refetch } = useQuery(GET_CLIENTS, {
        variables: {},
        fetchPolicy: "cache-and-network",
    });

    // Subscribe to client changes
    const { data: deletedData } = useSubscription(CLIENT_DELETED);

    // Update cache when subscriptions receive data
    useEffect(() => {
        if (deletedData) {
            refetch();
        }
    }, [deletedData, refetch]);

    const [createClientMutation] = useMutation(CREATE_CLIENT, {
        refetchQueries: [{ query: GET_CLIENTS }],
    });

    const [updateClientMutation] = useMutation(UPDATE_CLIENT, {
        refetchQueries: [{ query: GET_CLIENTS }],
    });

    const [deleteClientMutation] = useMutation(DELETE_CLIENT);

    const [removeTagFromClientMutation] = useMutation(REMOVE_TAG_FROM_CLIENT, {
        refetchQueries: [{ query: GET_CLIENTS }, { query: GET_CLIENT }],
    });

    const [addTagToClientMutation] = useMutation(ADD_TAG_TO_CLIENT, {
        refetchQueries: [{ query: GET_CLIENTS }, { query: GET_CLIENT }],
    });

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

    const removeTagFromClient = async (clientId: string, code: string) => {
        const result = await removeTagFromClientMutation({
            variables: { clientId, code }
        });
        return result.data.removeTagFromClientByCode;
    };

    const addTagToClient = async (clientId: string, code: string) => {
        const result = await addTagToClientMutation({
            variables: { clientId, code }
        });
        return result.data.addTagToClientByCode;
    };

    return {
        clients: data?.getClients as Client[] || [],
        loading,
        error,
        refetch,
        createClient,
        updateClient,
        deleteClient,
        removeTagFromClient,
        addTagToClient,
    };
}

export function useClient(id: string) {
    const { data, loading, error, refetch } = useQuery(GET_CLIENT, {
        variables: { id },
        skip: !id,
    });

    // Subscribe to client updates for this specific client
    const { data: deletedData } = useSubscription(CLIENT_DELETED);

    useEffect(() => {
        if (
            (deletedData?.clientDeleted && deletedData.clientDeleted.id === id)
        ) {
            refetch();
        }
    }, [deletedData, id, refetch]);

    const [removeTagFromClientMutation] = useMutation(REMOVE_TAG_FROM_CLIENT, {
        refetchQueries: [{ query: GET_CLIENT, variables: { id } }],
    });

    const [addTagToClientMutation] = useMutation(ADD_TAG_TO_CLIENT, {
        refetchQueries: [{ query: GET_CLIENT, variables: { id } }],
    });

    const removeTagFromClient = async (clientId: string, code: string) => {
        const result = await removeTagFromClientMutation({
            variables: { clientId, code }
        });
        return result.data.removeTagFromClientByCode;
    };

    const addTagToClient = async (clientId: string, code: string) => {
        const result = await addTagToClientMutation({
            variables: { clientId, code }
        });
        return result.data.addTagToClientByCode;
    };

    return {
        client: data?.getClient as Client,
        loading,
        error,
        refetch,
        removeTagFromClient,
        addTagToClient,
    };
}
