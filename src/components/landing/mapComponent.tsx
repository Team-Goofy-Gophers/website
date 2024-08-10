import {
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import {
  createElement,
  forwardRef,
  type FunctionComponent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useGeolocated } from "react-geolocated";

import { Button } from "~/components/ui/button";

import AddDisasterReportExisting from "~/components/admin/disaster/addDisasterExisting";
import AddDisasterReportNew from "~/components/admin/disaster/addDisasterNew";
import { cn } from "~/lib/utils";
import { useLocationStore } from "~/store";
import { api } from "~/utils/api";

interface MapComponentProps {
  className?: string;
  onChatClick: (disasterId: string) => void;
  customChat?: FunctionComponent<{ onClick: () => void }>;
}

type MarkerType = {
  id: number;
  lat: number;
  lng: number;
  disasterId: string | null;
  status: "NEW" | "ONGOING" | "UNRELIABLE";
  intensity: number;
};

const MapComponent = forwardRef<HTMLDivElement, MapComponentProps>(
  ({ onChatClick, className, customChat }, ref) => {
    const [activeMarker, setActiveMarker] = useState<MarkerType | null>(null);

    const tooltipRef = useRef<HTMLDivElement>(null);

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
            }))
          : [],
      );
    }, [disasterAlerts]);

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
      <>
        <div ref={ref}>
          {!isGeolocationAvailable ? (
            <div>Browser does not support</div>
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
                Geolocation is not enabled
              </div>
            </div>
          ) : coords ? (
            <Map
              mapId={"homeMap"}
              className={className}
              defaultZoom={13}
              defaultCenter={{ lat: coords.latitude, lng: coords.longitude }}
              // onCameraChanged={
              //   (ev: MapCameraChangedEvent) => {
              //     console.log("map move");
              //   }
              //   console.log(
              //     "camera changed:",
              //     ev.detail.center,
              //     "zoom:",
              //     ev.detail.zoom,
              //   )
              // }
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
                  },
                ]);
              }}
            >
              {markers.map((marker, index) => (
                <AdvancedMarker
                  key={index}
                  draggable={!marker.disasterId}
                  onDrag={(event) => {
                    const newLat = event.latLng?.lat();
                    const newLng = event.latLng?.lng();
                    if (newLat !== undefined && newLng !== undefined) {
                      updateMarkerPosition(marker.id, newLat, newLng);
                    }
                  }}
                  onClick={(e) => {
                    setActiveMarker(marker);
                    if (tooltipRef.current) {
                      if (tooltipRef.current.style.display === "flex")
                        tooltipRef.current.style.display = "none";
                      else tooltipRef.current.style.display = "flex";
                      tooltipRef.current.style.left = `${(e.domEvent as { clientX: number }).clientX}px`;
                      tooltipRef.current.style.top = `${(e.domEvent as { clientY: number }).clientY}px`;
                    }
                  }}
                  position={{ lat: marker.lat, lng: marker.lng }}
                >
                  {marker.status === "ONGOING" ? (
                    marker.intensity > 7 ? (
                      <Pin
                        background={"#F60002"}
                        borderColor={"#b88e00"}
                        glyphColor={"#FF7373"}
                      />
                    ) : (
                      <Pin
                        background={"#f4b400"}
                        borderColor={"#b88e00"}
                        glyphColor={"#F8CE69"}
                      />
                    )
                  ) : marker.status === "UNRELIABLE" ? (
                    <Pin
                      background={"#0f9d58"}
                      borderColor={"#006425"}
                      glyphColor={"#60d98f"}
                    />
                  ) : (
                    <Pin
                      background={"#0000F7"}
                      borderColor={"#006425"}
                      glyphColor={"#9CC0F9"}
                    />
                  )}
                </AdvancedMarker>
              ))}
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
              <div className="z-50 text-background">
                Getting the location load
              </div>
            </div>
          )}
        </div>
        <div
          ref={tooltipRef}
          className="fixed hidden -translate-x-2/4 -translate-y-[140%] flex-col gap-3 rounded-2xl bg-background/85 p-2 transition-all duration-1000"
        >
          {activeMarker?.status === "ONGOING" ? (
            <>
              {customChat ? (
                createElement(customChat, {
                  onClick: () => {
                    onChatClick(activeMarker.disasterId!);
                  },
                })
              ) : (
                <Button
                  onClick={() => {
                    onChatClick(activeMarker.disasterId!);
                  }}
                >
                  Chat
                </Button>
              )}
              {activeMarker.disasterId && (
                <AddDisasterReportExisting
                  disasterId={activeMarker.disasterId}
                  lat={activeMarker.lat}
                  long={activeMarker.lng}
                />
              )}
            </>
          ) : (
            activeMarker && (
              <AddDisasterReportNew
                lat={activeMarker.lat}
                long={activeMarker.lng}
              />
            )
          )}
        </div>
      </>
    );
  },
);
MapComponent.displayName = "MapComponent";

export default MapComponent;
