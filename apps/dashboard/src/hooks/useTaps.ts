import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { GET_TAPS, GET_TAP } from "@/lib/graphql/queries";
import { CREATE_TAP, UPDATE_TAP, SOFT_DELETE_TAP, RESTORE_TAP, HARD_DELETE_TAP } from "@/lib/graphql/mutations";
import { TAP_ADDED, TAP_UPDATED, TAP_DELETED, TAP_RESTORED } from "@/lib/graphql/subscriptions";
import { Tap } from "@/lib/types/graphql";
import { useEffect } from "react";

export function useTaps(includeDeleted = false) {
    const { data, loading, error, refetch } = useQuery(GET_TAPS, {
        variables: { includeDeleted },
        fetchPolicy: "cache-and-network",
    });

    // Subscribe to tap changes
    const { data: addedData } = useSubscription(TAP_ADDED);
    const { data: updatedData } = useSubscription(TAP_UPDATED);
    const { data: deletedData } = useSubscription(TAP_DELETED);
    const { data: restoredData } = useSubscription(TAP_RESTORED);

    // Update cache when subscriptions receive data
    useEffect(() => {
        if (addedData || updatedData || deletedData || restoredData) {
            refetch();
        }
    }, [addedData, updatedData, deletedData, restoredData, refetch]);

    const [createTapMutation] = useMutation(CREATE_TAP, {
        refetchQueries: [{ query: GET_TAPS, variables: { includeDeleted } }],
    });

    const [updateTapMutation] = useMutation(UPDATE_TAP, {
        refetchQueries: [{ query: GET_TAPS, variables: { includeDeleted } }],
    });

    const [deleteTapMutation] = useMutation(SOFT_DELETE_TAP);

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

    const deleteTap = async (id: string) => {
        const result = await deleteTapMutation({ variables: { id } });
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
        deleteTap,
        restoreTap,
        hardDeleteTap,
    };
}

export function useTap(id: string, includeDeleted = false) {
    const { data, loading, error, refetch } = useQuery(GET_TAP, {
        variables: { id, includeDeleted },
        skip: !id,
    });

    // Subscribe to tap updates for this specific tap
    const { data: updatedData } = useSubscription(TAP_UPDATED);
    const { data: deletedData } = useSubscription(TAP_DELETED);
    const { data: restoredData } = useSubscription(TAP_RESTORED);
    useEffect(() => {
        if (
            (updatedData?.tapUpdated && updatedData.tapUpdated.id === id) ||
            (deletedData?.tapDeleted && deletedData.tapDeleted.id === id) ||
            (restoredData?.tapRestored && restoredData.tapRestored.id === id)
        ) {
            refetch();
        }
    }, [updatedData, deletedData, restoredData, id, refetch]);

    return {
        tap: data?.getTap as Tap,
        loading,
        error,
        refetch,
    };
}
