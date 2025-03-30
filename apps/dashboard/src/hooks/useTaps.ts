import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { GET_TAPS, GET_TAP } from "@/lib/graphql/queries";
import { CREATE_TAP, UPDATE_TAP, SOFT_DELETE_TAP, RESTORE_TAP, HARD_DELETE_TAP } from "@/lib/graphql/mutations";
import { TAP_ADDED, TAP_UPDATED } from "@/lib/graphql/subscriptions";
import { Tap } from "@/lib/types/graphql";

export function useTaps(includeDeleted = false) {
    const { data, loading, error, refetch } = useQuery(GET_TAPS, {
        variables: { includeDeleted },
        fetchPolicy: "cache-and-network",
    });

    // Subscribe to new taps being added
    useSubscription(TAP_ADDED, {
        onData: ({ client, data }) => {
            if (data.data?.tapAdded) {
                client.cache.updateQuery(
                    { query: GET_TAPS, variables: { includeDeleted } },
                    (existingData) => {
                        if (!existingData) return { getTaps: [data.data.tapAdded] };
                        return {
                            getTaps: [...existingData.getTaps, data.data.tapAdded],
                        };
                    }
                );
            }
        },
    });

    // Subscribe to tap updates
    useSubscription(TAP_UPDATED, {
        onData: ({ client, data }) => {
            if (data.data?.tapUpdated) {
                const updatedTap = data.data.tapUpdated;
                client.cache.updateQuery(
                    { query: GET_TAPS, variables: { includeDeleted } },
                    (existingData) => {
                        if (!existingData) return { getTaps: [updatedTap] };
                        return {
                            getTaps: existingData.getTaps.map((tap: Tap) =>
                                tap.id === updatedTap.id ? updatedTap : tap
                            ),
                        };
                    }
                );
            }
        },
    });

    const [createTapMutation] = useMutation(CREATE_TAP, {
        refetchQueries: [{ query: GET_TAPS, variables: { includeDeleted } }],
    });

    const [updateTapMutation] = useMutation(UPDATE_TAP);

    const [softDeleteTapMutation] = useMutation(SOFT_DELETE_TAP);

    const [restoreTapMutation] = useMutation(RESTORE_TAP);

    const [hardDeleteTapMutation] = useMutation(HARD_DELETE_TAP, {
        refetchQueries: [{ query: GET_TAPS, variables: { includeDeleted } }],
    });

    const createTap = async (name: string, meta?: any) => {
        const result = await createTapMutation({ variables: { name, meta } });
        return result.data.createTap;
    };

    const updateTap = async (id: string, name?: string, meta?: any) => {
        const result = await updateTapMutation({ variables: { id, name, meta } });
        return result.data.updateTap;
    };

    const softDeleteTap = async (id: string) => {
        const result = await softDeleteTapMutation({ variables: { id } });
        return result.data.softDeleteTap;
    };

    const restoreTap = async (id: string) => {
        const result = await restoreTapMutation({ variables: { id } });
        return result.data.restoreTap;
    };

    const hardDeleteTap = async (id: string) => {
        const result = await hardDeleteTapMutation({ variables: { id } });
        return result.data.hardDeleteTap;
    };

    return {
        taps: data?.getTaps as Tap[] || [],
        loading,
        error,
        refetch,
        createTap,
        updateTap,
        softDeleteTap,
        restoreTap,
        hardDeleteTap,
    };
}

export function useTap(id: string, includeDeleted = false) {
    const { data, loading, error } = useQuery(GET_TAP, {
        variables: { id, includeDeleted },
        skip: !id,
    });

    return {
        tap: data?.getTap as Tap,
        loading,
        error,
    };
}
