import { TokenAssetInfo } from '@ixo/impactxclient-sdk/types/custom_queries/currency.types'
import { FlexBox, GridContainer, GridItem, SvgBox, theme } from 'components/App/App.styles'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ReactComponent as ArrowLeftIcon } from 'assets/images/icon-arrow-left.svg'
import { Typography } from 'components/Typography'
import CurrencyFormat from 'react-currency-format'
import BigNumber from 'bignumber.js'
import { useHistory } from 'react-router-dom'
import { Area, AreaChart, YAxis, ResponsiveContainer } from 'recharts'
import { Button } from 'pages/CreateEntity/Components'
import Avatar from './Avatar'
import { GroupStakingModal, GroupUnstakingModal } from 'components/Modals'
import useCurrentDao, { useCurrentDaoGroup } from 'hooks/currentDao'
import { DaoGroup } from 'redux/currentEntity/dao/currentDao.types'
import { useAccount } from 'hooks/account'
import { contracts } from '@ixo/impactxclient-sdk'
import { convertMicroDenomToDenomWithDecimals } from 'utils/conversions'
import { plus } from 'utils/currency'

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]

interface Props {
  className?: string
  coinDenom: string
  network: string
  coinImageUrl?: string
  lastPriceUsd?: number
  priceChangePercent?: TokenAssetInfo['priceChangePercent']
}

