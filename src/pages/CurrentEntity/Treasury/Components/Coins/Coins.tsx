import BigNumber from 'bignumber.js'
import { FlexBox } from 'components/App/App.styles'
import { Table } from 'components/Table'
import { Typography } from 'components/Typography'
import React, { useEffect, useState } from 'react'
import CurrencyFormat from 'react-currency-format'
import styled from 'styled-components'
import { Avatar } from 'pages/CurrentEntity/Components'
import { customQueries } from '@ixo/impactxclient-sdk'
import { GetBalances } from 'lib/protocol'
import { getDisplayAmount } from 'utils/currency'
import { errorToast } from 'utils/toast'

const TableWrapper = styled.div`
  color: white;
  width: 100%;

  table {
    width: 100%;
    border-spacing: 0 8px;
    border-collapse: separate;

    th,
    td {
      height: inherit;
    }

    tbody > tr {
      border-radius: 8px;
      outline-style: solid;
      outline-width: 1px;
      outline-color: transparent;
      transition: all 0.2s;

      & > td:first-child {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
      }
      & > td:last-child {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
      }

      &:hover {
        outline-color: ${(props) => props.theme.ixoNewBlue};
      }
    }
  }
`

const renderTableHeader = (name: string, justifyContent = 'flex-start') => (
  <FlexBox
    p={4}
    justifyContent={
      justifyContent as
        | 'flex-start'
        | 'flex-end'
        | 'center'
        | 'space-between'
        | 'space-around'
        | 'space-evenly'
        | 'stretch'
    }
  >
    <Typography color='light-grey-blue' transform='uppercase' weight='bold' size='md'>
      {name}
    </Typography>
  </FlexBox>
)

const columns = [
  {
    Header: renderTableHeader('Token'),
    accessor: 'name',
    renderCell: (cell: any) => {
      const coinDenom = cell.row.original?.coinDenom
      const network = cell.row.original?.network
      const coinImageUrl = cell.row.original?.coinImageUrl

      return (
        <FlexBox alignItems='center' gap={2} p={4}>
          <Avatar size={38} url={coinImageUrl} />
          <FlexBox direction='column'>
            <Typography size='lg' transform='uppercase'>
              {coinDenom}
            </Typography>
            <Typography size='md'>{network}</Typography>
          </FlexBox>
        </FlexBox>
      )
    },
  },
  {
    Header: renderTableHeader('Amount', 'flex-end'),
    accessor: 'balance',
    renderCell: (cell: any) => {
      const balance = cell.value
      const lastPriceUsd = cell.row.original?.lastPriceUsd ?? 0
      const balanceUsd = new BigNumber(balance).times(lastPriceUsd).toString()
      return (
        <FlexBox direction='column' alignItems='end' p={4}>
          <Typography size='lg'>
            <CurrencyFormat
              displayType={'text'}
              value={new BigNumber(balance).toString()}
              thousandSeparator
              decimalScale={2}
            />
          </Typography>
          <Typography size='md' color='dark-blue'>
            <CurrencyFormat prefix='$' displayType={'text'} value={balanceUsd} thousandSeparator decimalScale={2} />
          </Typography>
        </FlexBox>
      )
    },
  },
]

interface Props {
  address: string
}

const Coins: React.FC<Props> = ({ address }) => {
  const [data, setData] = useState<{
    [denom: string]: {
      balance: string
      network: string
      coinDenom: string
      coinImageUrl: string
      lastPriceUsd: number
    }
  }>({})

  function addData(
    coinDenom: string,
    payload: {
      balance: string
      network: string
      coinDenom: string
      coinImageUrl: string
      lastPriceUsd: number
    },
  ) {
    setData((pre) => ({ ...pre, [coinDenom]: payload }))
  }

  /**
   * @description get the balances by address
   */
  useEffect(() => {
    if (address) {
      setData({})
      GetBalances(address)
        .then((balances) => {
          balances.forEach(({ amount, denom }) => {
            /**
             * @description find token info from currency list via sdk
             */
            const token = customQueries.currency.findTokenFromDenom(denom)

            customQueries.currency.findTokenInfoFromDenom(denom).then((response) => {
              const { coinName, lastPriceUsd } = response
              const payload = {
                balance: getDisplayAmount(amount, token.coinDecimals),
                network: `${coinName.toUpperCase()} Network`,
                coinDenom: token.coinDenom,
                coinImageUrl: token.coinImageUrl!,
                lastPriceUsd,
              }
              addData(payload.coinDenom, payload)
            })
          })
        })
        .catch((e) => {
          errorToast('Error', e.toString())
        })
    }
  }, [address])

  const handleRowClick = (state: any) => () => {
    console.log('handleRowClick', { state })
  }

  return Object.keys(data).length > 0 ? (
    <FlexBox width='100%' direction='column' gap={3}>
      <TableWrapper>
        <Table
          columns={columns}
          data={Object.values(data)}
          getRowProps={(state) => ({
            style: { height: 70, cursor: 'pointer' },
            onClick: handleRowClick(state),
          })}
          getCellProps={() => ({ style: { background: '#023044' } })}
        />
      </TableWrapper>
    </FlexBox>
  ) : (
    <Typography variant='secondary' size='2xl' color='dark-blue'>
      No Coins
    </Typography>
  )
}

export default Coins
