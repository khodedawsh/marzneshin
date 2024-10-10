import { FC } from 'react';
import { UsersIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    MiniWidget,
    PieChart,
} from "@marzneshin/components";
import { UsersStatsLegend } from './legend';

interface UsersStatsWidgetProps {
    active: number;
    online: number;
    expired: number;
    on_hold: number;
    limited: number;
    total: number;
}

export const UsersStatsWidget: FC<UsersStatsWidgetProps> = ({
    active, online, expired, on_hold, limited, total,
}) => {
    const { t } = useTranslation();

    const data = [
        { symbol: "Active", amount: active, color: "fill-blue-500" },
        { symbol: "Online", amount: online, color: "fill-emerald-500" },
        { symbol: "Expired", amount: expired, color: "fill-gray-600" },
        { symbol: "On Hold", amount: on_hold, color: "fill-purple-500" },
        { symbol: "Limited", amount: limited, color: "fill-red-500" },
    ];

    return (
        <MiniWidget
            title={<> <UsersIcon /> {t('users')} </>}
        >
            <div className='flex md:flex-row flex-col items-center md:items-start gap-5 justify-between'>
                <PieChart
                    data={data}
                    width={200}
                    height={200}
                    total={total}
                    label={t('users')}
                />
                <UsersStatsLegend />
            </div>
        </MiniWidget>
    );
};