const AssetDetailCard: React.FC<Props> = ({
  coinDenom,
  network,
  coinImageUrl,
  lastPriceUsd,
  priceChangePercent,
  ...rest
}) => {
  const history = useHistory()
  const { cosmWasmClient, address } = useAccount()
  const { selectedGroups } = useCurrentDao()
  const selectedGroup: DaoGroup | undefined = useMemo(() => {
    return Object.keys(selectedGroups).length === 1 ? Object.values(selectedGroups)[0] : undefined
  }, [selectedGroups])
  const { daoVotingCw20StakedClient } = useCurrentDaoGroup(selectedGroup!.coreAddress)
  const [groupStakingModalOpen, setGroupStakingModalOpen] = useState(false)
  const [groupUnstakingModalOpen, setGroupUnstakingModalOpen] = useState(false)
  const [balance, setBalance] = useState('0')
  const [stakedBalance, setStakedBalance] = useState('0')
  const [unstakingBalance, setUnstakingBalance] = useState('0')
  const [claimableBalance] = useState('0')
  const balanceUsd: string = useMemo(
    () => new BigNumber(balance).times(lastPriceUsd ?? 0).toString(),
    [balance, lastPriceUsd],
  )
  const priceChangePercentInOneDay: string = useMemo(
    () => (priceChangePercent && priceChangePercent['1D']) ?? '0',
    [priceChangePercent],
  )
  const balanceUsdChangeInOneDay: string = useMemo(
    () => new BigNumber(balanceUsd).dividedBy(100).times(new BigNumber(priceChangePercentInOneDay)).toString(),
    [balanceUsd, priceChangePercentInOneDay],
  )

  /**
   * @get
   *  Token Balance
   *  Token Info
   * @set
   *  Table data
   */
  const update = useCallback(async (): Promise<void> => {
    if (!daoVotingCw20StakedClient) {
      return
    }

    const stakingContract = await daoVotingCw20StakedClient.stakingContract()
    const cw20StakeClient = new contracts.Cw20Stake.Cw20StakeClient(cosmWasmClient, address, stakingContract)
    const { value: microStakedValue } = await cw20StakeClient.stakedValue({ address })
    const { claims } = await cw20StakeClient.claims({ address })
    const microUnstakingValue = claims.reduce((acc, cur) => plus(acc, cur.amount), '0')

    const tokenContract = await daoVotingCw20StakedClient.tokenContract()
    const cw20BaseClient = new contracts.Cw20Base.Cw20BaseClient(cosmWasmClient, address, tokenContract)
    const tokenInfo = await cw20BaseClient.tokenInfo()
    const { balance: microBalance } = await cw20BaseClient.balance({ address })

    const stakedValue = convertMicroDenomToDenomWithDecimals(microStakedValue, tokenInfo.decimals).toString()
    const unstakingValue = convertMicroDenomToDenomWithDecimals(microUnstakingValue, tokenInfo.decimals).toString()
    const balance = convertMicroDenomToDenomWithDecimals(microBalance, tokenInfo.decimals).toString()
    setStakedBalance(stakedValue)
    setUnstakingBalance(unstakingValue)
    setBalance(balance)
  }, [address, cosmWasmClient, daoVotingCw20StakedClient])

  useEffect(() => {
    update()
  }, [update])

  return (
    <FlexBox
      direction='column'
      width={'100%'}
      height='100%'
      background={theme.ixoGradientDark2}
      borderRadius={'4px'}
      p={5}
      border={'1px solid #083347'}
      gap={6}
      {...rest}
    >
      {/* Card Header */}
      <FlexBox width='100%' justifyContent='space-between' alignItems='center'>
        <FlexBox width='50%' justifyContent='space-between' alignItems='center'>
          {/* coinImageUrl */}
          <FlexBox alignItems='center' gap={2}>
            <Avatar size={38} url={coinImageUrl} />
            <FlexBox direction='column'>
              <Typography size='lg' transform='uppercase'>
                {coinDenom}
              </Typography>
              <Typography size='md'>{network}</Typography>
            </FlexBox>
          </FlexBox>
          {/* coinBalance */}
          <FlexBox direction='column' alignItems='end'>
            {/* coinBalance */}
            <FlexBox alignItems='center' gap={4}>
              <Typography size='lg'>
                <CurrencyFormat
                  displayType={'text'}
                  value={new BigNumber(balance).toString()}
                  thousandSeparator
                  decimalScale={2}
                />
              </Typography>
              <Typography
                size='md'
                color={Number(priceChangePercentInOneDay) >= 0 ? 'green' : 'red'}
                style={{ width: 80 }}
              >
                {priceChangePercentInOneDay}%
              </Typography>
            </FlexBox>
            {/* coinBalance in USD */}
            <FlexBox alignItems='center' gap={4}>
              <Typography size='md' color='dark-blue'>
                <CurrencyFormat prefix='$' displayType={'text'} value={balanceUsd} thousandSeparator decimalScale={2} />
              </Typography>
              <Typography
                size='md'
                color={Number(priceChangePercentInOneDay) >= 0 ? 'green' : 'red'}
                style={{ width: 80 }}
              >
                <CurrencyFormat
                  prefix='$'
                  displayType={'text'}
                  value={balanceUsdChangeInOneDay}
                  thousandSeparator
                  decimalScale={2}
                />
              </Typography>
            </FlexBox>
          </FlexBox>
        </FlexBox>
        <SvgBox color='white' cursor='pointer' onClick={() => history.goBack()}>
          <ArrowLeftIcon />
        </SvgBox>
      </FlexBox>
      {/* Card Body */}
      <GridContainer
        gridTemplateAreas={`"a b"`}
        gridTemplateColumns={'1fr 1fr'}
        gridTemplateRows={'repeat(1, minmax(330px, auto))'}
        gridGap={12}
        width='100%'
      >
        {/* Area chart */}
        <GridItem gridArea='a' alignSelf='center' height={'175px'}>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={data}>
              <defs>
                <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor={theme.ixoNewBlue} stopOpacity={0.4} />
                  <stop offset='95%' stopColor={theme.ixoNewBlue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis
                stroke={theme.ixoWhite}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Area dataKey='uv' stroke={theme.ixoNewBlue} fillOpacity={1} fill='url(#colorUv)' strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </GridItem>
        {/* Staking stats */}
        <GridItem gridArea='b' alignSelf='center'>
          <FlexBox width='100%' direction='column' alignItems='end' gap={12}>
            {/* Balances */}
            <FlexBox width='100%' direction='column' gap={2}>
              {/* available */}
              <FlexBox width='100%' alignItems='center' justifyContent='space-between'>
                <Typography size='lg'>available</Typography>
                <Typography size='lg'>
                  <CurrencyFormat
                    suffix={` ${coinDenom?.toUpperCase()}`}
                    displayType={'text'}
                    value={balance}
                    thousandSeparator
                    decimalScale={2}
                  />
                </Typography>
              </FlexBox>
              {/* staked */}
              <FlexBox width='100%' alignItems='center' justifyContent='space-between'>
                <Typography size='lg'>staked</Typography>
                <Typography size='lg'>
                  <CurrencyFormat
                    suffix={` ${coinDenom?.toUpperCase()}`}
                    displayType={'text'}
                    value={stakedBalance}
                    thousandSeparator
                    decimalScale={2}
                  />
                </Typography>
              </FlexBox>
              {/* unstaking */}
              <FlexBox width='100%' alignItems='center' justifyContent='space-between'>
                <Typography size='lg'>unstaking</Typography>
                <Typography size='lg'>
                  <CurrencyFormat
                    suffix={` ${coinDenom?.toUpperCase()}`}
                    displayType={'text'}
                    value={unstakingBalance}
                    thousandSeparator
                    decimalScale={2}
                  />
                </Typography>
              </FlexBox>
              {/* claimable */}
              <FlexBox width='100%' alignItems='center' justifyContent='space-between'>
                <Typography size='lg'>claimable</Typography>
                <Typography size='lg'>
                  <CurrencyFormat
                    suffix={` ${coinDenom?.toUpperCase()}`}
                    displayType={'text'}
                    value={claimableBalance}
                    thousandSeparator
                    decimalScale={2}
                  />
                </Typography>
              </FlexBox>
            </FlexBox>
            {/* Manage action */}
            <FlexBox gap={3} width='100%' justifyContent='flex-end'>
              <Button
                variant='secondary'
                size='flex'
                height={40}
                textSize='base'
                textTransform='capitalize'
                textWeight='medium'
                onClick={() => setGroupStakingModalOpen(true)}
              >
                Stake
              </Button>
              <Button
                variant='secondary'
                size='flex'
                height={40}
                textSize='base'
                textTransform='capitalize'
                textWeight='medium'
                onClick={() => setGroupUnstakingModalOpen(true)}
              >
                Unstake
              </Button>
            </FlexBox>
          </FlexBox>
        </GridItem>
      </GridContainer>

      {groupStakingModalOpen && selectedGroup && (
        <GroupStakingModal
          open={groupStakingModalOpen}
          setOpen={setGroupStakingModalOpen}
          daoGroup={selectedGroup}
          onSuccess={update}
        />
      )}
      {groupUnstakingModalOpen && selectedGroup && (
        <GroupUnstakingModal
          open={groupUnstakingModalOpen}
          setOpen={setGroupUnstakingModalOpen}
          daoGroup={selectedGroup}
          onSuccess={update}
        />
      )}
    </FlexBox>
  )
}

export default AssetDetailCard
