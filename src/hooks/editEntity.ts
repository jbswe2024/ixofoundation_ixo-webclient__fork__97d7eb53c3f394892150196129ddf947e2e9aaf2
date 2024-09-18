import { EncodeObject } from '@cosmjs/proto-signing'
import { ixo, utils } from '@ixo/impactxclient-sdk'
import { DeliverTxResponse } from '@ixo/impactxclient-sdk/node_modules/@cosmjs/stargate'
import {
  LinkedEntity,
  LinkedResource,
  Service,
  VerificationMethod,
} from '@ixo/impactxclient-sdk/types/codegen/ixo/iid/v1beta1/types'
import BigNumber from 'bignumber.js'
import { EntityLinkedResourceConfig } from 'constants/entity'
import {
  AddService,
  DeleteService,
  GetAddLinkedClaimMsgs,
  GetAddLinkedEntityMsgs,
  GetAddLinkedResourceMsgs,
  GetAddVerifcationMethodMsgs,
  GetDeleteLinkedClaimMsgs,
  GetDeleteLinkedEntityMsgs,
  GetDeleteLinkedResourceMsgs,
  GetDeleteVerifcationMethodMsgs,
  GetReplaceLinkedResourceMsgs,
  GetUpdateStartAndEndDateMsgs,
  TSigner,
  fee,
} from 'lib/protocol'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { setEditEntityAction, setEditedFieldAction } from 'redux/editEntity/editEntity.actions'
import { selectEditEntity } from 'redux/editEntity/editEntity.selectors'
import { getEntityById, selectAllClaimProtocols } from 'redux/entities/entities.selectors'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { NodeType, TDAOGroupModel, TEntityModel, TEntityPageModel } from 'types/entities'
import { LINKED_RESOURCE_TYPES_PREFIX, getLinkedResourceTypeFromPrefix } from 'utils/common'
import { LinkedResourceProofGenerator, LinkedResourceServiceEndpointGenerator } from 'utils/entities'
import { v4 as uuidv4 } from 'uuid'
import { useWallet } from 'wallet-connector'
import { useService } from './service'

