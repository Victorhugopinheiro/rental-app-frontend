import { useGetPropertyQuery } from "@/state/api";
import { Compass, MapPin } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef } from "react";

const PropertyLocation = ({ propertyId }: PropertyDetailsProps) => {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (isLoading || isError || !property || !mapContainerRef.current) return;

    // Verifica se o token existe
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("Mapbox access token is not configured");
      return;
    }

    // Se já existe um mapa, remove antes de criar novo
    if (mapRef.current) {
      mapRef.current.remove();
    }

    mapboxgl.accessToken = accessToken;

    try {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12", // Mudado para estilo padrão
        center: [
          property.location.coordinates.longitude,
          property.location.coordinates.latitude,
        ],
        zoom: 14,
      });

      mapRef.current = map;

      const marker = new mapboxgl.Marker()
        .setLngLat([
          property.location.coordinates.longitude,
          property.location.coordinates.latitude,
        ])
        .addTo(map);

      const markerElement = marker.getElement();
      const path = markerElement.querySelector("path[fill='#3FB1CE']");
      if (path) path.setAttribute("fill", "#000000");

    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [property, isError, isLoading]);

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="py-16">
        <div className="text-red-500">Property not found</div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-100">
        Map and Location
      </h3>
      <div className="flex justify-between items-center text-sm text-primary-500 mt-2">
        <div className="flex items-center text-gray-500">
          <MapPin className="w-4 h-4 mr-1 text-gray-700" />
          Property Address:
          <span className="ml-2 font-semibold text-gray-700">
            {property.location?.address || "Address not available"}
          </span>
        </div>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(
            property.location?.address || ""
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-between items-center hover:underline gap-2 text-primary-600"
        >
          <Compass className="w-5 h-5" />
          Get Directions
        </a>
      </div>
      <div
        className="relative mt-4 h-[300px] rounded-lg overflow-hidden"
        ref={mapContainerRef}
      />
    </div>
  );
};

export default PropertyLocation;