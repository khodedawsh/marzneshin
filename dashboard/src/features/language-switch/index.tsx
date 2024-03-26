import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@marzneshin/components";
import { Languages } from "lucide-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

export const LanguageSwitch: FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-secondary-foreground text-primary-foreground" size="icon">
                    <Languages className="transition-all scale-100 rotate-0 dark:scale-0 dark:-rotate-90 h-[1rem] w-[1rem]" />
                    <span className="sr-only">Toggle Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage("en")}>
                    English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("ku-kur")}>
                    Kurdî (Kur)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("ku-sor-latin")}>
                    Kurdî (Sor-Latin)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("ku-sor")}>
                    Kurdî (Sor)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("fa")}>
                    فارسی
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("fa")}>
                    Русский
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
