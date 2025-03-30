import { useTaps } from "@/hooks/useTaps";

export function TapsPage() {
    const { taps, loading, error, refetch } = useTaps(true); // includeDeleted=true to show all taps

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}

            {taps && taps.length > 0 ? (
                JSON.stringify(taps, null, 2)
            ) : (
                <p>No taps found.</p>
            )}

            <br />
            <br />
            <button onClick={() => refetch()}>Refetch Taps</button>
        </div>
    );
}
