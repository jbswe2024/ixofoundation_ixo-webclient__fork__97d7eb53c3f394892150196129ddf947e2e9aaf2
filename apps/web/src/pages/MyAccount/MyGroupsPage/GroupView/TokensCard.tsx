import { Avatar, Card } from 'pages/CurrentEntity/Components'
import React, { useCallback, useEffect, useState } from 'react'
import { ReactComponent as AgentIcon } from 'assets/img/sidebar/agents.svg'
import { Button, Flex } from '@mantine/core'
import { Typography } from 'components/Typography'
import { TDAOGroupModel } from 'types/entities'
import { convertMicroDenomToDenomWithDecimals } from 'utils/conversions'
import { contracts } from '@ixo/impactxclient-sdk'
import { useAccount } from 'hooks/account'
import { claimAvailable } from 'utils/tokenClaim'
import { plus } from 'utils/currency'
import CurrencyFormat from 'react-currency-format'
import { GroupStakingModal, GroupUnstakingModal } from 'components/Modals'
import useCurrentEntity from 'hooks/currentEntity'

interface Props {
  daoGroup: TDAOGroupModel
}
const TokensCard: React.FC<Props> = ({ daoGroup }) => {
  const token = daoGroup.token
  const { cwClient, address } = useAccount()
  const { updateDAOGroup } = useCurrentEntity()
  const [stakedBalance, setStakedBalance] = useState('0')
  const [unstakingBalance, setUnstakingBalance] = useState('0')
  const [claimableBalance, setClaimableBalance] = useState('0')
  const [groupStakingModalOpen, setGroupStakingModalOpen] = useState(false)
  const [groupUnstakingModalOpen, setGroupUnstakingModalOpen] = useState(false)

  const getInfo = useCallback(async (): Promise<void> => {
    const daoVotingCw20StakedClient = new contracts.DaoVotingCw20Staked.DaoVotingCw20StakedQueryClient(
      cwClient,
      daoGroup.votingModule.votingModuleAddress,
    )

    const stakingContract = await daoVotingCw20StakedClient.stakingContract()
    const cw20StakeClient = new contracts.Cw20Stake.Cw20StakeQueryClient(cwClient, stakingContract)
    const { value: microStakedValue } = await cw20StakeClient.stakedValue({ address })
    const { claims } = await cw20StakeClient.claims({ address })
    const microUnstakingValue = claims
      .filter((claim) => !claimAvailable(claim, 0)) //  TODO: TBD blockHeight
      .reduce((acc, cur) => plus(acc, cur.amount), '0')
    const microClaimableValue = claims
      .filter((claim) => claimAvailable(claim, 0)) //  TODO: TBD blockHeight
      .reduce((acc, cur) => plus(acc, cur.amount), '0')

    const tokenContract = await daoVotingCw20StakedClient.tokenContract()
    const cw20BaseClient = new contracts.Cw20Base.Cw20BaseQueryClient(cwClient, tokenContract)
    const tokenInfo = await cw20BaseClient.tokenInfo()

    const stakedValue = convertMicroDenomToDenomWithDecimals(microStakedValue, tokenInfo.decimals).toString()
    const unstakingValue = convertMicroDenomToDenomWithDecimals(microUnstakingValue, tokenInfo.decimals).toString()
    const claimableValue = convertMicroDenomToDenomWithDecimals(microClaimableValue, tokenInfo.decimals).toString()

    setStakedBalance(stakedValue)
    setUnstakingBalance(unstakingValue)
    setClaimableBalance(claimableValue)
  }, [address, cwClient, daoGroup.votingModule.votingModuleAddress])

  const handleUpdate = () => {
    daoGroup?.coreAddress && updateDAOGroup(daoGroup?.coreAddress)
    getInfo()
  }

  useEffect(() => {
    getInfo()
    return () => {
      setStakedBalance('0')
      setUnstakingBalance('0')
      setClaimableBalance('0')
    }
  }, [getInfo])

  const TokenDetail = () => {
    return (
      <Flex align={'center'} gap={4}>
        <Avatar size={24} borderWidth={0} url={(token?.marketingInfo.logo as any)?.url} />
        <Typography transform='uppercase'>{token?.tokenInfo.symbol}</Typography>
      </Flex>
    )
  }

  return (
    <Card label='Token' icon={<AgentIcon />}>
      <Flex w={'100%'} h={'100%'} direction={'column'} justify={'space-between'}>
        <Flex direction={'column'} gap={16}>
          <Flex align={'center'} justify={'space-between'}>
            <Typography>Staked</Typography>
            <Flex align={'center'} gap={12}>
              <Typography>
                <CurrencyFormat displayType={'text'} value={stakedBalance} thousandSeparator decimalScale={2} />
              </Typography>
              <TokenDetail />
            </Flex>
          </Flex>
          <Flex align={'center'} justify={'space-between'}>
            <Typography>Unstaking</Typography>
            <Flex align={'center'} gap={12}>
              <Typography>
                <CurrencyFormat displayType={'text'} value={unstakingBalance} thousandSeparator decimalScale={2} />
              </Typography>
              <TokenDetail />
            </Flex>
          </Flex>
          <Flex align={'center'} justify={'space-between'}>
            <Typography>Claimable</Typography>
            <Flex align={'center'} gap={12}>
              <Typography>
                <CurrencyFormat displayType={'text'} value={claimableBalance} thousandSeparator decimalScale={2} />
              </Typography>
              <TokenDetail />
            </Flex>
          </Flex>
        </Flex>

        <Flex w='100%' gap={16}>
          <Button
            w={'100%'}
            variant='outline'
            style={{ color: 'white' }}
            onClick={() => setGroupStakingModalOpen(true)}
          >
            Stake
          </Button>
          <Button
            w={'100%'}
            variant='outline'
            style={{ color: 'white' }}
            onClick={() => setGroupUnstakingModalOpen(true)}
          >
            Unstake
          </Button>
        </Flex>
      </Flex>

      {groupStakingModalOpen && (
        <GroupStakingModal
          open={groupStakingModalOpen}
          setOpen={setGroupStakingModalOpen}
          daoGroup={daoGroup}
          onSuccess={handleUpdate}
        />
      )}
      {groupUnstakingModalOpen && (
        <GroupUnstakingModal
          open={groupUnstakingModalOpen}
          setOpen={setGroupUnstakingModalOpen}
          daoGroup={daoGroup}
          onSuccess={handleUpdate}
        />
      )}
    </Card>
  )
}

export default TokensCard