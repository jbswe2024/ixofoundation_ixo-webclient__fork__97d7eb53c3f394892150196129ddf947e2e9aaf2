import { FlexBox } from 'components/App/App.styles'
import { Typography } from 'components/Typography'
import { deviceWidth } from 'constants/device'
import { useCreateEntityState } from 'hooks/createEntity'
import { Button } from 'pages/CreateEntity/Components'
import React, { useMemo } from 'react'
import { SetupActionsForm } from './SetupActionsForm'
import { useNavigate, useParams } from 'react-router-dom'

const SetupActions: React.FC = () => {
  const navigate = useNavigate()
  const { entityId, coreAddress } = useParams<{ entityId: string; coreAddress: string }>()
  const { proposal, updateProposal } = useCreateEntityState()

  const actions = useMemo(() => proposal?.actions ?? [], [proposal])
  const validActions = useMemo(() => actions.filter((item) => item.data), [actions])

  const handleBack = () => {
    navigate(`/entity/${entityId}/dashboard/governance/${coreAddress}/info`)
  }
  const handleContinue = () => {
    navigate(`/entity/${entityId}/dashboard/governance/${coreAddress}/review`)
  }

  return (
    <FlexBox width={'100%'} $justifyContent='center'>
      <FlexBox $direction='column' $gap={15} width={deviceWidth.tablet + 'px'}>
        <FlexBox>
          <Typography variant='secondary' size='2xl'>
            The following {validActions.length} actions get executed when the proposal passes.
          </Typography>
        </FlexBox>

        <SetupActionsForm actions={actions} setActions={(actions) => updateProposal({ ...proposal, actions })} />

        <FlexBox width='100%' $justifyContent='flex-end' $gap={4}>
          <Button variant='secondary' onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleContinue}>Continue</Button>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  )
}

export default SetupActions