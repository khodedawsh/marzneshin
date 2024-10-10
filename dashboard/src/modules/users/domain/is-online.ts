import { UserType } from "@marzneshin/modules/users";

/**
 * Checks whether the user has been online recently.
 * 
 * This function compares the provided user's last online time with the current time
 * to determine if the user has been online within a certain threshold.
 * 
 * @param user - The user entity containing information about the user.
 * @returns A boolean value indicating whether the user has been online recently.
 */
export const isUserOnline = (user: UserType): boolean => {
    const utcUserOnlineTime = new Date(user.online_at + 'Z');
    const currentTime = new Date();
    const timeDifference = Math.abs(currentTime.getTime() - utcUserOnlineTime.getTime());
    return timeDifference < 30000;
};
