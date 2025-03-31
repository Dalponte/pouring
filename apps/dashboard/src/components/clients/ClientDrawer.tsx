import { useState, useEffect } from "react";
import { Client } from "@/lib/types/graphql";
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

interface ClientDrawerProps {
    client: Client | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (client: Client) => void;
    isCreating?: boolean;
}

export function ClientDrawer({
    client,
    open,
    onOpenChange,
    onSave,
    isCreating = false
}: ClientDrawerProps) {
    const [formData, setFormData] = useState<Partial<Client>>({
        name: "",
        meta: {},
    });
    const [metaJson, setMetaJson] = useState<string>('{}');
    const [jsonError, setJsonError] = useState<string | null>(null);

    // Initialize form data when drawer is opened
    useEffect(() => {
        if (open) {
            if (client) {
                setFormData({
                    ...client
                });
                setMetaJson(JSON.stringify(client.meta || {}, null, 2));
            } else if (isCreating) {
                setFormData({
                    name: "",
                    meta: {},
                });
                setMetaJson('{}');
            }
        }

        // Cleanup function
        return () => {
            setFormData({
                name: "",
                meta: {},
            });
            setMetaJson('{}');
            setJsonError(null);
        };
    }, [open, client, isCreating]);

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
        onSave(formData as Client);
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="max-h-[90vh]">
                <form onSubmit={handleSubmit}>
                    <DrawerHeader>
                        <DrawerTitle>
                            {isCreating ? "Create New Client" : `Edit Client: ${client?.name}`}
                        </DrawerTitle>
                        <DrawerDescription></DrawerDescription>
                    </DrawerHeader>

                    <div className="p-4 space-y-6">
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="name">Client Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name || ""}
                                onChange={handleInputChange}
                                placeholder="Enter client name"
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
                                Enter metadata in JSON format. Example: {`{"company": "ACME", "phoneNumber": "+1234567890"}`}
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
                            {isCreating ? "Create Client" : "Save Changes"}
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
