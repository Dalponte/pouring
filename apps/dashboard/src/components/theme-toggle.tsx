import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="flex items-center gap-2"
                    >
                        <div className="relative">
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute top-0 left-0 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </div>
                        <span className="text-sm">
                            {theme === "dark" ? "Dark mode" : "Light mode"}
                        </span>
                    </Button>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
