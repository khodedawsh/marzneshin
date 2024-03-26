import { LanguageSwitch } from "@marzneshin/features/language-switch"
import { ThemeToggle } from "@marzneshin/features/theme-switch"
import { Link } from "@tanstack/react-router"
import { FC, PropsWithChildren } from "react"

export const Header: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="flex flex-row justify-between items-center p-1 px-4 w-full h-full bg-primary text-primary-foreground dark:bg-primary-foreground">
            <div className="flex flex-row gap-4 justify-center items-center">
                <Link to="/">
                    <div className="flex flex-col justify-center items-center p-2 h-10 text-2xl font-bold bg-gray-800 rounded-lg font-header text-secondary border-accent dark:text-secondary-foreground">
                        M
                    </div>
                </Link>
                {children}
            </div>
            <div className="flex flex-row gap-2 justify-reverse">
                <LanguageSwitch />
                <ThemeToggle />
            </div>
        </div>
    )
}
