import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tap } from "@/lib/types/graphql";

interface TapDeleteAlertProps {
    tap: Tap | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (tap: Tap) => void;
}

export function TapDeleteAlert({
    tap,
    open,
    onOpenChange,
    onConfirm
}: TapDeleteAlertProps) {
    if (!tap) return null;

    const handleConfirm = () => {
        onConfirm(tap);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are about to delete tap "{tap.name}".
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
