import { Map, MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { forwardRef, ReactHTMLElement } from "react";

import { env } from "~/env";

interface MapComponentProps {
  className?: string;
}

const MapComponent = forwardRef<HTMLDivElement, MapComponentProps>(
  (props, ref) => {
    return (
      <div ref={ref}>
        <Map
          className={`${props.className}`}
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
      </div>
    );
  },
);
MapComponent.displayName = "MapComponent";

export default MapComponent;
