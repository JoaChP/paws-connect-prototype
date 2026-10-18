'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { maplibreGL } from '@maplibre/maplibre-gl-leaflet'
import { tileLayer } from 'leaflet'
import { setWorkerUrl } from 'maplibre-gl'

setWorkerUrl(new URL('maplibre-gl/dist/maplibre-gl-worker.mjs', import.meta.url).toString())

/** OpenFreeMap vector basemap shared by exploration, details and the location picker. */
export default function VectorMapLayer() {
  const map = useMap()

  useEffect(() => {
    map.attributionControl.setPosition('topright')
    let layer: ReturnType<typeof maplibreGL> | ReturnType<typeof tileLayer>
    const attribution =
      '<a href="https://openfreemap.org/">OpenFreeMap</a> &copy; <a href="https://www.openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

    try {
      layer = maplibreGL({
        style: 'https://tiles.openfreemap.org/styles/liberty',
        attributionControl: { customAttribution: attribution },
      }).addTo(map)
    } catch {
      // Keep reporting usable on devices without WebGL support.
      layer = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)
    }

    return () => {
      layer.remove()
    }
  }, [map])

  return null
}
