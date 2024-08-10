import { Map, MapCameraChangedEvent } from "@vis.gl/react-google-maps";

import { env } from "~/env";

interface MapComponentProps {
  className?: string;
}

export default function MapComponent({ className }: MapComponentProps) {
  return (
    <>
      <Map
        className={`${className}`}
        defaultZoom={13}
        defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
        onCameraChanged={(ev: MapCameraChangedEvent) =>
          console.log(
            "camera changed:",
            ev.detail.center,
            "zoom:",
            ev.detail.zoom,
          )
        }
      ></Map>
    </>
  );
}
