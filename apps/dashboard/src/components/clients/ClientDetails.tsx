import { Client, Tag } from "@/lib/types/graphql";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ClientTags } from "./ClientTags";
import { ClientTagForm } from "./ClientTagForm";
import { useClient } from "@/hooks/useClients";
import { toast } from "sonner";
import { useTags } from "@/hooks/useTags";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientDetailsProps {
    client: Client | null;
}

export function ClientDetails({ client: initialClient }: ClientDetailsProps) {
    const [isAddingTag, setIsAddingTag] = useState(false);
    const { tags: allTags } = useTags();

    // Use the useClient hook to get reactive data if we have a client ID
    const {
        client: reactiveClient,
        loading,
        removeTagFromClient,
        addTagToClient
    } = useClient(initialClient?.id || "");

    // Use reactive data when available, fall back to props
    const client = reactiveClient || initialClient;

    if (!client) {
        return (
            <Card className="flex items-center justify-center h-full">
                <CardContent>
                    <p className="text-muted-foreground text-center">
                        Select a client to view details
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (loading) {
        return (
            <Card className="overflow-y-auto h-full">
                <CardContent className="space-y-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
        );
    }

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "PPP p");
        } catch (error) {
            return "Invalid date";
        }
    };

    // Parse meta JSON if it's a string
    let metaData: Record<string, any> = {};
    try {
        if (typeof client.meta === "string") {
            metaData = JSON.parse(client.meta);
        } else if (client.meta && typeof client.meta === "object") {
            metaData = client.meta;
        }
    } catch (error) {
        console.error("Error parsing client meta data:", error);
    }

    const handleRemoveTag = async (tag: Tag) => {
        if (!client) return;

        try {
            await removeTagFromClient(client.id, tag.code);
            toast.success("Tag removed successfully");
        } catch (error) {
            console.error("Error removing tag:", error);
            toast.error("Failed to remove tag");
        }
    };

    const handleAddTag = async (tagCode: string) => {
        if (!client) return;

        setIsAddingTag(true);
        try {
            await addTagToClient(client.id, tagCode);
            toast.success("Tag added successfully");
        } catch (error) {
            console.error("Error adding tag:", error);
            toast.error("Failed to add tag");
        } finally {
            setIsAddingTag(false);
        }
    };

    return (
        <Card className="overflow-y-auto h-full">
            <CardContent className="space-y-4">

                <ClientTagForm onAddTag={handleAddTag} />
                <ClientTags
                    tags={client.tags || []}
                    onRemoveTag={handleRemoveTag}
                />

                <Separator className="my-4" />

                <CardTitle className="flex items-center justify-between">
                    <span>{client.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">ID: {client.id}</span>
                </CardTitle>
                <div>
                    <h3 className="text-sm font-semibold mb-2">Dates</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <p className="text-muted-foreground">Created:</p>
                            <p>{formatDate(client.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Updated:</p>
                            <p>{client.updatedAt ? formatDate(client.updatedAt) : "Never"}</p>
                        </div>
                    </div>
                </div>

                {Object.keys(metaData).length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Additional Information</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(metaData).map(([key, value]) => (
                                <div key={key}>
                                    <p className="text-muted-foreground">{key}:</p>
                                    <p>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
