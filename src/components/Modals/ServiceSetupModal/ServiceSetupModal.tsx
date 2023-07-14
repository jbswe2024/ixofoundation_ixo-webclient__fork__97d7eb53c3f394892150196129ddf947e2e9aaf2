import React, { useState, useEffect } from 'react'
import * as Modal from 'react-modal'
import { ReactComponent as CloseIcon } from 'assets/images/icon-close.svg'
import { ModalStyles, CloseButton } from 'components/Modals/styles'
import { TEntityServiceModel } from 'types/protocol'
import { Button, InputWithLabel } from 'pages/CreateEntity/Components'
import { Typography } from 'components/Typography'
import { FlexBox, SvgBox } from 'components/App/App.styles'
import { ReactComponent as MinusBoxIcon } from 'assets/images/icon-minus-box.svg'
import { useTheme } from 'styled-components'
import { NodeType } from 'types/entities'

interface ServiceFormProps {
  index: number
  service: TEntityServiceModel
  onUpdate?: (service: TEntityServiceModel) => void
  onRemove?: () => void
}

const ServiceForm: React.FC<ServiceFormProps> = ({ index, service, onUpdate, onRemove }) => {
  const theme: any = useTheme()
  return (
    <FlexBox direction='column' gap={4} width='100%'>
      <FlexBox gap={4} alignItems='center'>
        <Typography size='xl'>Service {index ? index : ''}</Typography>
        {onRemove && (
          <SvgBox color={theme.ixoNewBlue} cursor='pointer' onClick={() => onRemove()}>
            <MinusBoxIcon />
          </SvgBox>
        )}
      </FlexBox>
      <FlexBox gap={4} width='100%'>
        <InputWithLabel
          label='Service ID'
          inputValue={service.id}
          handleChange={(value) => onUpdate && onUpdate({ ...service, id: value })}
          disabled={!onUpdate}
        />
      </FlexBox>
      <FlexBox width='100%'>
        <InputWithLabel
          label='Service Endpoint'
          inputValue={service.serviceEndpoint}
          handleChange={(value) => onUpdate && onUpdate({ ...service, serviceEndpoint: value })}
          disabled={!onUpdate}
        />
      </FlexBox>
    </FlexBox>
  )
}

interface Props {
  service: TEntityServiceModel[]
  open: boolean
  onClose: () => void
  onChange?: (services: TEntityServiceModel[]) => void
}

const ServiceSetupModal: React.FC<Props> = ({ service, open, onClose, onChange }): JSX.Element => {
  const [formData, setFormData] = useState<TEntityServiceModel[]>([])

  console.log({ formData })

  useEffect(() => {
    setFormData(service.map((v) => ({ ...v, id: v.id.replace('{id}#', '') })))
    return () => {
      setFormData([])
    }
  }, [service])

  const handleAddService = (): void => {
    if (onChange) {
      setFormData((v) => [
        ...v,
        {
          id: '',
          type: '',
          serviceEndpoint: '',
        },
      ])
    }
  }
  const handleUpdateService = (index: number, service: TEntityServiceModel): void =>
    onChange && setFormData((v) => v.map((origin, idx) => (index === idx ? service : origin)))
  const handleRemoveService = (index: number): void =>
    onChange && setFormData((v) => v.filter((v, idx) => idx !== index))

  const handleSubmit = (): void => {
    onChange && onChange(formData.map((v) => ({ ...v, id: `{id}#${v.id}` })))
    onClose()
  }
  return (
    // @ts-ignore
    <Modal style={ModalStyles} isOpen={open} onRequestClose={onClose} contentLabel='Modal' ariaHideApp={false}>
      <CloseButton onClick={onClose}>
        <CloseIcon />
      </CloseButton>

      <FlexBox direction='column' width='600px' gap={4}>
        <Typography size='xl'>Services</Typography>
        <FlexBox direction='column' gap={8} width='100%'>
          {formData.map((service, index) => (
            <ServiceForm
              key={index}
              index={index}
              service={service}
              {...(service.type === NodeType.Ipfs
                ? []
                : {
                    onUpdate: (service) => handleUpdateService(index, service),
                    onRemove: () => handleRemoveService(index),
                  })}
            />
          ))}
          <FlexBox>
            <Typography className='cursor-pointer' color={'blue'} onClick={handleAddService}>
              + Add another Service
            </Typography>
          </FlexBox>
        </FlexBox>
        <FlexBox justifyContent='flex-end' width='100%'>
          <Button onClick={handleSubmit}>Continue</Button>
        </FlexBox>
      </FlexBox>
    </Modal>
  )
}

export default ServiceSetupModal
