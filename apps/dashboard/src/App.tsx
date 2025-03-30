import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
import { ClientsPage } from "@/pages/clients"
import { TapsPage } from "@/pages/taps"
import { HomePage } from "@/pages/home"
import { GraphQLProvider } from "@/components/providers/graphql-provider"

function MainLayout() {
  const location = useLocation()

  // Get page title based on current path
  const getPageTitle = () => {
    const path = location.pathname
    if (path === "/") return "Dashboard"
    if (path === "/clients") return "Clients"
    if (path === "/taps") return "Taps"
    return "Dashboard"
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  <span className="text-muted-foreground">{getPageTitle()}</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/taps" element={<TapsPage />} />
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function App() {
  return (
    <GraphQLProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </GraphQLProvider>
  )
}

export default App
