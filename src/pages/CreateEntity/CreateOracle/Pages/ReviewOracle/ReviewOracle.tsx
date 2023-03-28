import { Verification } from '@ixo/impactxclient-sdk/types/codegen/ixo/iid/v1beta1/tx'
import { AccordedRight, LinkedResource } from '@ixo/impactxclient-sdk/types/codegen/ixo/iid/v1beta1/types'
import { FlexBox } from 'components/App/App.styles'
import { Typography } from 'components/Typography'
import { deviceWidth } from 'constants/device'
import { useCreateEntity, useCreateEntityState } from 'hooks/createEntity'
import { Button } from 'pages/CreateEntity/Components'
import React, { useState } from 'react'
import { TOracleMetadataModel } from 'types/protocol'
import * as Toast from 'utils/toast'
import OracleCard from './OracleCard'

const ReviewOracle: React.FC = (): JSX.Element => {
  const createEntityState = useCreateEntityState()
  const metadata: TOracleMetadataModel = createEntityState.metadata as TOracleMetadataModel
  const { service, linkedEntity, gotoStep } = createEntityState
  const { SaveProfile, SaveCreator, SaveAdministrator, SavePage, SaveTags, CreateProtocol, CreateEntityBase } =
    useCreateEntity()
  const [submitting, setSubmitting] = useState(false)

  const handleSignToCreate = async (): Promise<void> => {
    setSubmitting(true)
    // const daoDid = 'did:ixo:entity:cf16fe551153ec5a1b96be3f59b2ec98'
    // const daoDid = await CreateDAO()
    // if (!daoDid) {
    //   Toast.errorToast(`Create DAO Failed`)
    //   return
    // } else {
    //   Toast.successToast(`Create DAO Succeed`)
    // }

    const daoCredsIssuerDid = 'did:ixo:entity:c4a5588bdd7f651f5f5e742887709d57'
    // const daoCredsIssuerDid = await CreateDAOCredsIssuer(daoDid)
    // if (!daoCredsIssuerDid) {
    //   Toast.errorToast(`Create DAO Creds Issuer Failed`)
    //   return
    // } else {
    //   Toast.successToast(`Create DAO Creds Issuer Succeed`)
    // }

    const [saveProfileRes, saveCreatorRes, saveAdministratorRes, savePageRes, saveTagsRes] = await Promise.allSettled([
      await SaveProfile(),
      await SaveCreator(daoCredsIssuerDid),
      await SaveAdministrator(daoCredsIssuerDid),
      await SavePage(),
      await SaveTags(),
    ]).then((responses) => responses.map((response: any) => response.value))

    const linkedResource: LinkedResource[] = []
    const accordedRight: AccordedRight[] = [] // TODO:
    const verification: Verification[] = []

    if (saveProfileRes) {
      linkedResource.push({
        id: '{id}#profile',
        type: 'Settings',
        description: 'Profile',
        mediaType: 'application/ld+json',
        serviceEndpoint: saveProfileRes.url,
        proof: saveProfileRes.cid,
        encrypted: 'false',
        right: '',
      })
    }
    if (saveCreatorRes) {
      linkedResource.push({
        id: '{id}#creator',
        type: 'VerifiableCredential',
        description: 'Creator',
        mediaType: 'application/ld+json',
        serviceEndpoint: `#cellnode-pandora/public/${saveCreatorRes.key}`,
        proof: saveCreatorRes.key,
        encrypted: 'false',
        right: '',
      })
    }
    if (saveAdministratorRes) {
      linkedResource.push({
        id: '{id}#administrator',
        type: 'VerifiableCredential',
        description: 'Administrator',
        mediaType: 'application/ld+json',
        serviceEndpoint: `#cellnode-pandora/public/${saveAdministratorRes.key}`,
        proof: saveAdministratorRes.key,
        encrypted: 'false',
        right: '',
      })
    }
    if (savePageRes) {
      linkedResource.push({
        id: '{id}#page',
        type: 'Settings',
        description: 'Page',
        mediaType: 'application/ld+json',
        serviceEndpoint: `#cellnode-pandora/public/${savePageRes.key}`,
        proof: savePageRes.key,
        encrypted: 'false',
        right: '',
      })
    }
    if (saveTagsRes) {
      linkedResource.push({
        id: '{id}#tags',
        type: 'Settings',
        description: 'Tags',
        mediaType: 'application/ld+json',
        serviceEndpoint: `#cellnode-pandora/public/${saveTagsRes.key}`,
        proof: saveTagsRes.key,
        encrypted: 'false',
        right: '',
      })
    }

    const protocolDid = await CreateProtocol()
    if (!protocolDid) {
      Toast.errorToast(`Create Entity Protocol Failed`)
      setSubmitting(false)
      return
    }
    const entityDid = await CreateEntityBase('oracle', protocolDid, {
      service,
      linkedResource,
      accordedRight,
      linkedEntity: Object.values(linkedEntity),
      verification,
    })
    if (entityDid) {
      Toast.successToast(`Create Entity Succeed`)
    } else {
      Toast.errorToast(`Create Entity Failed`)
    }
    setSubmitting(false)
  }

  return (
    <FlexBox width={`${deviceWidth.tablet}px`} gap={10} alignItems='stretch'>
      <OracleCard image={metadata?.image ?? ''} name={metadata?.name ?? ''} />
      <FlexBox direction='column' justifyContent='space-between' width='100%' style={{ flex: 1 }}>
        <FlexBox direction='column' width='100%' gap={4}>
          <Typography variant='secondary'>
            This is the last step before creating this Oracle on the ixo Blockchain.
          </Typography>
          <Typography variant='secondary'>
            <Typography variant='secondary' color='blue'>
              Review the Oracle details
            </Typography>{' '}
            you have configured.
          </Typography>
          <Typography variant='secondary'>
            <Typography variant='secondary' color='blue'>
              Confirm the Headline Metric
            </Typography>{' '}
            that will be displayed on the Oracle card.
          </Typography>
          <Typography variant='secondary'>
            When you are ready to commit, sign with your DID Account keys, or{' '}
            <Typography variant='secondary' color='blue'>
              connect a different account
            </Typography>{' '}
            as the Oracle Creator.
          </Typography>
        </FlexBox>
        <FlexBox width='100%' gap={4}>
          <Button variant='secondary' onClick={(): void => gotoStep(-1)} style={{ width: '100%' }}>
            Back
          </Button>
          <Button variant='primary' onClick={handleSignToCreate} style={{ width: '100%' }} loading={submitting}>
            Sign To Create
          </Button>
        </FlexBox>
      </FlexBox>
    </FlexBox>
  )
}

export default ReviewOracle