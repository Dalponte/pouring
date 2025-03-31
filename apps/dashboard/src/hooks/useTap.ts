import { useQuery, useSubscription } from "@apollo/client";
import { GET_TAP } from "@/lib/graphql/queries";
import { TAP_UPDATED, TAP_DELETED, TAP_RESTORED } from "@/lib/graphql/subscriptions";
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
