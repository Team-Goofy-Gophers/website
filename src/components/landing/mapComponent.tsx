import { Map, type MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { forwardRef, useEffect } from "react";
import { useGeolocated } from "react-geolocated";
import { set } from "zod";

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

    useEffect(() => {
      setLat(coords?.latitude ?? 0);
      setLng(coords?.longitude ?? 0);
    });
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
          ></Map>
        ) : (
          <div>Getting the location load</div>
        )}
      </div>
    );
  },
);
MapComponent.displayName = "MapComponent";

export default MapComponent;
