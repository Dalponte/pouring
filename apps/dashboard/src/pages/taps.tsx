import { useTaps } from "@/hooks/useTaps";
import { TapList } from "@/components/taps/TapList";
import { useState, useEffect } from "react";
import { Tap } from "@/lib/types/graphql";
import { TapDrawer } from "@/components/taps/TapDrawer";
import { TapDeleteAlert } from "@/components/taps/TapDeleteAlert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function TapsPage() {
    const { taps, loading, error, refetch, updateTap, createTap, deleteTap } = useTaps();
    const [isCreatingTap, setIsCreatingTap] = useState(false);
    const [editingTap, setEditingTap] = useState<Tap | null>(null);
    const [deletingTap, setDeletingTap] = useState<Tap | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [operationCompleted, setOperationCompleted] = useState(false);

    // Effect to handle refetching after operations complete
    useEffect(() => {
        if (operationCompleted) {
            const performRefetch = async () => {
                try {
                    await refetch();
                    console.log("Refetch completed after operation");
                } catch (refetchError) {
                    console.error("Error refetching after operation:", refetchError);
                } finally {
                    setOperationCompleted(false);
                }
            };

            performRefetch();
        }
    }, [operationCompleted, refetch]);

    const handleCreateTap = () => {
        setIsCreatingTap(true);
        setEditingTap(null);
        setDrawerOpen(true);
    };

    const handleEditTap = (tap: Tap) => {
        setEditingTap(tap);
        setIsCreatingTap(false);
        setDrawerOpen(true);
    };

    const handleDeleteTap = (tap: Tap) => {
        setDeletingTap(tap);
        setDeleteAlertOpen(true);
    };

    const handleConfirmDelete = async (tap: Tap) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            console.log("Confirming delete for tap:", tap);
            setDeleteAlertOpen(false);
            await deleteTap(tap.id);

            setOperationCompleted(true);
            setDeletingTap(null);
        } catch (error) {
            console.error("Error deleting tap:", error);
            setDeletingTap(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveTap = async (tapData: Tap) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {

            if (isCreatingTap) {
                console.log("Creating tap:", tapData);
                await createTap(tapData.name, tapData.meta);
            } else if (editingTap) {
                console.log("Updating tap:", tapData);
                await updateTap(
                    tapData.id,
                    tapData.name,
                    tapData.meta,
                );
            }

            setDrawerOpen(false);
            setOperationCompleted(true);
            setEditingTap(null);
            setIsCreatingTap(false);
        } catch (error) {
            console.error("Error saving tap:", error);
            setEditingTap(null);
            setIsCreatingTap(false);
            // Optionally show an error message to the user
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDrawerOpenChange = (open: boolean) => {
        if (isSubmitting) return;

        setDrawerOpen(open);
        if (!open) {
            setEditingTap(null);
            setIsCreatingTap(false);
        }
    };

    // Function to manually trigger refetch
    const handleManualRefetch = async () => {
        try {
            await refetch();
            console.log("Manual refetch completed");
        } catch (error) {
            console.error("Error during manual refetch:", error);
        }
    };

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Taps Management</h1>
                <Button onClick={handleManualRefetch} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {loading && <p className="text-center py-4">Loading taps data...</p>}
            {error && <p className="text-red-500 py-4">Error: {error.message}</p>}

            {!loading && !error && taps && (
                <TapList
                    taps={taps}
                    onCreate={handleCreateTap}
                    onEdit={handleEditTap}
                    onDelete={handleDeleteTap}
                />
            )}

            <TapDrawer
                tap={editingTap}
                open={drawerOpen}
                onOpenChange={handleDrawerOpenChange}
                onSave={handleSaveTap}
                isCreating={isCreatingTap}
            />

            <TapDeleteAlert
                tap={deletingTap}
                open={deleteAlertOpen}
                onOpenChange={setDeleteAlertOpen}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
