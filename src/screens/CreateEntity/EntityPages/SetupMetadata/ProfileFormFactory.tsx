import { useCreateEntityState } from 'hooks/createEntity'
import { ClaimProfileForm } from 'screens/CreateEntity/Forms'
import { useCallback, useMemo } from 'react'
import { selectAllClaimProtocols, selectAllDeedProtocols } from 'redux/entities/entities.selectors'
import { useAppSelector } from 'redux/hooks'
import BaseProfileForm from './BaseProfileForm'
import { DeedProfileForm } from 'screens/CreateEntity/Forms/DeedProfileForm'

const ProfileFormBase = () => {
  const { updateProfile, profile } = useCreateEntityState()

  const handleUpdateProfile = useCallback(
    (key: string, value: any): void => {
      updateProfile({
        ...profile,
        [key]: value,
      })
    },
    [updateProfile, profile],
  )

  const setImage = useCallback((name: string) => handleUpdateProfile('image', name), [handleUpdateProfile])
  const setLogo = useCallback((name: string) => handleUpdateProfile('logo', name), [handleUpdateProfile])
  const setOrgName = useCallback((name: string) => handleUpdateProfile('orgName', name), [handleUpdateProfile])
  const setName = useCallback((name: string) => handleUpdateProfile('name', name), [handleUpdateProfile])

  return (
    <BaseProfileForm
      image={profile?.image}
      setImage={setImage}
      logo={profile?.logo}
      setLogo={setLogo}
      orgName={profile?.orgName ?? ''}
      setOrgName={setOrgName}
      name={profile?.name ?? ''}
      setName={setName}
    />
  )
}

const ProfileFormProtocolClaim = () => {
  const { updateProfile, profile } = useCreateEntityState()
  const claimProtocols = useAppSelector(selectAllClaimProtocols)

  const handleUpdateProfile = useCallback(
    (key: string, value: any): void => {
      updateProfile({
        ...profile,
        [key]: value,
      })
    },
    [updateProfile, profile],
  )

  const setImage = useCallback((name: string) => handleUpdateProfile('image', name), [handleUpdateProfile])
  const setType = useCallback((type: string) => handleUpdateProfile('category', type), [handleUpdateProfile])
  const setTitle = useCallback((name: string) => handleUpdateProfile('name', name), [handleUpdateProfile])

  const claimNameFound = useMemo(
    () => claimProtocols.some((entity) => entity.profile?.name === profile?.name),
    [claimProtocols, profile?.name],
  )

  return (
    <ClaimProfileForm
      image={profile?.image}
      setImage={setImage}
      type={profile?.category || ''}
      setType={setType}
      title={profile?.name || ''}
      setTitle={setTitle}
      description={profile?.description || ''}
      error={{
        title: profile?.name && claimNameFound ? 'Duplicated Name' : '',
      }}
    />
  )
}

const ProfileFormProtocolDeed = () => {
  const { updateProfile, profile } = useCreateEntityState()
  const deedProtocols = useAppSelector(selectAllDeedProtocols)

  const handleUpdateProfile = useCallback(
    (key: string, value: any): void => {
      updateProfile({
        ...profile,
        [key]: value,
      })
    },
    [updateProfile, profile],
  )

  const setImage = useCallback((name: string) => handleUpdateProfile('image', name), [handleUpdateProfile])
  const setType = useCallback((type: string) => handleUpdateProfile('category', type), [handleUpdateProfile])
  const setTitle = useCallback((name: string) => handleUpdateProfile('name', name), [handleUpdateProfile])

  const deedNameFound = useMemo(
    () => deedProtocols.some((entity) => entity.profile?.name === profile?.name),
    [deedProtocols, profile?.name],
  )

  return (
    <DeedProfileForm
      image={profile?.image}
      setImage={setImage}
      type={profile?.category || ''}
      setType={setType}
      title={profile?.name || ''}
      setTitle={setTitle}
      description={profile?.description || ''}
      error={{
        title: profile?.name && deedNameFound ? 'Duplicated Name' : '',
      }}
    />
  )
}

export const ProfileFormFactory = () => {
  const { entityType } = useCreateEntityState()

  switch (entityType) {
    case 'dao':
    case 'oracle':
    case 'investment':
    case 'project':
      return <ProfileFormBase />
    case 'protocol/claim':
      return <ProfileFormProtocolClaim />
    case 'protocol/deed':
      return <ProfileFormProtocolDeed />
    default:
      return <ProfileFormBase />
  }
}
