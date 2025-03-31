import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Client } from "@/lib/types/graphql";

interface ClientListProps {
    clients: Client[];
    onEdit?: (client: Client) => void;
    onDelete?: (client: Client) => void;
    onCreate?: () => void;
    onRowSelect?: (client: Client | null) => void;
}

export function ClientList({ clients, onEdit, onDelete, onCreate, onRowSelect }: ClientListProps) {
    const columns: ColumnDef<Client>[] = [
        {
            accessorKey: "name",
            header: "Client Name",
        },
        {
            accessorKey: "meta",
            header: "Details",
            cell: ({ row }) => {
                const meta = row.original.meta || {};
                return (
                    <div className="text-sm">
                        {Object.entries(meta).map(([key, value]) => (
                            <div key={key}>
                                {key}: {JSON.stringify(value)}
                            </div>
                        ))}
                    </div>
                );
            },
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
            data={clients}
            onCreate={onCreate}
            onEdit={onEdit}
            onDelete={onDelete}
            onRowSelect={onRowSelect}
            filterColumn="name"
        />
    );
}
