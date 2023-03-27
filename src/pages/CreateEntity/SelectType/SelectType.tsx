import { Typography } from 'components/Typography'
import React, { useEffect, useState } from 'react'
import { Wrapper } from './SelectType.styles'
import { Box } from 'components/App/App.styles'
import { CateSelector } from '../Components'
import { ReactComponent as ClaimIcon } from 'assets/images/icon-claim.svg'
import { ReactComponent as ImpactTokenIcon } from 'assets/images/icon-impact-token.svg'
import { ReactComponent as InvestmentIcon } from 'assets/images/icon-investment.svg'
import { ReactComponent as ProjectIcon } from 'assets/images/icon-project.svg'
import { ReactComponent as OracleIcon } from 'assets/images/icon-oracle.svg'
import { ReactComponent as DAOIcon } from 'assets/images/icon-dao.svg'
import { useHistory } from 'react-router-dom'
import { useCreateEntityState } from 'hooks/createEntity'

const SelectType: React.FC = (): JSX.Element => {
  const options = [
    {
      type: 'Claim',
      label: 'Verifiable Claim',
      icon: <ClaimIcon />,
      description: `A <b>Claim Template</b> defines a data schema, data collection format, and evaluation methodology for any type of verifiable claim.`,
    },
    {
      type: 'Asset',
      label: 'Asset Class',
      icon: <ImpactTokenIcon />,
      description: `A <b>Asset Class</b> defines a data schema, data collection format, and evaluation methodology for any type of verifiable claim.`,
    },
    {
      type: 'Investment',
      label: 'Investment Class',
      icon: <InvestmentIcon />,
      description: `A <b>Investment Class</b> defines a data schema, data collection format, and evaluation methodology for any type of verifiable claim.`,
    },
    {
      type: 'Project',
      label: 'Project Class',
      icon: <ProjectIcon />,
      description: `A <b>Project Class</b> defines a data schema, data collection format, and evaluation methodology for any type of verifiable claim.`,
    },
    {
      type: 'Oracle',
      label: 'Oracle Method',
      icon: <OracleIcon />,
      description: `A <b>Oracle Method</b> defines a data schema, data collection format, and evaluation methodology for any type of verifiable claim.`,
    },
    {
      type: 'Dao',
      label: 'DAO Template',
      icon: <DAOIcon />,
      description: `A <b>DAO Template</b> defines a data schema, data collection format, and evaluation methodology for any type of verifiable claim.`,
    },
  ]

  const { updateTitle, updateSubtitle, updateEntityType } = useCreateEntityState()
  const history = useHistory()
  const [hoveredItem, setHoveredItem] = useState<any>(undefined)

  const handleClick = (item: any): void => {
    history.push(`/create/entity/${item.type.toLowerCase()}`)
  }

  useEffect(() => {
    updateEntityType('')
    updateTitle('Create a Protocol')
    updateSubtitle('Select a Type of Protocol')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Wrapper>
      <Typography
        variant='secondary'
        style={{ maxWidth: 540, height: 50 }}
        dangerouslySetInnerHTML={{ __html: hoveredItem?.description ?? '' }}
      />

      <Box className='d-flex w-full justify-content-between'>
        {options.map((item) => (
          <CateSelector
            key={item.type}
            icon={item.icon}
            label={item.label}
            onClick={(): void => handleClick(item)}
            onMouseEnter={(): void => setHoveredItem(item)}
            onMouseLeave={(): void => setHoveredItem(undefined)}
          />
        ))}
      </Box>
    </Wrapper>
  )
}

export default SelectType