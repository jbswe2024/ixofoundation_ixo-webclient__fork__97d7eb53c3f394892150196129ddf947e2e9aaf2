import { ixo, utils } from '@ixo/impactxclient-sdk'
import { Payments } from '@ixo/impactxclient-sdk/types/codegen/ixo/claims/v1beta1/claims'
import { LinkedEntity } from '@ixo/impactxclient-sdk/types/codegen/ixo/iid/v1beta1/types'
import { CreateEntityMessage } from 'lib/protocol'
import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { successToast } from 'utils/toast'
import ClaimCollectionCreationPaymentStep from './Payment'
import ClaimCollectionCreationReviewStep from './Review'
import ClaimCollectionCreationScopeStep from './Scope'
import ClaimCollectionCreationSelectStep from './Select'
import ClaimCollectionCreationSubmissionStep from './Submission'
import ClaimCollections from '../ClaimCollections'
import ClaimCollectionCreationSuccessStep from './Success'
import { useGetUserGranteeRole } from 'hooks/claim'
import { AgentRoles } from 'types/models'
import { useGetEntityByIdLazyQuery } from 'graphql/entities'
import { useWallet } from 'wallet-connector'
import { DeliverTxResponse } from '@cosmjs/stargate'
import { useAppSelector } from 'redux/hooks'
import { getEntityById } from 'redux/entities/entities.selectors'
import { useCreateClaimCollection } from 'hooks/claims/useCreateClaimCollection'

const ClaimCollectionCreation: React.FC = () => {
  const { entityId = '' } = useParams<{ entityId: string }>()
  const { type, claim: claims = {}, accounts, owner, verificationMethod } = useAppSelector(getEntityById(entityId))
  const { execute, wallet, close } = useWallet()
  const userRole = useGetUserGranteeRole(wallet?.address ?? '', owner, accounts, verificationMethod)
  const { fetchEntityById } = useGetEntityByIdLazyQuery()
  const createCollection = useCreateClaimCollection()

  const [step, setStep] = useState<'start' | 'select' | 'scope' | 'payment' | 'submission' | 'review' | 'success'>(
    'start',
  )
  const [data, setData] = useState<{
    claimId: string
    startDate: string
    endDate: string
    quota: string
    protocolDeedId: string
    payments: Payments | undefined
  }>({
    claimId: '',
    startDate: '',
    endDate: '',
    quota: '',
    protocolDeedId: '',
    payments: {},
  })
  const claim = useMemo(() => claims[data.claimId], [claims, data.claimId])
  const [loading, setLoading] = useState(false)

  async function CreateDeedOffer(collectionId: string | number) {
    if (!data.protocolDeedId || !collectionId) {
      // eslint-disable-next-line no-throw-literal
      throw 'Invalid parameters'
    }
    const linkedEntity: LinkedEntity[] = [
      ixo.iid.v1beta1.LinkedEntity.fromPartial({
        id: String(collectionId),
        type: 'ClaimCollection',
        service: 'ixo',
        relationship: 'submission',
      }),
      ixo.iid.v1beta1.LinkedEntity.fromPartial({
        id: entityId,
        type: type,
        service: 'ixo',
        relationship: 'offers',
      }),
    ]

    if (!wallet) throw Error('Please connect wallet')

    const entityMessage = await CreateEntityMessage(
      { pubKey: wallet.pubKey, address: wallet.address, keyType: 'secp', did: wallet.did },
      [
        {
          entityType: 'deed/offer',
          linkedEntity,
          context: [{ key: 'class', val: data.protocolDeedId }],
        },
      ],
    )

    const response = (await execute({
      data: entityMessage,
      transactionConfig: { sequence: 1 },
    })) as unknown as DeliverTxResponse
    if (response.code !== 0) {
      throw response.rawLog
    }
    const did = utils.common.getValueFromEvents(response, 'wasm', 'token_id')
    return did
  }

  async function handleSignToCreate() {
    try {
      setLoading(true)
      if (!entityId || !claim.template?.id) {
        // eslint-disable-next-line no-throw-literal
        throw 'Invalid Property'
      }
      const payload = {
        entity: {
          id: entityId,
          owner: owner,
        },
        payload: {
          protocol: claim.template?.id.split('#')[0],
          startDate: data.startDate,
          endDate: data.endDate,
          quota: data.quota || '0',
          payments: data.payments,
        },
      }

      const response = (await createCollection(payload)) as unknown as DeliverTxResponse

      if (response.code) {
        throw response.rawLog
      }
      successToast(null, 'Collection successfully created!')
      const collectionId = utils.common.getValueFromEvents(
        response,
        'ixo.claims.v1beta1.CollectionCreatedEvent',
        'collection',
        (c) => c.id,
      )

      const deedOfferDid = await CreateDeedOffer(collectionId)
      if (deedOfferDid) {
        fetchEntityById(deedOfferDid)
      }

      close()
      successToast(null, 'Offer successfully created!')
      setStep('success')
    } catch (e) {
      console.error(e)
      // errorToast(e)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'start') {
    return <ClaimCollections canCreate={userRole === AgentRoles.owners} onCreate={() => setStep('select')} />
  }

  return (
    <>
      <ClaimCollectionCreationSelectStep
        hidden={step !== 'select'}
        onSubmit={(claimId) => {
          setData((p) => ({ ...p, claimId }))
          setStep('scope')
        }}
        onCancel={() => setStep('start')}
        claims={claims}
      />
      <ClaimCollectionCreationScopeStep
        hidden={step !== 'scope'}
        onSubmit={(data) => {
          setData((p) => ({ ...p, ...data }))
          setStep('payment')
        }}
        onCancel={() => setStep('select')}
      />
      <ClaimCollectionCreationPaymentStep
        hidden={step !== 'payment'}
        onSubmit={(payments: Payments) => {
          setData((p) => ({ ...p, payments }))
          setStep('submission')
        }}
        onCancel={() => setStep('scope')}
      />
      <ClaimCollectionCreationSubmissionStep
        hidden={step !== 'submission'}
        onSubmit={(protocolDeedId) => {
          setData((p) => ({ ...p, protocolDeedId }))
          setStep('review')
        }}
        onCancel={() => setStep('payment')}
      />
      <ClaimCollectionCreationReviewStep
        data={data}
        hidden={step !== 'review'}
        onSubmit={handleSignToCreate}
        onCancel={() => setStep('submission')}
        loading={loading}
      />
      <ClaimCollectionCreationSuccessStep hidden={step !== 'success'} onSubmit={() => setStep('start')} />
    </>
  )
}

export default ClaimCollectionCreation
