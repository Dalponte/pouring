import { useQuery } from "@apollo/client";
import { GET_TAGS } from "@/lib/graphql/queries";
import { Tag } from "@/lib/types/graphql";

export function useTags() {
    const { data, loading, error, refetch } = useQuery(GET_TAGS, {
        fetchPolicy: "cache-and-network",
    });

    return {
        tags: data?.getTags as Tag[] || [],
        loading,
        error,
        refetch,
    };
}
