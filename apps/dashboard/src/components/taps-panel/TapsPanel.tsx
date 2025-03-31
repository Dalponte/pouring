import { TapMachine } from "./TapMachine";
import { useTaps } from "../../hooks/useTaps";

export function TapsPanel() {
    const { taps, loading, error } = useTaps();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[30vh]">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>Error loading taps: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {taps.map((tap) => (
                <TapMachine key={tap.id} id={tap.id} />
            ))}
        </div>
    );
}
