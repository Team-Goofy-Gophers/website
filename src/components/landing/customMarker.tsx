import {
  AdvancedMarker,
  InfoWindow,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import React, { createElement, useCallback, useState } from "react";

import { Button } from "~/components/ui/button";

import AddDonation from "~/components/addDonation";
import AddDisasterReportExisting from "~/components/admin/disaster/addDisasterExisting";
import AddDisasterReportNew from "~/components/admin/disaster/addDisasterNew";
import { type MarkerType } from "~/components/landing/mapComponent";

const CustomMarker: React.FC<{
  updateMarkerPosition: (id: number, lat: number, lng: number) => void;
  marker: MarkerType;
  onChatClick: (disasterId: string) => void;
  customChat?: React.FC<{ onClick: () => void }>;
}> = ({ updateMarkerPosition, marker, onChatClick, customChat }) => {
  const [markerRef, markerOG] = useAdvancedMarkerRef();
  const [activeMarker, setActiveMarker] = useState<MarkerType | null>(null);
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const handleMarkerClick = useCallback(() => {
    setInfoWindowShown((isShown) => !isShown);
    setActiveMarker(marker);
  }, [marker]);

  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        draggable={!marker.disasterId}
        onDrag={(event) => {
          const newLat = event.latLng?.lat();
          const newLng = event.latLng?.lng();
          if (newLat !== undefined && newLng !== undefined) {
            updateMarkerPosition(marker.id, newLat, newLng);
          }
        }}
        onClick={handleMarkerClick}
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
      {infoWindowShown && (
        <InfoWindow
          position={{ lat: marker.lat, lng: marker.lng }}
          anchor={markerOG}
          onClose={handleClose}
          className="flex flex-col gap-3"
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
                <>
                  <AddDisasterReportExisting
                    disasterId={activeMarker.disasterId}
                    lat={activeMarker.lat}
                    long={activeMarker.lng}
                  />
                  <AddDonation disasterId={activeMarker.disasterId} />
                </>
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
        </InfoWindow>
      )}
    </>
  );
};

export default CustomMarker;
