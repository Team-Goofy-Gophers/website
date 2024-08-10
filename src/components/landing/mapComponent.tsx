import {
  Map,
  type MapCameraChangedEvent,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import { forwardRef, useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";

import { env } from "~/env";
import { cn } from "~/lib/utils";
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
