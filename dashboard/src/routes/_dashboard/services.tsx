import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@marzneshin/components'
import { ServicesTable } from '@marzneshin/features/services';
import { createFileRoute } from '@tanstack/react-router'
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const ServicesPage: FC = () => {
  const { t } = useTranslation();
  return (
    <Card className="m-3">
      <CardHeader>
        <CardTitle>
          {t('services')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ServicesTable />
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card >
  )
};

export const Route = createFileRoute('/_dashboard/services')({
  component: () => <ServicesPage />
})
