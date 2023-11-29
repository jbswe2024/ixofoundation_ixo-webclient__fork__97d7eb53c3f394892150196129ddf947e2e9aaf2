import { FlexBox } from 'components/App/App.styles'
import mapboxgl from 'mapbox-gl'
import { useRef } from 'react'
import Map, { Layer, Source, MapRef, GeoJSONSource, LayerProps } from 'react-map-gl'
import styled, { useTheme } from 'styled-components'

const Container = styled(FlexBox)`
  width: 100%;
  height: 100%;
  minheight: 350px;

  .mapboxgl-control-container {
    display: none;
  }
`

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ3JlZ29yeWl4bzQ1IiwiYSI6ImNscGhlMnJkNzAyODMyam81MmphdzUyangifQ.jsNbHzDlWGY6xefsRYvc5A'

const ClaimLocation = () => {
  const theme: any = useTheme()
  const mapRef = useRef<MapRef>(null)

  const clusterLayer: LayerProps = {
    id: 'clusters',
    type: 'circle',
    source: 'earthquakes',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': theme.ixoNewBlue,
      'circle-radius': 4,
      'circle-stroke-width': 12,
      'circle-stroke-color': theme.ixoNewBlue,
      'circle-blur': 1,
    },
  }

  const onClick = (event: any) => {
    const feature = event.features[0]
    const clusterId = feature.properties.cluster_id

    const mapboxSource = mapRef.current?.getSource('earthquakes') as GeoJSONSource

    mapboxSource?.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return
      }

      mapRef.current?.easeTo({
        center: feature.geometry.coordinates,
        zoom,
        duration: 500,
      })
    })
  }

  return (
    <Container>
      <Map
        initialViewState={{
          latitude: 40.67,
          longitude: -103.59,
          zoom: 3,
        }}
        // mapStyle='mapbox://styles/mapbox/dark-v9'
        mapStyle={{
          version: 8,
          sources: {
            'raster-tiles': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: 'background',
              type: 'background',
              paint: {
                'background-color': 'transparent',
              },
            },
            {
              id: 'simple-tiles',
              type: 'raster',
              source: 'raster-tiles',
              minzoom: 0,
              maxzoom: 22,
              paint: {
                'raster-opacity': 0.5,
              },
            },
          ],
        }}
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={[clusterLayer.id || '']}
        onClick={onClick}
        ref={mapRef}
      >
        <Source
          id='earthquakes'
          type='geojson'
          data='https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson'
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
        </Source>
      </Map>
    </Container>
  )
}

export default ClaimLocation
