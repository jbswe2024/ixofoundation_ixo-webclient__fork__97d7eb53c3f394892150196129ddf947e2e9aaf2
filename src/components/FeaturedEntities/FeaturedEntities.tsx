import { Carousel } from '@mantine/carousel'
import { useMediaQuery } from '@mantine/hooks'
import { useMantineTheme } from '@mantine/core'
import '@mantine/carousel/styles.css'
import FeaturedEntityCard from './FeaturedEntityCard'
import { useNavigate } from 'react-router-dom'

function Card({ entity }: { entity: any }) {
  const navigate = useNavigate()
  return <FeaturedEntityCard entity={entity} onClick={() => navigate(`/entity/${entity.id}`)} />
}

export const FeaturedEntities = ({ entities, loading }: { entities: any[]; loading?: boolean }) => {
  const theme = useMantineTheme()
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`)
  const largerThan1440 = useMediaQuery(`(min-width: 1441px)`)

  const smPercentage = mobile ? 100 : largerThan1440 ? 25 : 33.333333
  const slidesToScroll = mobile ? 1 : largerThan1440 ? 4 : 3

  const loadingSlides = Array.from({ length: 4 }, () => (
    <Carousel.Slide key={`${Math.random()}`}>
      <FeaturedEntityCard.Loading />
    </Carousel.Slide>
  ))

  const slides = entities.map((entity: any) => (
    <Carousel.Slide key={entity.id}>
      <Card entity={entity} />
    </Carousel.Slide>
  ))

  return (
    <Carousel
      slideSize={{ base: '100%', sm: `${smPercentage}%` }}
      slideGap={{ base: 'md', sm: 'xl' }}
      align='start'
      slidesToScroll={slidesToScroll}
      withControls
      containScroll='keepSnaps'
      controlsOffset='-300px'
      controlSize={40}
    >
      {loading ? loadingSlides : slides}
    </Carousel>
  )
}
