import React, {useState, useCallback, useRef} from "react"
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { formatRelative } from "date-fns"
import mapStyles from "./mapStyles"

function App() {
  const libraries = ["places"]
  const mapContainerStyle = {
    width: "100vw",
    height: "100vh",
  }
  const center = {
    lat: -1.285790,
    lng: 36.820030,
  }
  const options = {
    styles: mapStyles,
    disableDefaultUi: true,
    zoomControl: true,
  }
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  })
  const [markers, setMarkers] = useState([])
  const [selected, setSelected] = useState(null)
  const onMapClick = useCallback((event)=>{
    setMarkers((current) => 
    [...current,{
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      time: new Date(),
    },
  ])
  }, [])
  const mapRef = useRef()
  const onMapLoad = useCallback((map)=> {
    mapRef.current = map
  },[])
  if (loadError) return "Error loading maps"
  if (!isLoaded) return "Loading Maps"
  return (
    <div>
      <h1>Map</h1>
      <GoogleMap 
      mapContainerStyle={mapContainerStyle} 
      zoom={8} 
      center={center}
      options={options}
      onClick={onMapClick}
      onLoad={onMapLoad}
      >
      {markers.map((marker) => (
        <Marker
        key={marker.time.toISOString()}
        position={{lat:marker.lat, lng: marker.lng}}
        onClick={()=> {
          setSelected(marker)
        }}
        />
      ))}
      {selected ? (
      <InfoWindow 
      position={{lat: selected.lat, lng: selected.lng}}
      onCloseClick={()=>{
        setSelected(null)
      }}
      >
        <div>
          <h2>Bear spotted</h2>
      <p>spotted {formatRelative(selected.time, new Date())}</p>
        </div>
      </InfoWindow>
      ): null}
      </GoogleMap>
    </div>
  );
}

export default App;
