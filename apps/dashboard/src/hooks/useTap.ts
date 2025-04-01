import { useQuery, useSubscription } from "@apollo/client";
import { GET_TAP } from "@/lib/graphql/queries";
import { TAP_UPDATED, TAP_DELETED, TAP_RESTORED, TAP_HARD_DELETED } from "@/lib/graphql/subscriptions";
import { Tap } from "@/lib/types/graphql";
import { useEffect } from "react";

export function useTap(id: string, includeDeleted = false) {
    const { data, loading, error, refetch } = useQuery(GET_TAP, {
        variables: { id, includeDeleted },
        skip: !id,
    });

    // Subscribe to tap updates for this specific tap
    const { data: updatedData } = useSubscription(TAP_UPDATED);
    const { data: deletedData } = useSubscription(TAP_DELETED);
    const { data: restoredData } = useSubscription(TAP_RESTORED);
    const { data: hardDeletedData } = useSubscription(TAP_HARD_DELETED);

    useEffect(() => {
        // Only refetch when the subscription data is about our tap
        if (
            (updatedData?.tapUpdated && updatedData.tapUpdated.id === id) ||
            (deletedData?.tapDeleted && deletedData.tapDeleted.id === id) ||
            (restoredData?.tapRestored && restoredData.tapRestored.id === id) ||
            (hardDeletedData?.tapHardDeleted && hardDeletedData.tapHardDeleted.id === id)
        ) {
            refetch();
        }
    }, [updatedData, deletedData, restoredData, hardDeletedData, id, refetch]);

    return {
        tap: data?.getTap as Tap,
        loading,
        error,
        refetch,
    };
}
