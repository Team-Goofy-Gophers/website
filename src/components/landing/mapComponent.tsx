import {
  Map,
  type MapCameraChangedEvent,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import { forwardRef, useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";

import { useLocationStore } from "~/store";

interface MapComponentProps {
  className?: string;
}

const MapComponent = forwardRef<HTMLDivElement, MapComponentProps>(
  (props, ref) => {
    const { setLat, setLng } = useLocationStore();
    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
      useGeolocated({
        positionOptions: {
          enableHighAccuracy: false,
        },
        userDecisionTimeout: 5000,
      });

    const [markers, setMarkers] = useState<
      {
        lat: number;
        lng: number;
      }[]
    >([]);

    useEffect(() => {
      setLat(coords?.latitude ?? 0);
      setLng(coords?.longitude ?? 0);
    }, [coords, setLat, setLng]);
    return (
      <div ref={ref}>
        {!isGeolocationAvailable ? (
          <div>Browser does not support</div>
        ) : !isGeolocationEnabled ? (
          <div>Geolocation is not enabled</div>
        ) : coords ? (
          <Map
            className={`${props.className}`}
            defaultZoom={13}
            defaultCenter={{ lat: coords.latitude, lng: coords.longitude }}
            onCameraChanged={(ev: MapCameraChangedEvent) =>
              console.log(
                "camera changed:",
                ev.detail.center,
                "zoom:",
                ev.detail.zoom,
              )
            }
            onClick={(ev) => {
              setMarkers([
                ...markers,
                {
                  lat: ev?.detail?.latLng?.lat ?? 0,
                  lng: ev?.detail?.latLng?.lng ?? 0,
                },
              ]);
            }}
          >
            {markers.map((marker, index) => {
              return (
                <AdvancedMarker
                  key={index}
                  position={{ lat: marker.lat, lng: marker.lng }}
                >
                  <Pin borderColor={"#008080"} />
                </AdvancedMarker>
              );
            })}
          </Map>
        ) : (
          <div>Getting the location load</div>
        )}
      </div>
    );
  },
);
MapComponent.displayName = "MapComponent";

export default MapComponent;
