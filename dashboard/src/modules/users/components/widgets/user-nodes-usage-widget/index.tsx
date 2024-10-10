import { FC } from 'react';
import { transformData } from "./transform-data";
import { useTranslation } from 'react-i18next';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SectionWidget,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,
} from "@marzneshin/components";
import { UserType, useUserNodeUsagesQuery } from "@marzneshin/modules/users";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useState } from "react";

export interface NodesUsage {
    datetime: Date;
    nodes: Record<string, number>;
}

interface UserNodesUsageWidgetProps {
    user: UserType;
}

const chartConfig = {
    views: {
        label: "Page Views",
    },
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

type ChartDateInterval = '90d' | '30d' | '7d';

function useStartEndDateFromNow(timeRange: ChartDateInterval) {
    const start = new Date();
    const end = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
        daysToSubtract = 30;
    } else if (timeRange === "7d") {
        daysToSubtract = 7;
    }
    start.setDate(end.getDate() - daysToSubtract);
    return {
        start: start.toISOString(),
        end: end.toISOString()
    }
}


export const UserNodesUsageWidget: FC<UserNodesUsageWidgetProps> = ({
    user,
}) => {
    const { t } = useTranslation();
    const [timeRange, setTimeRange] = useState("90d")
    const { start, end } = useStartEndDateFromNow(timeRange as ChartDateInterval);
    const { data, isLoading } = useUserNodeUsagesQuery({ username: user.username, start, end })
    const chartData = transformData(data);

    return (
        <SectionWidget
            title="User Nodes Usage"
            description="The amount of user usage of each nodes in time."
            footer={
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            }
        >
            <ChartContainer
                className="aspect-auto h-[250px] w-full"
                config={chartConfig}>
                <AreaChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                        left: 12,
                        right: 12,
                    }}
                >
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <defs>
                        {data.node_usages.map(node => {
                            return <linearGradient id={node.node_name} x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        })}
                    </defs>
                    {data.node_usages.map(node =>
                        <Area
                            dataKey="mobile"
                            type="natural"
                            fill={`url(#${node.node_name})`}
                            fillOpacity={0.4}
                            stroke="var(--color-mobile)"
                            stackId="a"
                        />
                    )}
                </AreaChart>
            </ChartContainer>
        </SectionWidget>
    );
};
