import {
    UsersIcon,
    ServerIcon,
    BoxIcon,
    ServerCogIcon,
    SettingsIcon,
    LucideIcon,
} from "lucide-react";

export interface CommandItemConfig {
    icon: LucideIcon;
    label: string;
    path: string;
    sudo: boolean;
}

export interface CommandGroupConfig {
    group: string;
    items: CommandItemConfig[];
}

export const commandItems: CommandGroupConfig[] = [
    {
        group: "Pages",
        items: [
            {
                icon: UsersIcon,
                label: "users",
                path: "/users",
                sudo: false,
            },
            {
                icon: ServerIcon,
                label: "services",
                path: "/services",
                sudo: true,
            },
            {
                icon: BoxIcon,
                label: "nodes",
                path: "/nodes",
                sudo: true,
            },
            {
                icon: ServerCogIcon,
                label: "hosts",
                path: "/hosts",
                sudo: true,
            },
        ],
    },
    {
        group: "Actions",
        items: [
            {
                icon: UsersIcon,
                label: "page.users.dialogs.creation.title",
                path: "/users/create",
                sudo: false,
            },
            {
                icon: ServerIcon,
                label: "page.services.dialogs.creation.title",
                path: "/services/create",
                sudo: false,
            },
            {
                icon: BoxIcon,
                label: "page.nodes.dialogs.creation.title",
                path: "/nodes/create",
                sudo: false,
            },
        ],
    },
    {
        group: "Settings",
        items: [
            {
                icon: SettingsIcon,
                label: "settings",
                path: "/settings",
                sudo: true,
            },
        ],
    },
];
