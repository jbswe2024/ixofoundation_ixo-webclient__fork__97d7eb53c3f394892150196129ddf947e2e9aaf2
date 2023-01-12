import React from 'react'
import { FormWrapper, FormHeader, FormBody, FormRow } from './InvestmentBasicInfoCardForm.styles'
import { HeadlineMetric, IconUpload, ImageUpload, InputWithLabel } from '../Components'
import { Typography } from 'components/Typography'

interface Props {
  image: string | undefined
  setImage?: (image: string) => void
  icon: string | undefined
  setIcon?: (icon: string) => void
  orgName: string | undefined
  setOrgName?: (name: string) => void
  name: string | undefined
  setName?: (name: string) => void
}

const InvestmentBasicInfoCardForm: React.FC<Props> = ({
  image,
  setImage,
  orgName,
  setOrgName,
  icon,
  setIcon,
  name,
  setName,
  ...rest
}): JSX.Element => {
  return (
    <FormWrapper {...rest}>
      <FormHeader>
        <ImageUpload
          image={image}
          handleChange={(value: string): void => {
            setImage && setImage(value)
          }}
        />
      </FormHeader>

      <FormBody>
        <FormRow style={{ justifyContent: 'flex-end' }}>
          <IconUpload
            icon={icon}
            placeholder='Brand Icon'
            handleChange={(value: string): void => {
              setIcon && setIcon(value)
            }}
          />
        </FormRow>

        <FormRow>
          {setOrgName ? (
            <InputWithLabel label='Organisation Name' inputValue={orgName} handleChange={setOrgName} />
          ) : (
            <Typography color='gray-medium' size='xl' weight='bold'>
              {orgName}
            </Typography>
          )}
        </FormRow>

        <FormRow>
          {setName ? (
            <InputWithLabel label='Investment Name' inputValue={name} handleChange={setName} />
          ) : (
            <Typography color='gray-medium' size='xl' weight='bold'>
              {name}
            </Typography>
          )}
        </FormRow>

        <FormRow>
          <HeadlineMetric />
        </FormRow>
      </FormBody>
    </FormWrapper>
  )
}

export default InvestmentBasicInfoCardForm
