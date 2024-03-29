import {
  Alert,
  Button,
  Tooltip,
  IconButton,
  Spinner,
  AlertIcon,
  Box,
  Collapse,
  Flex,
  Grid,
  GridItem,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Modal,
  VStack,
  useColorMode,
  useToast,
  ModalOverlay,
  HStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  User,
  FilterUsageType,
  UserCreate,
  Service
} from 'types';
import { UsageFilter, createUsageConfig } from 'components/usage-filter';
import {
  AddIcon,
  EditIcon,
  DialogModalHeader,
  DialogModalFooter,
  DeleteIcon
} from 'components/dialog';
import { UserUsageIcon } from './icons';
import { getDefaultValues } from './default-values';
import { schema, FormType } from './form-schema';
import { ServicesField } from './services-field';
import { UsernameField } from './username-field';
import { DataLimitField } from './data-limit-field';
import { PeriodicUsageReset } from './periodic-usage-reset';
import { ExpireDateField } from './expire-date-field';
import { NoteField } from './note-field';
import { useUsers, useServices, fetchServices } from 'stores';
import { queryIds } from 'constants/query-ids';
import { useQuery } from '@tanstack/react-query';

const formatUser = (user: User): FormType => {
  const services: number[] = user.services.map((service: number | Service): number => {
    return (typeof service !== 'number') ? service.id : service;
  });
  return {
    ...user,
    services,
    data_limit: user.data_limit
      ? Number((user.data_limit / 1073741824).toFixed(5))
      : user.data_limit,
  };
};

export type UserDialogProps = {};

