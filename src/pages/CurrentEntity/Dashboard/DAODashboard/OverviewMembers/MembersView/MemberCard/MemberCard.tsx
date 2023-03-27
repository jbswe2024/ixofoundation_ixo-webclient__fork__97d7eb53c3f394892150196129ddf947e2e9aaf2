import { Box, FlexBox, GridContainer, SvgBox, theme } from 'components/App/App.styles'
import { Typography } from 'components/Typography'
import React, { useState } from 'react'
import styled from 'styled-components'
import { ReactComponent as PieIcon } from 'assets/images/icon-pie.svg'
import { ReactComponent as ClaimIcon } from 'assets/images/icon-claim.svg'
import { ReactComponent as MultisigIcon } from 'assets/images/icon-multisig.svg'
import { ReactComponent as PaperIcon } from 'assets/images/icon-paper.svg'
import ThreeDot from 'assets/icons/ThreeDot'
import { truncateString } from 'utils/formatters'
import { STATUSES } from '../../Toolbar/Toolbar'
import { MemberDetailCard } from '../MemberDetailCard'
import { useHistory } from 'react-router-dom'
import { Avatar } from '../../../Components'

const Wrapper = styled(FlexBox)<{ focused: boolean }>`
  ${({ theme, focused }) => focused && `border-color: ${theme.ixoLightBlue};`}
  &:hover {
    border-color: ${(props) => props.theme.ixoLightBlue};

    & > #three_dot {
      visibility: visible;
    }
  }
`

interface Props {
  member: {
    avatar?: string
    name?: string
    role?: string
    staking?: number
    votes?: number
    proposals?: number
    status?: 'approved' | 'pending' | 'rejected'
    verified?: boolean
    administrator?: boolean
    assignedAuthority?: number

    addr: string
    weight: number
    votingPower?: number
  }
  selected: boolean
  onSelectMember: (addr: string) => void
}

const MemberCard: React.FC<Props> = ({ member, selected, onSelectMember }): JSX.Element => {
  const history = useHistory()
  const { avatar, name, addr, role, status, staking, votes, proposals, votingPower } = member
  const [detailView, setDetailView] = useState(false)

  const handleMemberView = () => {
    history.push(`${history.location.pathname}/${addr}`)
  }

  return !detailView ? (
    <Wrapper
      minWidth='240px'
      width='100%'
      height={'320px'}
      direction='column'
      alignItems='center'
      justifyContent='space-between'
      borderRadius='12px'
      padding={6}
      background={'linear-gradient(180deg, #01273A 0%, #002D42 100%)'}
      cursor='pointer'
      borderWidth='2px'
      borderStyle='solid'
      borderColor={theme.ixoDarkBlue}
      transition='all .2s'
      position='relative'
      focused={selected}
      onClick={() => onSelectMember(addr)}
    >
      <Box
        position='absolute'
        top='20px'
        left='20px'
        borderRadius='100%'
        width='12px'
        height='12px'
        background={STATUSES[status!]?.color}
      />
      <Box
        id='three_dot'
        visibility='hidden'
        position='absolute'
        top={'16px'}
        right={'16px'}
        transition='all .2s'
        onClick={(event) => {
          setDetailView(true)
          event.stopPropagation()
        }}
      >
        <ThreeDot />
      </Box>

      <Avatar url={avatar} size={100} />

      <FlexBox direction='column' gap={2} width='100%' alignItems='center'>
        <Typography size='lg' color='white' weight='medium' hover={{ underline: true }} onClick={handleMemberView}>
          {truncateString(name ?? addr, 20)}
        </Typography>
        <Typography size='sm' color='light-blue' weight='medium'>
          {role}
        </Typography>
      </FlexBox>

      <GridContainer columns={2} columnGap={2} rowGap={2} width='100%'>
        <FlexBox alignItems='center' gap={2} lineHeight='0px'>
          <SvgBox svgWidth={6} svgHeight={6} color={theme.ixoLightBlue}>
            <ClaimIcon />
          </SvgBox>
          <Typography size='sm' color='white' weight='medium'>
            {new Intl.NumberFormat('en-us', {
              style: 'percent',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(votingPower ?? 0)}
          </Typography>
        </FlexBox>

        <FlexBox alignItems='center' gap={2} lineHeight='0px'>
          <SvgBox svgWidth={6} svgHeight={6} color={theme.ixoLightBlue}>
            <PieIcon />
          </SvgBox>
          <Typography size='sm' color='white' weight='medium'>
            {new Intl.NumberFormat(undefined, {
              notation: 'compact',
              compactDisplay: 'short',
              minimumFractionDigits: 2,
            })
              .format(staking ?? 0)
              .replace(/\D00$/, '')}
          </Typography>
        </FlexBox>

        <FlexBox alignItems='center' gap={2} lineHeight='0px'>
          <SvgBox svgWidth={6} svgHeight={6} color={theme.ixoLightBlue}>
            <MultisigIcon />
          </SvgBox>
          <Typography size='sm' color='white' weight='medium'>
            {votes ?? 0}
          </Typography>
        </FlexBox>

        <FlexBox alignItems='center' gap={2} lineHeight='0px'>
          <SvgBox svgWidth={6} svgHeight={6} color={theme.ixoLightBlue}>
            <PaperIcon />
          </SvgBox>
          <Typography size='sm' color='white' weight='medium'>
            {proposals ?? 0}
          </Typography>
        </FlexBox>
      </GridContainer>
    </Wrapper>
  ) : (
    <MemberDetailCard member={member} onClose={() => setDetailView(false)} />
  )
}

export default MemberCard