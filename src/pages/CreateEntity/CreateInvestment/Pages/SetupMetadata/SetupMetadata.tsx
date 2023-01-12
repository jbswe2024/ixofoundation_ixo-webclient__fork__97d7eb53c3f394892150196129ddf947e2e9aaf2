import { Box } from 'components/App/App.styles'
import React, { useMemo, useState } from 'react'
import { useCreateEntityState } from 'hooks/createEntity'
import { Button } from '../../../Components'
import {
  LocalisationForm,
  InvestmentBasicInfoCardForm,
  ProtocolAttributesForm,
  ProtocolDescriptionForm,
  ProtocolMetricsForm,
} from '../../../Forms'
import { PageWrapper } from './SetupMetadata.styles'
import { Typography } from 'components/Typography'
import { TInvestmentMetadataModel } from 'types/protocol'

const SetupMetadata: React.FC = (): JSX.Element => {
  const { metadata, localisation, gotoStep, updateMetadata, updateLocalisation } = useCreateEntityState()

  const [metaView, setMetaView] = useState<'description' | 'metrics' | 'attributes'>('description')

  const canSubmit = useMemo(
    () =>
      (metadata as TInvestmentMetadataModel)?.image &&
      (metadata as TInvestmentMetadataModel)?.icon &&
      (metadata as TInvestmentMetadataModel)?.orgName &&
      (metadata as TInvestmentMetadataModel)?.name,
    [metadata],
  )

  const handlePrev = (): void => {
    gotoStep(-1)
  }
  const handleNext = (): void => {
    gotoStep(1)
  }

  const handleUpdateMetadata = (key: string, value: any): void => {
    updateMetadata({
      ...metadata,
      [key]: value,
    })
  }

  const renderTabs = (): JSX.Element => (
    <Box className='d-flex mb-2' style={{ gap: 20, cursor: 'pointer', height: 32 }}>
      <Typography
        weight='medium'
        size='xl'
        color={metaView === 'description' ? 'blue' : 'color-1'}
        onClick={(): void => setMetaView('description')}
      >
        Description
      </Typography>
      <Typography
        weight='medium'
        size='xl'
        color={metaView === 'metrics' ? 'blue' : 'color-1'}
        onClick={(): void => setMetaView('metrics')}
      >
        Metrics
      </Typography>
      <Typography
        weight='medium'
        size='xl'
        color={metaView === 'attributes' ? 'blue' : 'color-1'}
        onClick={(): void => setMetaView('attributes')}
      >
        Attributes
      </Typography>
    </Box>
  )
  return (
    <PageWrapper>
      <Box className='d-flex flex-column'>
        <Box className='d-flex align-items-center justify-content-between'>
          <Typography weight='medium' size='xl'>
            Localisation:
          </Typography>
          <LocalisationForm localisation={localisation} setLocalisation={updateLocalisation} />
        </Box>
        <Box className='mb-2' />
        <InvestmentBasicInfoCardForm
          image={(metadata as TInvestmentMetadataModel)?.image}
          setImage={(image: string): void => handleUpdateMetadata('image', image)}
          orgName={(metadata as TInvestmentMetadataModel)?.orgName}
          setOrgName={(orgName: string): void => handleUpdateMetadata('orgName', orgName)}
          icon={(metadata as TInvestmentMetadataModel)?.icon}
          setIcon={(icon: string): void => handleUpdateMetadata('icon', icon)}
          name={(metadata as TInvestmentMetadataModel)?.name}
          setName={(name: string): void => handleUpdateMetadata('name', name)}
        />
      </Box>
      <Box className='d-flex flex-column' style={{ width: 400 }}>
        {renderTabs()}
        <Box style={{ flex: '1 auto' }}>
          {metaView === 'description' && (
            <ProtocolDescriptionForm
              description={(metadata as TInvestmentMetadataModel)?.description}
              setDescription={(description: string): void => handleUpdateMetadata('description', description)}
              brandName={(metadata as TInvestmentMetadataModel)?.brandName}
              setBrandName={(brandName: string): void => handleUpdateMetadata('brandName', brandName)}
              country={(metadata as TInvestmentMetadataModel)?.country}
              setCountry={(country: string): void => handleUpdateMetadata('country', country)}
              startDate={(metadata as TInvestmentMetadataModel)?.startDate}
              endDate={(metadata as TInvestmentMetadataModel)?.endDate}
              setStartEndDate={(startDate, endDate) => {
                updateMetadata({
                  ...metadata,
                  startDate,
                  endDate,
                } as TInvestmentMetadataModel)
              }}
            />
          )}
          {metaView === 'metrics' && (
            <ProtocolMetricsForm
              metrics={(metadata as TInvestmentMetadataModel)?.metrics}
              setMetrics={(
                metrics: {
                  name?: string
                  prefix?: string
                  suffix?: string
                  source?: string
                }[],
              ): void => handleUpdateMetadata('metrics', metrics)}
            />
          )}
          {metaView === 'attributes' && (
            <ProtocolAttributesForm
              attributes={(metadata as TInvestmentMetadataModel)?.attributes ?? []}
              setAttributes={(attributes: { key: string; value: string }[]): void =>
                handleUpdateMetadata('attributes', attributes)
              }
            />
          )}
        </Box>

        <Box className='d-flex justify-content-end w-100' style={{ gap: 20 }}>
          <Button className='w-100' variant='secondary' onClick={handlePrev}>
            Back
          </Button>
          <Button className='w-100' variant={'primary'} disabled={!canSubmit} onClick={handleNext}>
            Continue
          </Button>
        </Box>
      </Box>
    </PageWrapper>
  )
}

export default SetupMetadata
