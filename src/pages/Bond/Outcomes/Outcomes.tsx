import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
// import OutcomeTable from './components/OutcomeTable'
import {
  Container,
  SectionTitleContainer,
  SectionTitle,
  // StyledButton,
  // AlphaSpan,
} from './Outcomes.style'
import OutcomeTarget from './Components/OutcomeTarget'
import { getOutcomesTargets } from 'redux/bond/bond.actions'
import { thousandSeparator } from 'utils/formatters'
import { Entity } from 'redux/selectedEntity/selectedEntity.types'

const Outcomes: React.FunctionComponent = () => {
  const dispatch = useAppDispatch()
  const { Targets } = useAppSelector((state) => state.activeBond.Outcomes)
  const { claims } = useAppSelector((state) => state.selectedEntity as Entity)

  const getClaimStats = (claimTemplateId: string): any => {
    let approved = 0
    let pending = 0
    let rejected = 0
    let remaining = 0
    claims
      .filter((claim) => claim.claimTemplateId === claimTemplateId)
      .forEach((claim) => {
        switch (claim.status) {
          case '0':
            pending += 1
            break
          case '1':
            approved += 1
            break
          case '2':
            rejected += 1
            break
          case '3':
            remaining += 1
            break
          default:
            break
        }
      })
    return {
      approved,
      pending,
      rejected,
      remaining,
    }
  }

  useEffect(() => {
    dispatch(getOutcomesTargets() as any)
    // eslint-disable-next-line
  }, [])

  return (
    <Container>
      <SectionTitleContainer>
        <SectionTitle>Outcome Targets</SectionTitle>
        {/* <AlphaSpan>Alpha Forecast</AlphaSpan> */}
      </SectionTitleContainer>

      {Targets.length > 0 &&
        Targets.map((Target: any, index) => (
          <OutcomeTarget
            key={index}
            type={`Target ${String.fromCharCode('A'.charCodeAt(0) + index)}`}
            announce={`${thousandSeparator(Target.targetMax, ',')} ${Target.goal}`}
            goal={Target.goal}
            submissionDate={Target.startDate}
            closeDate={Target.endDate}
            claimStats={getClaimStats(Target['@id'])}
          />
        ))}

      {/* <OutcomeTarget
        type={'Target B'}
        announce={'100,000,000 MwH of Clean Energy'}
        remain={0}
        proposedBy={'Shaun Conway'}
        submissionDate={'2020-04-01 10:00'}
        closeDate={'2020-04-21 10:00'}
        votes={230}
        available={280}
        myVote={true}
      /> */}

      {/* <SectionTitleContainer>
        <SectionTitle>Outcome Rewards</SectionTitle>
        <StyledButton>Settle</StyledButton>
      </SectionTitleContainer>
      <OutcomeTable /> */}
    </Container>
  )
}

export default Outcomes