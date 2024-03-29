import { HStack, Input, Tooltip, Box, Switch, FormControl, FormLabel } from '@chakra-ui/react';
import { TFunction } from 'i18next';
import { Controller } from 'react-hook-form';

interface UsernameFieldProps {
    form: any;
    isEditing: boolean;
    t: TFunction<'translation', undefined, 'translation'>;
    disabled: boolean;
}

export const UsernameField = ({ form, isEditing, t, disabled }: UsernameFieldProps) => {
  return (
    <FormControl mb={'10px'}>
      <FormLabel>{t('username')}</FormLabel>
      <HStack>
        <Input
          size="sm"
          type="text"
          borderRadius="6px"
          error={form.formState.errors.username?.message}
          disabled={disabled || isEditing}
          {...form.register('username')}
        />
        {isEditing && (
          <HStack px={1}>
            <Controller
              name="status"
              control={form.control}
              render={({ field }) => {
                return (
                  <Tooltip
                    placement="top"
                    label={'status: ' + field.value}
                    textTransform="capitalize"
                  >
                    <Box>
                      <Switch
                        colorScheme="primary"
                        disabled={
                          field.value !== 'active' &&
                                                    field.value !== 'disabled'
                        }
                        isChecked={field.value === 'active'}
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange('active');
                          } else {
                            field.onChange('disabled');
                          }
                        }}
                      />
                    </Box>
                  </Tooltip>
                );
              }}
            />
          </HStack>
        )}
      </HStack>
    </FormControl>
  )
}
