import { Map, MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { forwardRef, ReactHTMLElement, useState } from "react";
import { useGeolocated } from "react-geolocated";

import { env } from "~/env";

interface MapComponentProps {
  className?: string;
}

const MapComponent = forwardRef<HTMLDivElement, MapComponentProps>(
  (props, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      useGeolocated({
        positionOptions: {
          enableHighAccuracy: false,
        },
        userDecisionTimeout: 5000,
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
            defaultCenter={{ lat: 0, lng: 0 }}
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
