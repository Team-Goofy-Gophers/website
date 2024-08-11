import { Map } from "@vis.gl/react-google-maps";
import { useSession } from "next-auth/react";
import { forwardRef, type FunctionComponent, useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";

import { cn } from "~/lib/utils";
import { useLocationStore } from "~/store";
import { api } from "~/utils/api";

import CustomMarker from "./customMarker";

interface MapComponentProps {
  className?: string;
  onChatClick: (disasterId: string) => void;
  customChat?: FunctionComponent<{ onClick: () => void }>;
}

export type MarkerType = {
  id: number;
  lat: number;
  lng: number;
  disasterId: string | null;
  status: "NEW" | "ONGOING" | "UNRELIABLE";
  intensity: number;
  byMe: boolean;
};

const MapComponent = forwardRef<HTMLDivElement, MapComponentProps>(
  ({ onChatClick, className, customChat }, ref) => {
    const { data: session } = useSession();

    const { setLat, setLng } = useLocationStore();

    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
      useGeolocated({
        positionOptions: {
          enableHighAccuracy: false,
        },
        userDecisionTimeout: 5000,
      });

    const [markers, setMarkers] = useState<MarkerType[]>([]);

    const { data: disasterAlerts } = api.disaster.getDisasterAlerts.useQuery({
      lat: coords?.latitude ?? 0,
      long: coords?.longitude ?? 0,
      status: ["ONGOING", "UNRELIABLE"],
    });

    useEffect(() => {
      setMarkers(
        disasterAlerts
          ? disasterAlerts.flatMap((disaster, idx) => ({
              id: idx,
              lat: disaster.lat,
              lng: disaster.long,
              disasterId: disaster.id,
              status: disaster.status as "ONGOING" | "UNRELIABLE",
              intensity: disaster.Disaster.intensity,
              byMe:
                disaster.DisasterReport.filter((report) => {
                  return report.User.id === session?.user.id;
                }).length > 0,
            }))
          : [],
      );
    }, [disasterAlerts, session]);

    const updateMarkerPosition = (id: number, lat: number, lng: number) => {
      setMarkers((prevMarkers) =>
        prevMarkers.map((marker) =>
          marker.id === id ? { ...marker, lat, lng } : marker,
        ),
      );
    };

    useEffect(() => {
      setLat(coords?.latitude ?? 0);
      setLng(coords?.longitude ?? 0);
    }, [coords, setLat, setLng]);

    return (
      <div ref={ref}>
        {!isGeolocationAvailable ? (
          <div>Browser does not support.</div>
        ) : !isGeolocationEnabled ? (
          <div
            className={cn(
              className,
              "bg-[url(https://th.bing.com/th/id/OIP.-QuVfq51mN6d80MDH16pUQHaD4?rs=1&pid=ImgDetMain)]",
              "relative flex items-center justify-center bg-cover bg-center bg-no-repeat text-xl font-semibold",
            )}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="z-50 text-background">
              Geolocation is not enabled.
            </div>
          </div>
        ) : coords ? (
          <Map
            mapId={"homeMap"}
            className={className}
            defaultZoom={13}
            defaultCenter={{ lat: coords.latitude, lng: coords.longitude }}
            onClick={(ev) => {
              setMarkers([
                ...markers,
                {
                  id: markers.length,
                  lat: ev?.detail?.latLng?.lat ?? 0,
                  lng: ev?.detail?.latLng?.lng ?? 0,
                  disasterId: null,
                  status: "NEW",
                  intensity: 0,
                  byMe: true,
                },
              ]);
            }}
          >
            {markers.map((marker, index) => {
              return (
                <CustomMarker
                  key={index}
                  marker={marker}
                  onChatClick={onChatClick}
                  customChat={customChat}
                  updateMarkerPosition={updateMarkerPosition}
                />
              );
            })}
          </Map>
        ) : (
          <div
            className={cn(
              className,
              "bg-[url(https://th.bing.com/th/id/OIP.-QuVfq51mN6d80MDH16pUQHaD4?rs=1&pid=ImgDetMain)]",
              "relative flex items-center justify-center bg-cover bg-center bg-no-repeat text-xl font-semibold",
            )}
          >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="z-50 text-background">Fetching location...</div>
          </div>
        )}
      </div>
    );
  },
);
MapComponent.displayName = "MapComponent";

export default MapComponent;