export const UserDialog: FC<UserDialogProps> = () => {
  const {
    editingUser,
    isCreatingNewUser,
    onCreateUser,
    editUser,
    fetchUserUsage,
    onEditingUser,
    createUser,
    onDeletingUser,
  } = useUsers();
  const { refetchServices, servicesFilters: filters } = useServices();
  const { data: services } = useQuery({
    queryKey: [queryIds.services],
    initialData: [],
    queryFn: () => {
      return fetchServices(filters);
    }
  });
  const isEditing = !!editingUser;
  const isOpen = isCreatingNewUser || isEditing;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>('');
  const toast = useToast();
  const { t, i18n } = useTranslation();

  const { colorMode } = useColorMode();

  const [usageVisible, setUsageVisible] = useState(false);
  const handleUsageToggle = () => {
    setUsageVisible((current) => !current);
  };

  const form = useForm<FormType>({
    defaultValues: getDefaultValues(),
    resolver: zodResolver(schema),
  });

  const [dataLimit] = useWatch({
    control: form.control,
    name: ['data_limit'],
  });

  const usageTitle = t('userDialog.total');
  const [usage, setUsage] = useState(createUsageConfig(colorMode, usageTitle));
  const [usageFilter, setUsageFilter] = useState('1m');
  const fetchUsageWithFilter = (query: FilterUsageType) => {
    fetchUserUsage(editingUser!, query).then((data: any) => {
      const labels = [];
      const series = [];
      for (const key in data.usages) {
        series.push(data.usages[key].used_traffic);
        labels.push(data.usages[key].node_name);
      }
      setUsage(createUsageConfig(colorMode, usageTitle, series, labels));
    });
  };

  useEffect(() => {
    if (isOpen) {
      refetchServices();
    }
  }, [isOpen]);


  useEffect(() => {
    if (editingUser) {
      form.reset(formatUser(editingUser));

      fetchUsageWithFilter({
        start: dayjs().utc().subtract(30, 'day').format('YYYY-MM-DDTHH:00:00'),
      });
    }
  }, [editingUser]);

  const submit = async (values: FormType) => {
    setLoading(true);
    const methods = { edited: editUser, created: createUser };
    const method = isEditing ? 'edited' : 'created';
    setError(null);
    const { services, username, ...rest } = values;

    let body: UserCreate = {
      ...rest,
      username,
      services,
      data_limit: values.data_limit,
      data_limit_reset_strategy:
        values.data_limit && values.data_limit > 0
          ? values.data_limit_reset_strategy
          : 'no_reset',
      status:
        values.status === 'active' || values.status === 'disabled'
          ? values.status
          : 'active',
    };

    await methods[method](body)
      .then(() => {
        toast({
          title: t(
            isEditing ? 'userDialog.userEdited' : 'userDialog.userCreated',
            { username: values.username }
          ),
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 3000,
        });
        onClose();
      })
      .catch((err) => {
        if (err?.response?.status === 409 || err?.response?.status === 400)
          setError(err?.response?._data?.detail);
        if (err?.response?.status === 422) {
          Object.keys(err.response._data.detail).forEach((key) => {
            setError(err?.response._data.detail[key] as string);
            form.setError(
              key as 'services' | 'username' | 'data_limit' | 'expire',
              {
                type: 'custom',
                message: err.response._data.detail[key],
              }
            );
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onClose = () => {
    form.reset(getDefaultValues());
    onCreateUser(false);
    onEditingUser(null);
    setError(null);
    setUsageVisible(false);
    setUsageFilter('1m');
  };

  const handleResetUsage = () => {
    useUsers.setState({ resetUsageUser: editingUser });
  };

  const handleRevokeSubscription = () => {
    useUsers.setState({ revokeSubscriptionUser: editingUser });
  };

  const disabled = loading;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <FormProvider {...form} formState={form.formState}>
        <ModalContent mx="3">
          <form onSubmit={form.handleSubmit(submit)}>
            <DialogModalHeader HeaderIcon={isEditing ? EditIcon : AddIcon} title={isEditing ? t('userDialog.editUserTitle') : t('createNewUser')} />
            <ModalCloseButton mt={3} disabled={disabled} />
            <ModalBody>
              <Grid
                templateColumns={{
                  base: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
                gap={3}
              >
                <GridItem>
                  <VStack justifyContent="space-between">
                    <Flex
                      flexDirection="column"
                      gridAutoRows="min-content"
                      w="full"
                    >
                      <UsernameField form={form} disabled={disabled} isEditing={isEditing} t={t} />
                      <DataLimitField form={form} disabled={disabled} t={t} />

                      <Collapse
                        in={!!(dataLimit && dataLimit > 0)}
                        animateOpacity
                        style={{ width: '100%' }}
                      >
                        <PeriodicUsageReset form={form} t={t} />
                      </Collapse>
                      <ExpireDateField form={form} t={t} i18n={i18n} disabled={disabled} />
                      <NoteField form={form} t={t} />
                    </Flex>
                    {error && (
                      <Alert
                        status="error"
                        display={{ base: 'none', md: 'flex' }}
                      >
                        <AlertIcon />
                        {error}
                      </Alert>
                    )}
                  </VStack>
                </GridItem>

                <GridItem>
                  <ServicesField t={t} services={services || []} form={form} />
                </GridItem>

                {isEditing && usageVisible && (
                  <GridItem pt={6} colSpan={{ base: 1, md: 2 }}>
                    <VStack gap={4}>
                      <UsageFilter
                        defaultValue={usageFilter}
                        onChange={(filter, query) => {
                          setUsageFilter(filter);
                          fetchUsageWithFilter(query);
                        }}
                      />
                      <Box
                        width={{ base: '100%', md: '70%' }}
                        justifySelf="center"
                      >
                        <ReactApexChart
                          options={usage.options}
                          series={usage.series}
                          type="donut"
                        />
                      </Box>
                    </VStack>
                  </GridItem>
                )}
              </Grid>

              {error && (
                <Alert
                  mt="3"
                  status="error"
                  display={{ base: 'flex', md: 'none' }}
                >
                  <AlertIcon />
                  {error}
                </Alert>
              )}
            </ModalBody>
            <DialogModalFooter>
              <HStack
                justifyContent="flex-start"
                w={{
                  base: 'full',
                  sm: 'unset',
                }}
              >
                {isEditing && editingUser !== null && (
                  <>
                    <Tooltip label={t('delete')} placement="top">
                      <IconButton
                        aria-label="Delete"
                        size="sm"
                        onClick={() => {
                          onDeletingUser(editingUser);
                          onClose();
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip label={t('userDialog.usage')} placement="top">
                      <IconButton
                        aria-label="usage"
                        size="sm"
                        onClick={handleUsageToggle}
                      >
                        <UserUsageIcon />
                      </IconButton>
                    </Tooltip>
                    <Button onClick={handleResetUsage} size="sm">
                      {t('userDialog.resetUsage')}
                    </Button>
                    <Button onClick={handleRevokeSubscription} size="sm">
                      {t('userDialog.revokeSubscription')}
                    </Button>
                  </>
                )}
              </HStack>
              <HStack
                w="full"
                maxW={{ md: '50%', base: 'full' }}
                justify="end"
              >
                <Button
                  type="submit"
                  size="sm"
                  px="8"
                  colorScheme="primary"
                  leftIcon={loading ? <Spinner size="xs" /> : undefined}
                  disabled={false}
                >
                  {isEditing ? t('userDialog.editUser') : t('createUser')}
                </Button>
              </HStack>
            </DialogModalFooter>
          </form>
        </ModalContent>
      </FormProvider>
    </Modal >
  );
};
