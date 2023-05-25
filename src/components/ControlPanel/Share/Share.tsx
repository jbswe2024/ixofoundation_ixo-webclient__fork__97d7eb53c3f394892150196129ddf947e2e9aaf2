import React from 'react'
import { Widget } from '../types'
import { ReactComponent as ShareIcon } from 'assets/images/icon-share-alt-square-solid.svg'
import { ReactComponent as TwitterIcon } from 'assets/images/icon-twitter.svg'
import { ReactComponent as LinkedinIcon } from 'assets/images/icon-linkedin.svg'
import { ReactComponent as FacebookIcon } from 'assets/images/icon-facebook.svg'
import { FlexBox, SvgBox, theme } from 'components/App/App.styles'
import { Typography } from 'components/Typography'

interface Props {
  widget: Widget
}

const Share: React.FC<Props> = () => {
  const items = [
    {
      icon: <TwitterIcon />,
      onClick: () => {
        window.open('https://twitter.com/ixoworld')
      },
    },
    {
      icon: <LinkedinIcon />,
      onClick: () => {
        window.open('https://li.linkedin.com/company/ixoworld')
      },
    },
    {
      icon: <FacebookIcon />,
      onClick: () => {
        window.open('https://www.facebook.com/ixoworld/')
      },
    },
  ]

  return (
    <FlexBox direction='column' gap={5} background='#ffffff' borderRadius='12px' p={5}>
      <FlexBox gap={2} alignItems='center'>
        <SvgBox svgWidth={4} svgHeight={4} color={theme.ixoNewBlue}>
          <ShareIcon />
        </SvgBox>
        <Typography variant='secondary' size='lg'>
          Share
        </Typography>
      </FlexBox>

      <FlexBox width='100%' gap={2} flexWrap='wrap'>
        {items.map((item, index) => (
          <FlexBox
            key={index}
            borderRadius='8px'
            background={theme.ixoGrey100}
            p={3}
            gap={2}
            alignItems='center'
            borderColor={'transparent'}
            borderWidth={'1px'}
            borderStyle={'solid'}
            hover={{ borderColor: theme.ixoNewBlue }}
            onClick={item.onClick}
            cursor='pointer'
          >
            <SvgBox svgWidth={5} svgHeight={5} color={theme.ixoBlack}>
              {item.icon}
            </SvgBox>
          </FlexBox>
        ))}
      </FlexBox>
    </FlexBox>
  )
}

export default Share