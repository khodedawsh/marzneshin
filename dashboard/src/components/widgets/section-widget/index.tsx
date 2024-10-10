import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Separator,
} from '@marzneshin/components';
import type { FC, PropsWithChildren } from 'react';

export interface SectionWidgetProps extends PropsWithChildren {
    title: JSX.Element | string;
    description: JSX.Element | string;
    content?: JSX.Element | string;
    footer?: JSX.Element | string;
    options?: JSX.Element | string;
}

export const SectionWidget: FC<SectionWidgetProps> = ({
    options, footer, content, children, title, description
}) => {
    return (
        <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle className="flex flex-row justify-start items-center gap-3 text-xl">
                        {title}
                    </CardTitle>
                    <CardDescription>
                        {description}
                    </CardDescription>
                </div>
                {options &&
                    <div className="flex items-center flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                        {options}
                    </div>
                }
            </CardHeader>
            <Separator />
            <CardContent className="p-4">
                {content || children}
            </CardContent>
            {footer && <CardFooter> {footer} </CardFooter>}
        </Card>
    )
}
