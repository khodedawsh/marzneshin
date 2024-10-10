import {
    createFileRoute,
    Outlet,
} from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryClient } from "@marzneshin/utils";
import {
    RouterUserContext,
    userQueryOptions,
} from "@marzneshin/modules/users";
import { Suspense, useMemo } from "react";
import {
    AlertDialog,
    AlertDialogContent,
} from "@marzneshin/components";

const UserProvider = () => {
    const { username } = Route.useLoaderData()
    const { data: user, isPending } = useSuspenseQuery(userQueryOptions({ username }))
    const value = useMemo(() => ({ user, isPending }), [user, isPending])
    return (
        <RouterUserContext.Provider value={value}>
            <Suspense>
                <Outlet />
            </Suspense>
        </RouterUserContext.Provider>
    )
}

export const Route = createFileRoute('/_dashboard/users/$userId')({
    loader: async ({ params }) => {
        queryClient.ensureQueryData(userQueryOptions({ username: params.userId }))
        return { username: params.userId };
    },
    errorComponent: () => (
        <AlertDialog open={true}>
            <AlertDialogContent>User not found</AlertDialogContent>
        </AlertDialog>
    ),
    component: UserProvider,
})
