import { useTaps } from "@/hooks/useTaps";
import { TapList } from "@/components/taps/TapList";
import { useState } from "react";
import { Tap } from "@/lib/types/graphql";
import { TapDrawer } from "@/components/taps/TapDrawer";
import { TapDeleteAlert } from "@/components/taps/TapDeleteAlert";

export function TapsPage() {
    const { taps, loading, error, updateTap, createTap, deleteTap } = useTaps();
    const [isCreatingTap, setIsCreatingTap] = useState(false);
    const [editingTap, setEditingTap] = useState<Tap | null>(null);
    const [deletingTap, setDeletingTap] = useState<Tap | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            setEditingTap(null);
            setIsCreatingTap(false);
        } catch (error) {
            console.error("Error saving tap:", error);
            // Optionally show an error message to the user
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDrawerOpenChange = (open: boolean) => {
        if (isSubmitting) return;

        setDrawerOpen(open);
        // Close the drawer immediately - state cleanup will happen when component unmounts
        if (!open) {
            setEditingTap(null);
            setIsCreatingTap(false);
        }
    };

    return (
        <div className="container mx-auto py-6">
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

            {/* Only render drawer when it's open */}
            {drawerOpen && (
                <TapDrawer
                    tap={editingTap}
                    open={drawerOpen}
                    onOpenChange={handleDrawerOpenChange}
                    onSave={handleSaveTap}
                    isCreating={isCreatingTap}
                />
            )}

            <TapDeleteAlert
                tap={deletingTap}
                open={deleteAlertOpen}
                onOpenChange={setDeleteAlertOpen}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
