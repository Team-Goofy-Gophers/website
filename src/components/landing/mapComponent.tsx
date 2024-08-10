import { Map, MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { forwardRef, ReactHTMLElement, useState } from "react";
import { useGeolocated } from "react-geolocated";

import { env } from "~/env";
import { cn } from "~/lib/utils";

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
          <div
            className={cn(
              props.className,
              "bg-[url(https://th.bing.com/th/id/OIP.-QuVfq51mN6d80MDH16pUQHaD4?rs=1&pid=ImgDetMain)]",
              "relative flex items-center justify-center bg-cover bg-center bg-no-repeat text-xl font-semibold",
            )}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="z-50 text-background">
              Geolocation is not enabled
            </div>
          </div>
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
          <div
            className={cn(
              props.className,
              "bg-[url(https://th.bing.com/th/id/OIP.-QuVfq51mN6d80MDH16pUQHaD4?rs=1&pid=ImgDetMain)]",
              "relative flex items-center justify-center bg-cover bg-center bg-no-repeat text-xl font-semibold",
            )}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="z-50 text-background">
              Getting the location load
            </div>
          </div>
        )}
      </div>
    );
  },
);
MapComponent.displayName = "MapComponent";

export default MapComponent;
