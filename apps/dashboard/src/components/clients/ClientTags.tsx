import { Badge } from "@/components/ui/badge";
import { Tag } from "@/lib/types/graphql";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ClientTagsProps {
    tags: Tag[];
    onRemoveTag: (tag: Tag) => void;
}

export function ClientTags({ tags, onRemoveTag }: ClientTagsProps) {
    if (!tags || tags.length === 0) {
        return <span className="text-muted-foreground">No tags assigned</span>;
    }

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
                <Badge key={tag.id} variant="outline" className="flex items-center gap-1 pr-1">
                    <span>{tag.reference || tag.code}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 rounded-full"
                        onClick={() => onRemoveTag(tag)}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </Badge>
            ))}
        </div>
    );
}
