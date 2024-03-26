import { Moon, Sun } from "lucide-react"

import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@marzneshin/components"
import { useTheme } from "../theme-provider"
import { useTranslation } from "react-i18next"

export function ThemeToggle() {
    const { setTheme } = useTheme()
    const { t } = useTranslation()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-secondary-foreground text-primary-foreground" size="icon">
                    <Sun className="transition-all scale-100 rotate-0 dark:scale-0 dark:-rotate-90 h-[1rem] w-[1rem]" />
                    <Moon className="absolute transition-all scale-0 rotate-90 dark:scale-100 dark:rotate-0 h-[1rem] w-[1rem]" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    {t('light')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    {t('dark')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    {t('system')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
