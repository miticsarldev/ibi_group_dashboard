import React from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Vehicle, ChargingStation, Driver, Allocation } from "@/types";
import VehicleInfoModal from "./VehicleInfoModal";
import { getDriverAndVehicle } from "@/utils/functions";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 12.6392,
  lng: -8.0025,
};

interface MapProps {
  vehicles: Vehicle[];
  chargingStations: ChargingStation[];
  drivers: Driver[];
  allocations: Allocation[];
}

const Map: React.FC<MapProps> = ({
  vehicles,
  chargingStations,
  drivers,
  allocations,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [selectedVehicle, setSelectedVehicle] = React.useState<Vehicle | null>(
    null
  );
  const [selectedStation, setSelectedStation] =
    React.useState<ChargingStation | null>(null);

  const onLoad = React.useCallback(
    (map: google.maps.Map) => {
      if (!vehicles.length && !chargingStations.length) {
        map.setCenter(center);
        map.setZoom(13);
        return;
      }

      const bounds = new window.google.maps.LatLngBounds();

      vehicles.forEach((vehicle) =>
        bounds.extend(
          new google.maps.LatLng(vehicle.position[0], vehicle.position[1])
        )
      );

      chargingStations.forEach((station) =>
        bounds.extend(
          new google.maps.LatLng(station.location[0], station.location[1])
        )
      );

      map.fitBounds(bounds);

      const listener = google.maps.event.addListenerOnce(map, "idle", () => {
        if ((map.getZoom() ?? 0) > 16) {
          map.setZoom(16);
        }
      });

      listener.remove();
    },
    [vehicles, chargingStations]
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onUnmount = React.useCallback((map: google.maps.Map) => {
    // Clean up any listeners or resources
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={11} // Default zoom (fallback if bounds aren't set)
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {vehicles.map((vehicle) => (
        <Marker
          key={vehicle.id}
          position={{ lat: vehicle.position[0], lng: vehicle.position[1] }}
          icon={{
            url:
              vehicle.type === "car"
                ? "/electric-car-reel.gif"
                : "/electric-bike-reel.gif",
            scaledSize: new window.google.maps.Size(32, 32),
          }}
          onClick={() => setSelectedVehicle(vehicle)}
        />
      ))}

      {chargingStations.map((station) => (
        <Marker
          key={station.id}
          position={{ lat: station.location[0], lng: station.location[1] }}
          icon={{
            url: "/electric-charger-reel.gif",
            scaledSize: new window.google.maps.Size(48, 48),
          }}
          onClick={() => setSelectedStation(station)}
        />
      ))}

      {selectedVehicle && (
        <InfoWindow
          position={{
            lat: selectedVehicle.position[0],
            lng: selectedVehicle.position[1],
          }}
          onCloseClick={() => setSelectedVehicle(null)}
        >
          <div>
            <h3>{selectedVehicle.plate}</h3>
            <p>{selectedVehicle.type === "car" ? "Voiture" : "Moto"}</p>
            <p>Statut: {selectedVehicle.status}</p>
            <VehicleInfoModal
              {...getDriverAndVehicle(
                drivers,
                vehicles,
                allocations,
                selectedVehicle.id
              )}
            />
          </div>
        </InfoWindow>
      )}

      {selectedStation && (
        <InfoWindow
          position={{
            lat: selectedStation.location[0],
            lng: selectedStation.location[1],
          }}
          onCloseClick={() => setSelectedStation(null)}
        >
          <div>
            <h3>Station de Chargement</h3>
            <p>{selectedStation.name}</p>
            <p>Prise(s) de charge: {selectedStation.availablePlugs}</p>
            <p>Temps de travail: {selectedStation.operatingHours}</p>
            <p>Prix de charge: {selectedStation.pricePerCharge}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default React.memo(Map);
