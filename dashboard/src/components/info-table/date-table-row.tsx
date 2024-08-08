import type { FC } from "react";
import { TableRowWithCell } from "./table-row-with-cell";
import { format, isValid } from "date-fns";

export const DateTableRow: FC<{
    label: string;
    withTime?: boolean;
    date?: Date | null | string;
}> = ({ label, date, withTime = false }) => {
    let formattedDate = "";
    if (date && isValid(new Date(date))) {
        const utcDate = new Date(date);
        formattedDate = format(new Date(utcDate.toLocaleString()), withTime ? "Ppp" : "P");
    }
    return <TableRowWithCell label={label} value={formattedDate} />;
};
