import { useTap } from "../../hooks/useTap";

interface TapMachineProps {
    id: string;
}

export function TapMachine({ id }: TapMachineProps) {
    const { tap, loading, error } = useTap(id);

    if (loading) {
        return (
            <div className="aspect-video rounded-xl bg-muted/50 p-4 flex items-center justify-center">
                <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
        );
    }

    if (error || !tap) {
        return (
            <div className="aspect-video rounded-xl bg-red-100 p-4 flex items-center justify-center text-red-700">
                <p>Error loading tap data</p>
            </div>
        );
    }

    const status = tap.deleted ? "Inactive" : "Active";

    return (
        <div className="aspect-video rounded-xl bg-muted/50 p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div className="font-medium text-lg">{tap.name}</div>
                <span className={`px-2 py-1 text-xs rounded-full ${status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {status}
                </span>
            </div>

            <div className="mt-2 space-y-1">
                {tap.meta?.temperature !== undefined && (
                    <div className="text-sm flex justify-between">
                        <span className="text-gray-500">Temperature:</span>
                        <span>{tap.meta.temperature}°C</span>
                    </div>
                )}
                {tap.meta?.volume !== undefined && (
                    <div className="text-sm flex justify-between">
                        <span className="text-gray-500">Volume:</span>
                        <span>{tap.meta.volume}L</span>
                    </div>
                )}

                {/* Display all other meta properties dynamically */}
                {tap.meta && Object.entries(tap.meta)
                    .filter(([key]) => key !== 'temperature' && key !== 'volume')
                    .map(([key, value]) => (
                        <div key={key} className="text-sm flex justify-between">
                            <span className="text-gray-500">{key}:</span>
                            <span>{String(value)}</span>
                        </div>
                    ))
                }

                <div className="text-xs text-gray-400 pt-2">
                    Last updated: {new Date(tap.updatedAt).toLocaleString()}
                </div>
            </div>

            <div className="mt-2">
                <button className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                    Details
                </button>
            </div>
        </div>
    );
}
