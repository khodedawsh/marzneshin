export type DataLimitResetStrategy =
    | 'no_reset'
    | 'day'
    | 'week'
    | 'month'
    | 'year';

export type Status =
    | 'active'
    | 'disabled'
    | 'limited'
    | 'expired'
    | 'on_hold'
    | 'error'
    | 'connecting'
    | 'healthy'
    | 'unhealthy'
    | 'connected';

export interface UserType {
    expire: number | null;
    data_limit: number | null;
    data_limit_reset_strategy: DataLimitResetStrategy;
    lifetime_used_traffic: number;
    username: string;
    used_traffic: number;
    status: Status;
    links: string[];
    subscription_url: string;
    services: number[];
    note: string;
    online_at: string;
}

export type UserCreateType = Pick<
    UserType,
    | 'services'
    | 'expire'
    | 'data_limit'
    | 'data_limit_reset_strategy'
    | 'username'
    | 'status'
    | 'note'
>;
