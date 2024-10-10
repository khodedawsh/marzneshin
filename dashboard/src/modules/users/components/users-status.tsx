import { FC } from 'react';
import { Badge, Label } from '@marzneshin/components';
import { StatusType } from '@marzneshin/types';
import {
    AlarmClock,
    BrickWall,
    CalendarX,
    Cloud,
    PowerCircle,
    Radio,
    ServerCrash,
    Zap,
    ZapOff
} from 'lucide-react';

interface UsersStatusType {
    [key: string]: StatusType;
}

export const UsersStatus: UsersStatusType = {
    active: {
        icon: PowerCircle,
        label: "Active",
        variant: "positive"
    },
    limited: {
        icon: BrickWall,
        label: "Limited",
        variant: "warning"
    },
    expired: {
        icon: CalendarX,
        label: "Expired",
        variant: "warning"
    },
    on_hold: {
        icon: AlarmClock,
        label: "On Hold",
        variant: "royal"
    },
    error: {
        icon: ServerCrash,
        label: "Error",
        variant: "destructive"
    },
    connecting: {
        icon: Radio,
        label: "Connecting",
        variant: "warning"
    },
    connected: {
        icon: Cloud,
        label: "Connected",
        variant: "positive"
    },
    healthy: {
        icon: Zap,
        label: "Healthy",
        variant: "positive"
    },
    unhealthy: {
        icon: ZapOff,
        label: "Unhealthy",
        variant: "destructive"
    },
}

interface UsersStatusBadgeProps {
    status: StatusType;
}

export const UsersStatusBadge: FC<UsersStatusBadgeProps> = ({ status }) => {
    const { label, icon: Icon } = status;
    return (
        <Badge variant={status.variant} className="h-6">
            {Icon && <Icon className="mr-1 w-5 h-4" />} <Label className="capitalize">{label}</Label>
        </Badge>
    );
};

export default UsersStatusBadge;
