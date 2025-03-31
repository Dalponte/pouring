import { useState } from "react"
import { useClients } from "../hooks/useClients"
import { Client } from "@/lib/types/graphql"
import { ClientList } from "@/components/clients/ClientList"
import { ClientDrawer } from "@/components/clients/ClientDrawer"
import { ClientDeleteAlert } from "@/components/clients/ClientDeleteAlert"

export function ClientsPage() {
    const { clients, loading, error, createClient, updateClient, deleteClient } = useClients()
    const [isCreatingClient, setIsCreatingClient] = useState(false)
    const [editingClient, setEditingClient] = useState<Client | null>(null)
    const [deletingClient, setDeletingClient] = useState<Client | null>(null)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleCreateClient = () => {
        setIsCreatingClient(true)
        setEditingClient(null)
        setDrawerOpen(true)
    }

    const handleEditClient = (client: Client) => {
        setEditingClient(client)
        setIsCreatingClient(false)
        setDrawerOpen(true)
    }

    const handleDeleteClient = (client: Client) => {
        setDeletingClient(client)
        setDeleteAlertOpen(true)
    }

    const handleConfirmDelete = async (client: Client) => {
        if (isSubmitting) return

        setIsSubmitting(true)
        try {
            console.log("Confirming delete for client:", client)
            setDeleteAlertOpen(false)
            await deleteClient(client.id)
            setDeletingClient(null)
        } catch (error) {
            console.error("Error deleting client:", error)
            setDeletingClient(null)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSaveClient = async (clientData: Client) => {
        if (isSubmitting) return

        setIsSubmitting(true)
        try {
            if (isCreatingClient) {
                console.log("Creating client:", clientData)
                await createClient(clientData.name, clientData.meta)
            } else if (editingClient) {
                console.log("Updating client:", clientData)
                await updateClient(
                    clientData.id,
                    clientData.name,
                    clientData.meta
                )
            }

            setDrawerOpen(false)
            setEditingClient(null)
            setIsCreatingClient(false)
        } catch (error) {
            console.error("Error saving client:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDrawerOpenChange = (open: boolean) => {
        if (isSubmitting) return

        setDrawerOpen(open)
        if (!open) {
            setEditingClient(null)
            setIsCreatingClient(false)
        }
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Clients</h1>
            </div>

            {loading && <p className="text-center py-4">Loading clients data...</p>}
            {error && <p className="text-red-500 py-4">Error: {error.message}</p>}

            {!loading && !error && clients && (
                <ClientList
                    clients={clients}
                    onCreate={handleCreateClient}
                    onEdit={handleEditClient}
                    onDelete={handleDeleteClient}
                />
            )}

            {/* Only render drawer when it's open */}
            {drawerOpen && (
                <ClientDrawer
                    client={editingClient}
                    open={drawerOpen}
                    onOpenChange={handleDrawerOpenChange}
                    onSave={handleSaveClient}
                    isCreating={isCreatingClient}
                />
            )}

            <ClientDeleteAlert
                client={deletingClient}
                open={deleteAlertOpen}
                onOpenChange={setDeleteAlertOpen}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}
