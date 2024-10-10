import { UserNodeUsagesResponse } from "@marzneshin/modules/users";

type ChartDataEntry = {
    datetime: string;
    [key: string]: number | string;
};

type ChartData = ChartDataEntry[];

export function transformData(initialData: UserNodeUsagesResponse): ChartData {
    const chartData: ChartData = [];
    const nodeDataMap: { [date: string]: ChartDataEntry } = {};

    initialData.node_usages.forEach(node => {
        node.usages.forEach(usage => {
            const timestamp = usage[0] * 1000;
            const date = new Date(timestamp);
            const formattedDate = date.toISOString().split('T')[0];

            if (!nodeDataMap[formattedDate]) {
                nodeDataMap[formattedDate] = { datetime: formattedDate };
            }
            nodeDataMap[formattedDate][node.node_name] = usage[1];
        });
    });

    for (const date in nodeDataMap) {
        chartData.push(nodeDataMap[date]);
    }
    console.log(chartData);
    return chartData;
}
