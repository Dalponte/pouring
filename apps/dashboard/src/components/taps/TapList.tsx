import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Tap } from "@/lib/types/graphql";

interface TapListProps {
    taps: Tap[];
    onEdit?: (tap: Tap) => void;
    onDelete?: (tap: Tap) => void;
    onCreate?: () => void;
}

export function TapList({ taps, onEdit, onDelete, onCreate }: TapListProps) {
    const columns: ColumnDef<Tap>[] = [
        {
            accessorKey: "name",
            header: "Tap Name",
        },
        {
            accessorKey: "meta",
            header: "Details",
            cell: ({ row }) => {
                const meta = row.original.meta || {};
                return (
                    <div>
                        {meta.beerName && <div>Beer: {meta.beerName}</div>}
                        {meta.tapNumber && <div>Tap #{meta.tapNumber}</div>}
                    </div>
                );
            },
        },
        {
            accessorKey: "deleted",
            header: "Status",
            cell: ({ row }) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs ${!row.original.deleted
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                >
                    {!row.original.deleted ? "Active" : "Deleted"}
                </span>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) =>
                new Date(row.original.createdAt).toLocaleDateString(),
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={taps}
            onCreate={onCreate}
            onEdit={onEdit}
            onDelete={onDelete}
            filterColumn="name"
        />
    );
}
