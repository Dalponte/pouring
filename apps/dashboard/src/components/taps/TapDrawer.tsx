import { useState, useEffect } from "react";
import { Tap } from "@/lib/types/graphql";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TapDrawerProps {
    tap: Tap | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (tap: Tap) => void;
    isCreating?: boolean;
}

export function TapDrawer({
    tap,
    open,
    onOpenChange,
    onSave,
    isCreating = false
}: TapDrawerProps) {
    const [formData, setFormData] = useState<Partial<Tap>>({
        name: "",
        meta: {},
        deleted: false
    });
    const [metaJson, setMetaJson] = useState<string>('{}');
    const [jsonError, setJsonError] = useState<string | null>(null);

    // Initialize form data when drawer is opened
    useEffect(() => {
        if (open) {
            if (tap) {
                setFormData({
                    ...tap
                });
                setMetaJson(JSON.stringify(tap.meta || {}, null, 2));
            } else if (isCreating) {
                setFormData({
                    name: "",
                    meta: {},
                    deleted: false
                });
                setMetaJson('{}');
            }
        }

        // Cleanup function (componentWillUnmount equivalent)
        return () => {
            // This runs when component is unmounted or dependencies change
            setFormData({
                name: "",
                meta: {},
                deleted: false
            });
            setMetaJson('{}');
            setJsonError(null);
        };
    }, [open, tap, isCreating]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMetaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setMetaJson(value);

        try {
            const parsedMeta = JSON.parse(value);
            setFormData(prev => ({
                ...prev,
                meta: parsedMeta
            }));
            setJsonError(null);
        } catch (error) {
            setJsonError("Invalid JSON format");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (jsonError) {
            // Don't submit if JSON is invalid
            return;
        }
        onSave(formData as Tap);
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="max-h-[90vh]">
                <form onSubmit={handleSubmit}>
                    <DrawerHeader>
                        <DrawerTitle>
                            {isCreating ? "Create New Tap" : `Edit Tap: ${tap?.name}`}
                        </DrawerTitle>
                        <DrawerDescription></DrawerDescription>
                    </DrawerHeader>

                    <div className="p-4 space-y-6">
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="name">Tap Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name || ""}
                                onChange={handleInputChange}
                                placeholder="Enter tap name"
                                required
                            />
                        </div>

                        {/* Metadata as JSON */}
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="meta">Metadata (JSON)</Label>
                            <Textarea
                                id="meta"
                                name="meta"
                                value={metaJson}
                                onChange={handleMetaChange}
                                placeholder="{}"
                                rows={8}
                                className="font-mono text-sm"
                            />
                            {jsonError && (
                                <p className="text-xs text-red-500">{jsonError}</p>
                            )}
                            <p className="text-xs text-gray-500">
                                Enter metadata in JSON format. Example: {`{"beerName": "IPA", "tapNumber": 1}`}
                            </p>
                        </div>

                        {/* Created/Updated timestamps */}
                        {!isCreating && formData.createdAt && (
                            <div className="flex flex-col space-y-2 mt-6 pt-6 border-t text-xs text-gray-500">
                                <div className="flex justify-between">
                                    <span>Created:</span>
                                    <span>{new Date(formData.createdAt).toLocaleString()}</span>
                                </div>
                                {formData.updatedAt && (
                                    <div className="flex justify-between">
                                        <span>Last Updated:</span>
                                        <span>{new Date(formData.updatedAt).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <DrawerFooter>
                        <Button type="submit" disabled={!!jsonError}>
                            {isCreating ? "Create Tap" : "Save Changes"}
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
}
