import { truncateString } from 'new-utils'
import { Avatar, Box, Button, ButtonProps, Card, Flex, MantineStyleProps, Skeleton, Text } from '@mantine/core'
import { friendlyEntityTypes } from 'components/KeyValueTable'
import { EntityInterface } from 'redux/entitiesState/slice'

type ProtocolCardProps = {
  buttonProps?: ButtonProps
  w?: MantineStyleProps['w']
  h?: MantineStyleProps['h']
  active?: boolean
  onClick?: () => void
  entity: EntityInterface
}

const FeaturedEntityCard = ({ buttonProps, w = 400, h = 320, active, onClick, entity }: ProtocolCardProps) => {
  return (
    <Card
      shadow='md'
      radius='md'
      h={h}
      w={w}
      style={{ ...(active && { border: '2px solid #00D2FF' }) }}
      styles={{
        root: {
          cursor: 'pointer',
          ':hover': {
            boxShadow: '150px 150px 100px 100px rgba(0, 0, 0, 1)',
          },
        },
        section: {
          ':hover': {
            boxShadow: '150px 150px 100px 100px rgba(0, 0, 0, 1)',
            padding: 10,
          },
        },
      }}
      onClick={onClick}
    >
      <Card.Section px='md' pt='md' pos='relative'>
        <Flex
          style={{
            borderRadius: '10px',
            backgroundImage: entity.settings?.Profile?.data?.image
              ? `url(${entity.settings?.Profile?.data?.image})`
              : 'linear-gradient(135deg, #56BBBB 0%, #275555 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          h={200}
          w={'100%'}
        />

        <Box
          pos='absolute'
          bottom='0'
          left='0'
          right='0'
          mx='md'
          p='md'
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(5px)',
            borderRadius: '0 0',
          }}
        >
          <Text c='white' tt='capitalize' style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
            {friendlyEntityTypes(entity.type)}
          </Text>
        </Box>
      </Card.Section>
      <Card.Section p='md'>
        <Flex w='100%' bg='#F9F9F9' p='sm' style={{ borderRadius: '10px' }} justify={'space-between'} align={'center'}>
          <Box>
            <Text>{truncateString(entity?.settings?.Profile?.data?.name ?? '', 30, { ellipsisPos: 'center' })}</Text>
            <Text c='dimmed'>
              {truncateString(entity?.settings?.Profile?.data?.brand ?? '', 20, { ellipsisPos: 'center' })}
            </Text>
          </Box>
          <Avatar src={entity?.settings?.Profile?.data?.logo} />
        </Flex>
      </Card.Section>
      {buttonProps && (
        <Card.Section p='md'>
          <Button {...buttonProps} />
        </Card.Section>
      )}
    </Card>
  )
}

FeaturedEntityCard.Loading = () => {
  return <Skeleton h={320} w={400} radius='md' />
}

export default FeaturedEntityCard
