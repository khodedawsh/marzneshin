import { UsersStatsWidget } from "./index"
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof UsersStatsWidget> = {
    title: "Features/Users/Users Stats",
    component: UsersStatsWidget,
    tags: ["autodocs"]
};

export default meta;

type WidgetStory = StoryObj<typeof UsersStatsWidget>;

/**
 * Users chart widget which shows the active,
 * online, expired, on hold, and limited users.
 * */
export const UsersChart: WidgetStory = {
    args: {
        active: 50,
        online: 30,
        expired: 10,
        on_hold: 5,
        limited: 5,
        total: 70,
    }
}
