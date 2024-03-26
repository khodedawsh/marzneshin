import { Sidebar, SidebarItem } from "@marzneshin/components";
import { useRouterState } from "@tanstack/react-router";
import { FC, useEffect } from "react";
import { sidebarItems } from ".";
import { cn } from "@marzneshin/utils";


interface DashboardSidebarProps {
    collapsed: boolean;
    setCollapsed: (state: boolean) => void;
}

export const DashboardSidebar: FC<DashboardSidebarProps> = ({ collapsed, setCollapsed }) => {
    const router = useRouterState();
    const currentActivePath = router.location.pathname;

    useEffect(() => { }, [collapsed]);

    return (
        <aside>
            <nav className="w-full">
                <Sidebar
                    sidebar={sidebarItems}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                >
                    <div className="flex flex-col px-4 w-full h-full">
                        <Sidebar.Body className="my-3">
                            {Object.keys(sidebarItems).map((key) =>
                            (
                                <div className="w-full" key={key}>
                                    <Sidebar.Group>{key}</Sidebar.Group>
                                    {sidebarItems[key].map((item: SidebarItem, i) => (
                                        <Sidebar.Item
                                            variant={currentActivePath === item.to ? "active" : "default"}
                                            className={cn("my-2 border-transparent", { "w-10 h-10": collapsed })}
                                            item={item}
                                            key={i}
                                        />
                                    )
                                    )}
                                </div>
                            )
                            )}
                        </Sidebar.Body>
                    </div>
                </Sidebar>
            </nav>
        </aside>
    )
}
