import { useState } from "react"
import { useClients } from "../hooks/useClients"
import { Client } from "@/lib/types/graphql"
import { ClientList } from "@/components/clients/ClientList"
import { ClientDrawer } from "@/components/clients/ClientDrawer"
import { ClientDeleteAlert } from "@/components/clients/ClientDeleteAlert"
import { ClientDetails } from "@/components/clients/ClientDetails"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export function ClientsPage() {
    const { clients, loading, error, createClient, updateClient, deleteClient } = useClients()
    const [isCreatingClient, setIsCreatingClient] = useState(false)
    const [editingClient, setEditingClient] = useState<Client | null>(null)
    const [deletingClient, setDeletingClient] = useState<Client | null>(null)
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
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

    const handleRowSelect = (client: Client | null) => {
        setSelectedClient(client)
    }

    const handleConfirmDelete = async (client: Client) => {
        if (isSubmitting) return

        setIsSubmitting(true)
        try {
            console.log("Confirming delete for client:", client)
            setDeleteAlertOpen(false)
            await deleteClient(client.id)
            setDeletingClient(null)

            // Reset selected client if the deleted client was selected
            if (selectedClient && selectedClient.id === client.id) {
                setSelectedClient(null)
            }
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

                // Update selected client if it was the one being edited
                if (selectedClient && selectedClient.id === clientData.id) {
                    setSelectedClient(clientData)
                }
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
        <div className="container mx-auto w-full min-h-full flex flex-col">
            {loading && <p className="text-center py-4">Loading clients data...</p>}
            {error && <p className="text-red-500 py-4">Error: {error.message}</p>}

            {!loading && !error && clients && (
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={70} minSize={30}>
                        <div className="p-4 h-full">
                            <ClientList
                                clients={clients}
                                onCreate={handleCreateClient}
                                onEdit={handleEditClient}
                                onDelete={handleDeleteClient}
                                onRowSelect={handleRowSelect}
                            />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={30} minSize={20}>
                        <div className="p-4 h-full">
                            <ClientDetails client={selectedClient} />
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
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
