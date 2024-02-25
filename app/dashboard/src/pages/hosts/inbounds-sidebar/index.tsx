import { Table, Thead, Tbody, Th, Td, Tr, HStack } from '@chakra-ui/react';
import classNames from 'classnames';
import { InboundCard } from 'components/inbounds-card';
import { handleSort } from 'components/table';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useInbounds } from 'stores';

export const InboundsSidebar = () => {
  const {
    inbounds,
    onInboundsFilterChange,
    inboundsFilters: filters,
    selectedInbound,
    selectInbound,
    refetchInbounds
  } = useInbounds();
  const { t } = useTranslation();
  useEffect(() => {
    inbounds.length === 0 && refetchInbounds();
  }, [inbounds.length])
  return (
    <Table orientation="vertical" zIndex="docked" pr="3" >
      <Thead zIndex="docked" position="relative">
        <Tr>
          <Th
            minW="120px"
            pl={4}
            pr={4}
            cursor={'pointer'}
            onClick={handleSort.bind(null, filters, 'tag', onInboundsFilterChange)}
          >
            <HStack>
              <span>{t('inbounds')}</span>
            </HStack>
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {inbounds.map((inbound, i) => {
          const active = inbounds[i] == selectedInbound
          return (
            <Tr key={i}
              className={classNames('interactive')}
              bg={active ? 'gray.300' : undefined}
              _dark={{ bg: active ? 'gray.700' : undefined }}
              onClick={() => { selectInbound(inbound) }}>
              <Td>
                <InboundCard

                  tag={inbound.tag}
                  nodeName={inbound.node.name}
                  protocol={inbound.protocol}
                />
              </Td>
            </Tr>);
        })}
      </Tbody>
    </Table>
  )
}