import { Map, MapCameraChangedEvent } from "@vis.gl/react-google-maps";

import { env } from "~/env";

export default function MapComponent() {
  return (
    <>
      <Map
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