export default function useEditEntity(): {
  editEntity: TEntityModel
  setEditedField: (key: string, value: any, merge?: boolean) => void
  setEditEntity: (editEntity: TEntityModel) => void
  ExecuteEditEntity: () => Promise<DeliverTxResponse>
} {
  const dispatch = useAppDispatch()
  const { execute, wallet } = useWallet()
  const { entityId = '' } = useParams<{ entityId: string }>()

  const _editEntity = useAppSelector(selectEditEntity)
  const editEntity = useMemo(() => {
    return {
      ..._editEntity,
      linkedResource: _editEntity?.linkedResource?.map((item) => ({
        ...item,
        display: item?.display ?? item?.type?.startsWith(LINKED_RESOURCE_TYPES_PREFIX),
        type: getLinkedResourceTypeFromPrefix(item?.type),
      })),
    }
  }, [_editEntity])

  const currentEntity = useAppSelector(getEntityById(entityId))
  const claimProtocols = useAppSelector(selectAllClaimProtocols)
  const services: Service[] = currentEntity.service

  const signer: TSigner = {
    address: wallet?.address || '',
    did: wallet?.did || '',
    pubKey: wallet?.pubKey || new Uint8Array(),
    keyType: 'secp',
  }

  const { SaveProfile, SaveAdministrator, SavePage, SaveTags, SaveQuestionJSON, SaveClaim, SaveTokenMetadata } =
    useService()

  const setEditedField = (key: string, value: any, merge = false) => {
    dispatch(setEditedFieldAction({ key, data: value, merge }))
  }

  const setEditEntity = (editEntity: TEntityModel) => {
    dispatch(setEditEntityAction(editEntity))
  }

  const extractServiceTypeFromEndpoint = (serviceEndpoint: string) => {
    if (serviceEndpoint.includes('://')) return null
    const [type] = serviceEndpoint.split(':')
    return type
  }

  const getUsedService = (serviceEndpoint = ''): Service => {
    console.log({ serviceEndpoint })
    console.log({ services })
    let service: Service | undefined = undefined
    if (serviceEndpoint) {
      const currentServiceType = extractServiceTypeFromEndpoint(serviceEndpoint)
      if (currentServiceType) {
        service = services.find((service) => service.id === `{id}#${currentServiceType}`)
      }
    }
    if (!service) {
      service = services.find((v) => v.type === NodeType.Ipfs)
    }
    if (!service) {
      throw new Error('Service Not Found')
    }
    return service
  }

  const getEditedStartAndEndDateMsgs = async (): Promise<readonly EncodeObject[]> => {
    if (
      JSON.stringify({ startDate: editEntity.startDate, endDate: editEntity.endDate }) ===
      JSON.stringify({ startDate: currentEntity.startDate, endDate: currentEntity.endDate })
    ) {
      return []
    }

    const messages: readonly EncodeObject[] = GetUpdateStartAndEndDateMsgs({
      id: editEntity.id,
      startDate: editEntity.startDate
        ? utils.proto.toTimestamp(new Date(editEntity.startDate as unknown as string))
        : undefined,
      endDate: editEntity.endDate
        ? utils.proto.toTimestamp(new Date(editEntity.endDate as unknown as string))
        : undefined,
      controllerDid: signer.did,
      controllerAddress: signer.address,
    })
    return messages
  }

  const getEditedProfileMsgs = async (): Promise<readonly EncodeObject[]> => {
    if (JSON.stringify(editEntity.profile) === JSON.stringify(currentEntity.profile)) {
      return []
    }

    const service = editEntity.settings?.Profile?.serviceEndpoint
      ? getUsedService(editEntity.settings.Profile?.serviceEndpoint)
      : {
          id: '{id}#ipfs',
          type: NodeType.Ipfs,
          serviceEndpoint: 'https://ipfs.io/ipfs',
        }

    const res = await SaveProfile(editEntity.profile, service)
    if (!res) {
      throw new Error('Save Profile failed!')
    }

    const newLinkedResource: LinkedResource = {
      id: '{id}#profile',
      type: 'Settings',
      description: 'Profile',
      mediaType: 'application/ld+json',
      serviceEndpoint: LinkedResourceServiceEndpointGenerator(res, service),
      proof: LinkedResourceProofGenerator(res, service),
      encrypted: 'false',
      right: '',
    }

    const messages: readonly EncodeObject[] = GetReplaceLinkedResourceMsgs(
      editEntity.id,
      signer,
      newLinkedResource,
      editEntity.settings?.Profile,
    )
    return messages
  }

  const getEditedTokenMsgs = async (): Promise<readonly EncodeObject[]> => {
    if (JSON.stringify(editEntity.token ?? {}) === JSON.stringify(currentEntity.token ?? {})) {
      return []
    }

    const service = getUsedService(editEntity.linkedResource.find((v) => v.type === 'TokenMetadata')?.serviceEndpoint)
    const res = await SaveTokenMetadata(editEntity.token, service)
    if (!res) {
      throw new Error('Save TokenMetadata failed!')
    }

    const newLinkedResource: LinkedResource = {
      id: '{id}#token',
      type: 'TokenMetadata',
      description: 'Impact Token',
      mediaType: 'application/ld+json',
      serviceEndpoint: LinkedResourceServiceEndpointGenerator(res, service),
      proof: LinkedResourceProofGenerator(res, service),
      encrypted: 'false',
      right: '',
    }

    const messages: readonly EncodeObject[] = GetReplaceLinkedResourceMsgs(
      editEntity.id,
      signer,
      newLinkedResource,
      currentEntity.linkedResource.find((v) => v.type === 'TokenMetadata'),
    )
    return messages
  }

  const getEditedSurveyTemplateMsgs = async (): Promise<readonly EncodeObject[]> => {
    if (JSON.stringify(editEntity.surveyTemplate) === JSON.stringify(currentEntity.surveyTemplate)) {
      return []
    }

    const service = getUsedService(editEntity.linkedResource.find((v) => v.type === 'surveyTemplate')?.serviceEndpoint)
    const res = await SaveQuestionJSON(editEntity.surveyTemplate, service)
    if (!res) {
      throw new Error('Save Survey Template failed!')
    }

    const newLinkedResource: LinkedResource = {
      id: '{id}#surveyTemplate',
      type: 'surveyTemplate',
      description: '',
      mediaType: 'application/ld+json',
      serviceEndpoint: LinkedResourceServiceEndpointGenerator(res, service),
      proof: LinkedResourceProofGenerator(res, service),
      encrypted: 'false',
      right: '',
    }

    const messages: readonly EncodeObject[] = GetReplaceLinkedResourceMsgs(
      editEntity.id,
      signer,
      newLinkedResource,
      currentEntity?.linkedResource?.find((v) => v.type === 'surveyTemplate'),
    )
    return messages
  }

  const getEditedCreatorMsgs = async (): Promise<readonly EncodeObject[]> => {
    if (JSON.stringify(editEntity.creator) === JSON.stringify(currentEntity.creator)) {
      return []
    }
    const service = getUsedService(editEntity.linkedResource.find((v) => v.id === `{id}#creator`)?.serviceEndpoint)
    const res = await SaveProfile(editEntity.creator, service)
    if (!res) {
      throw new Error('Save Creator failed!')
    }

    const newLinkedResource: LinkedResource = {
      id: '{id}#creator',
      type: 'VerifiableCredential',
      description: 'Creator',
      mediaType: 'application/ld+json',
      serviceEndpoint: LinkedResourceServiceEndpointGenerator(res, service),
      proof: LinkedResourceProofGenerator(res, service),
      encrypted: 'false',
      right: '',
    }

    const messages: readonly EncodeObject[] = GetReplaceLinkedResourceMsgs(
      editEntity.id,
      signer,
      newLinkedResource,
      editEntity?.linkedResource?.find((v) => v.id === '{id}#creator'),
    )
    return messages
  }

  const getEditedAdministratorMsgs = async (): Promise<readonly EncodeObject[]> => {
    if (JSON.stringify(editEntity.administrator) === JSON.stringify(currentEntity.administrator)) {
      return []
    }
    const service = getUsedService(
      editEntity.linkedResource.find((v) => v.id === `{id}#administrator`)?.serviceEndpoint,
    )
    const res = await SaveAdministrator(editEntity.administrator!, service)
    if (!res) {
      throw new Error('Save Administrator failed!')
    }

    const newLinkedResource: LinkedResource = {
      id: '{id}#administrator',
      type: 'VerifiableCredential',
      description: 'Administrator',
      mediaType: 'application/ld+json',
      serviceEndpoint: LinkedResourceServiceEndpointGenerator(res, service),
      proof: LinkedResourceProofGenerator(res, service),
      encrypted: 'false',
      right: '',
    }

    const messages: readonly EncodeObject[] = GetReplaceLinkedResourceMsgs(
      editEntity.id,
      signer,
      newLinkedResource,
      editEntity?.linkedResource?.find((v) => v.id === '{id}#administrator'),
    )
    return messages
  }

  const getEditedPageMsgs = async (): Promise<readonly EncodeObject[]> => {
    if (JSON.stringify(editEntity.page) === JSON.stringify(currentEntity.page)) {
      return []
    }
    const service = getUsedService(editEntity.settings.Page.serviceEndpoint)
    const res = await SavePage((editEntity.page ?? {}) as TEntityPageModel, service)
    if (!res) {
      throw new Error('Save Page Content failed!')
    }

    const newLinkedResource: LinkedResource = {
      id: '{id}#page',
      type: 'Settings',
      description: 'Page',
      mediaType: 'application/ld+json',
      serviceEndpoint: LinkedResourceServiceEndpointGenerator(res, service),
      proof: LinkedResourceProofGenerator(res, service),
      encrypted: 'false',
      right: '',
    }

    const messages: readonly EncodeObject[] = GetReplaceLinkedResourceMsgs(
      editEntity.id,
      signer,
      newLinkedResource,
      editEntity.settings.Page,
    )
    return messages
  }

  const getEditedTagsMsgs = async (): Promise<readonly EncodeObject[]> => {
    if (JSON.stringify(editEntity.tags) === JSON.stringify(currentEntity.tags)) {
      return []
    }
    const service = getUsedService(editEntity.settings.Tags.serviceEndpoint)
    const res = await SaveTags(editEntity.tags ?? [], service)
    if (!res) {
      throw new Error('Save Tags failed!')
    }

    const newLinkedResource: LinkedResource = {
      id: '{id}#tags',
      type: 'Settings',
      description: 'Tags',
      mediaType: 'application/ld+json',
      serviceEndpoint: LinkedResourceServiceEndpointGenerator(res, service),
      proof: LinkedResourceProofGenerator(res, service),
      encrypted: 'false',
      right: '',
    }

    const messages: readonly EncodeObject[] = GetReplaceLinkedResourceMsgs(
      editEntity.id,
      signer,
      newLinkedResource,
      editEntity.settings.Tags,
    )
    return messages
  }

  const getEditedLinkedFilesMsgs = async (): Promise<readonly EncodeObject[]> => {
    const editedLinkedFiles = editEntity.linkedResource.reduce((acc: LinkedResource[], cur: LinkedResource) => {
      if (Object.keys(EntityLinkedResourceConfig).includes(cur.type)) {
        cur.type = cur.display ? `${LINKED_RESOURCE_TYPES_PREFIX}${cur.type}` : cur.type
        // delete cur.display
        acc.push(cur)
      }
      return acc
    }, [])
    const currentLinkedFiles = currentEntity.linkedResource.filter((item: LinkedResource) =>
      Object.keys(EntityLinkedResourceConfig).includes(getLinkedResourceTypeFromPrefix(item.type)),
    )
    if (JSON.stringify(editedLinkedFiles) === JSON.stringify(currentLinkedFiles)) {
      return []
    }

    const diffLinkedFiles = [
      ...editedLinkedFiles.filter(
        (item: LinkedResource) =>
          !currentLinkedFiles.map((item: LinkedResource) => JSON.stringify(item)).includes(JSON.stringify(item)),
      ),
      ...currentLinkedFiles
        .filter(
          (item: LinkedResource) =>
            !editedLinkedFiles.map((item: LinkedResource) => JSON.stringify(item)).includes(JSON.stringify(item)),
        )
        .filter((item: LinkedResource) => !editedLinkedFiles.some((v) => v.id === item.id)),
    ]

    const messages: readonly EncodeObject[] = diffLinkedFiles.reduce((acc: EncodeObject[], cur: LinkedResource) => {
      const isInCurrent = currentLinkedFiles.some((item: LinkedResource) => item.id === cur.id)
      const isInEdited = editedLinkedFiles.some((item: LinkedResource) => item.id === cur.id)

      if (isInCurrent) {
        // If the resource is in both current and edited, replace it.
        if (isInEdited) {
          const editedResource = editEntity.linkedResource.find((v) => v.id === cur.id)
          const message = GetReplaceLinkedResourceMsgs(editEntity.id, signer, cur, editedResource)
          return [...acc, ...message]
        } else {
          // If it's in current but not in edited, delete it.
          const message = GetDeleteLinkedResourceMsgs(editEntity.id, signer, cur)
          return [...acc, ...message]
        }
      } else {
        // If it's not in current, it's a new resource, so add it.
        const message = GetAddLinkedResourceMsgs(editEntity.id, signer, cur)
        return [...acc, ...message]
      }
    }, [])

    return messages
  }

  const getEditedGroupsMsgs = async (): Promise<readonly EncodeObject[]> => {
    const editedGroups = Object.values(editEntity.daoGroups ?? {})
    const currentGroups = Object.values(currentEntity.daoGroups ?? {})
    if (JSON.stringify(editedGroups) === JSON.stringify(currentGroups)) {
      return []
    }

    const addedGroups = editedGroups.filter(
      (item: TDAOGroupModel) =>
        !currentGroups.map((item: TDAOGroupModel) => JSON.stringify(item)).includes(JSON.stringify(item)),
    )

    const deletedGroups = currentGroups.filter(
      (item: TDAOGroupModel) =>
        !editedGroups.map((item: TDAOGroupModel) => JSON.stringify(item)).includes(JSON.stringify(item)),
    )

    const messages: readonly EncodeObject[] = [
      ...addedGroups.reduce(
        (acc: EncodeObject[], cur: TDAOGroupModel) => [
          ...acc,
          ...GetAddLinkedEntityMsgs(
            editEntity.id,
            signer,
            ixo.iid.v1beta1.LinkedEntity.fromPartial({
              id: `{id}#${cur.coreAddress}`,
              type: 'Group',
              relationship: 'subsidiary',
              service: '',
            }),
          ),
        ],
        [],
      ),
      ...deletedGroups.reduce(
        (acc: EncodeObject[], cur: TDAOGroupModel) => [
          ...acc,
          ...GetDeleteLinkedEntityMsgs(
            editEntity.id,
            signer,
            ixo.iid.v1beta1.LinkedEntity.fromPartial({
              id: `{id}#${cur.coreAddress}`,
              type: 'Group',
              relationship: 'subsidiary',
              service: '',
            }),
          ),
        ],
        [],
      ),
    ]

    return messages
  }

  const getEditedLinkedEntityMsgs = async (): Promise<readonly EncodeObject[]> => {
    const editedLinkedEntity = editEntity.linkedEntity
    const currentLinkedEntity = currentEntity.linkedEntity
    if (JSON.stringify(editedLinkedEntity) === JSON.stringify(currentLinkedEntity)) {
      return []
    }

    const addedLinkedEntity = editedLinkedEntity.filter(
      (item: LinkedEntity) =>
        !currentLinkedEntity.map((item: LinkedEntity) => JSON.stringify(item)).includes(JSON.stringify(item)),
    )

    const deletedLinkedEntity = currentLinkedEntity.filter(
      (item: LinkedEntity) =>
        !editedLinkedEntity.map((item: LinkedEntity) => JSON.stringify(item)).includes(JSON.stringify(item)),
    )

    const messages: readonly EncodeObject[] = [
      ...addedLinkedEntity.reduce(
        (acc: EncodeObject[], cur: LinkedEntity) => [
          ...acc,
          ...GetAddLinkedEntityMsgs(editEntity.id, signer, ixo.iid.v1beta1.LinkedEntity.fromPartial(cur)),
        ],
        [],
      ),
      ...deletedLinkedEntity.reduce(
        (acc: EncodeObject[], cur: LinkedEntity) => [
          ...acc,
          ...GetDeleteLinkedEntityMsgs(editEntity.id, signer, ixo.iid.v1beta1.LinkedEntity.fromPartial(cur)),
        ],
        [],
      ),
    ]

    return messages
  }

  const getEditedLinkedClaimMsgs = async (): Promise<readonly EncodeObject[]> => {
    const editedLinkedClaim = editEntity.claim
    const currentLinkedClaim = currentEntity.claim
    if (JSON.stringify(editedLinkedClaim) === JSON.stringify(currentLinkedClaim)) {
      return []
    }

    let messages: readonly EncodeObject[] = []

    const service = getUsedService(editEntity.linkedClaim[0]?.serviceEndpoint)

    await Promise.all(
      Object.values(editEntity.claim ?? {})
        .map(async (claim) => {
          if (!Object.values(currentEntity.claim ?? {}).some((v) => JSON.stringify(v) === JSON.stringify(claim))) {
            // add
            const res = await SaveClaim(claim, service)
            if (!res) {
              return false
            }

            const claimProtocol = claimProtocols.find((protocol) => claim.template?.id.includes(protocol.id))
            const linkedClaim = {
              type: claimProtocol?.profile?.category || '',
              id: `{id}#${uuidv4()}`,
              description: claimProtocol?.profile?.description || '',
              serviceEndpoint: LinkedResourceServiceEndpointGenerator(res, service),
              proof: LinkedResourceProofGenerator(res, service),
              encrypted: 'false',
              right: '',
            }
            messages = [...messages, ...GetAddLinkedClaimMsgs(editEntity.id, signer, linkedClaim)]
          }
          return true
        })
        .filter(Boolean),
    )

    await Promise.all(
      Object.values(currentEntity.claim ?? {}).map(async (claim: any) => {
        if (!Object.values(editEntity.claim ?? {}).some((v) => JSON.stringify(v) === JSON.stringify(claim))) {
          // remove
          messages = [...messages, ...GetDeleteLinkedClaimMsgs(editEntity.id, signer, claim.linkedClaimId)]
        }
        return true
      }),
    )

    return messages
  }

  const getEditedVerificationMethodMsgs = async (): Promise<readonly EncodeObject[]> => {
    if (JSON.stringify(editEntity.verificationMethod) === JSON.stringify(currentEntity.verificationMethod)) {
      return []
    }

    const addedVerificationMethods = editEntity.verificationMethod.filter(
      (item: VerificationMethod) =>
        !currentEntity.verificationMethod
          .map((item: VerificationMethod) => JSON.stringify(item))
          .includes(JSON.stringify(item)),
    )

    const deletedVerificationMethods = currentEntity.verificationMethod.filter(
      (item: VerificationMethod) =>
        !editEntity.verificationMethod
          .map((item: VerificationMethod) => JSON.stringify(item))
          .includes(JSON.stringify(item)),
    )

    const messages: readonly EncodeObject[] = [
      ...addedVerificationMethods.reduce(
        (acc: EncodeObject[], cur: VerificationMethod) => [
          ...acc,
          ...GetAddVerifcationMethodMsgs(
            editEntity.id,
            signer,
            ixo.iid.v1beta1.Verification.fromPartial({
              relationships: ['authentication'],
              method: ixo.iid.v1beta1.VerificationMethod.fromPartial(cur),
            }),
          ),
        ],
        [],
      ),
      ...deletedVerificationMethods.reduce(
        (acc: EncodeObject[], cur: VerificationMethod) => [
          ...acc,
          ...GetDeleteVerifcationMethodMsgs(
            editEntity.id,
            signer,
            ixo.iid.v1beta1.Verification.fromPartial({
              relationships: ['authentication'],
              method: ixo.iid.v1beta1.VerificationMethod.fromPartial(cur),
            }),
          ),
        ],
        [],
      ),
    ]

    return messages
  }

  const getEditedServiceMsgs = async (): Promise<readonly EncodeObject[]> => {
    const editedServices = editEntity.service
    const currentServices = currentEntity.service
    if (JSON.stringify(editedServices) === JSON.stringify(currentServices)) {
      return []
    }

    const addedServices = editedServices.filter(
      (item: Service) => !currentServices.map((item: Service) => JSON.stringify(item)).includes(JSON.stringify(item)),
    )

    const deletedServices = currentServices.filter(
      (item: Service) => !editedServices.map((item: Service) => JSON.stringify(item)).includes(JSON.stringify(item)),
    )

    const messages = [
      ...addedServices.reduce(
        (acc: EncodeObject[], cur: Service) => [
          ...acc,
          ...AddService(signer, { entityId: editEntity.id, service: cur }),
        ],
        [],
      ),
      ...deletedServices.reduce(
        (acc: EncodeObject[], cur: Service) => [
          ...acc,
          ...DeleteService(signer, { entityId: editEntity.id, serviceId: cur.id }),
        ],
        [],
      ),
    ]

    return messages
  }

  const getEditedMsgs = async (): Promise<readonly EncodeObject[]> => {
    return [
      ...(await getEditedStartAndEndDateMsgs()),
      ...(await getEditedProfileMsgs()),
      ...(await getEditedTokenMsgs()),
      ...(await getEditedAdministratorMsgs()),
      ...(await getEditedPageMsgs()),
      ...(await getEditedTagsMsgs()),
      ...(await getEditedLinkedFilesMsgs()),
      ...(await getEditedGroupsMsgs()),
      ...(await getEditedLinkedEntityMsgs()),
      ...(await getEditedLinkedClaimMsgs()),
      ...(await getEditedVerificationMethodMsgs()),
      ...(await getEditedSurveyTemplateMsgs()),
      ...(await getEditedServiceMsgs()),
      ...(await getEditedCreatorMsgs()),
    ]
  }

  const ExecuteEditEntity = async (): Promise<DeliverTxResponse> => {
    const messages = await getEditedMsgs()

    if (messages.length === 0) {
      throw new Error('Nothing to update')
    }

    const updatedFee = { ...fee, gas: new BigNumber(fee.gas).times(messages.length).toString() }
    const response = await execute({
      data: { messages: messages as any, fee: updatedFee, memo: undefined },
      transactionConfig: { sequence: 1 },
    })

    if (typeof response === 'string') {
      throw Error('Connect your wallet')
    }

    return response
  }

  return {
    editEntity,
    setEditedField,
    setEditEntity,
    ExecuteEditEntity,
  }
}