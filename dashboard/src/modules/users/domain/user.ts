import { DataLimitResetStrategy } from "./data-limit-reset-strategy"
import { ExpireStrategy } from "./expire-strategy"

export interface UserType {
    expire_strategy: ExpireStrategy;
    usage_duration?: number | null;
    activation_deadline?: Date | string | null;
    expire_date?: Date | string | null;
    data_limit?: number;
    data_limit_reset_strategy: DataLimitResetStrategy;
    lifetime_used_traffic: number;
    used_traffic: number;
    sub_updated_at?: Date | string;
    traffic_reset_at?: Date | string;
    sub_last_user_agent?: string;
    enabled: boolean;
    activated: boolean;
    is_active: boolean;
    expired: boolean;
    data_limit_reached: boolean;
    username: string;
    created_at: string | Date;
    links: string[];
    subscription_url: string;
    service_ids: number[];
    note: string;
    online_at: string;
}

