import { UserType } from "@marzneshin/modules/users";

export const userTrafficSortingFn = (userA: UserType, userB: UserType) => {
    if (userA.data_limit && userB.data_limit) {
        const rowAUsedTraffic = (userA.used_traffic / userA.data_limit) * 100
        const rowBUsedTraffic = (userB.used_traffic / userB.data_limit) * 100
        return (
            rowAUsedTraffic > rowBUsedTraffic
            && rowAUsedTraffic !== rowBUsedTraffic
        ) ? 1 : -1
    }
    return 0
}
