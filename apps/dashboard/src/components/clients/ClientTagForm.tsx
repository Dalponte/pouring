import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface ClientTagFormProps {
    onAddTag: (tagCode: string) => void;
}

export function ClientTagForm({ onAddTag }: ClientTagFormProps) {
    const [tagCode, setTagCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!tagCode.trim()) return;

        setIsSubmitting(true);
        try {
            onAddTag(tagCode.trim());
            setTagCode("");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
                placeholder="Enter tag code"
                value={tagCode}
                onChange={(e) => setTagCode(e.target.value)}
                className="h-8 flex-1"
            />
            <Button
                type="submit"
                size="sm"
                className="h-8"
                disabled={isSubmitting || !tagCode.trim()}
            >
                <Plus className="h-4 w-4 mr-1" />
                Add
            </Button>
        </form>
    );
}
