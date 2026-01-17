import { useGetProperiesQuery } from "@/state/api";
import { useAppSelector } from "@/state/redux";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Property } from "@/types/prismaTypes";
import "mapbox-gl/dist/mapbox-gl.css"; // ADICIONE ESTA LINHA

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;


export default function Map() {

    const mapContainerRef = useRef(null)
    const filters = useAppSelector((state) => state.global.filters)

    const { data: properties, isError, isLoading } = useGetProperiesQuery(filters)

    useEffect(() => {
        if (isLoading || isError) return;

        const map = new mapboxgl.Map({

            container: mapContainerRef.current!,
            style: 'mapbox://styles/mapbox/standard', // Use the standard style for the map
            projection: 'globe', // display the map as a globe
            zoom: 9, // initial zoom level, 0 is the world view, higher values zoom in
            center: filters.coordinates || [-74.5, 40]

        });


        properties?.forEach((property) => {
            const marker = createPropertyMarker(property, map);
            const markerElement = marker.getElement();
            const path = markerElement.querySelector("path[fill='#3FB1CE']");
            if (path) path.setAttribute("fill", "#000000");
        });
        let resizeTimerId: NodeJS.Timeout;

        const resizeMap = () => {
            if (map) {

                resizeTimerId = setTimeout(() => {
                    map.resize();
                }, 700);
            }
        };

        resizeMap();

        // Cleanup Function
        return () => {
            // 1. IMPORTANTE: Cancela o timer pendente (impede o erro)
            if (resizeTimerId) clearTimeout(resizeTimerId);

            // 2. Depois remove o mapa com segurança
            map.remove();
        };

    }, [filters, properties, isError, isLoading]);


    return (
        <div className="flex-1 h-full  relative rouded-xl">
            <div ref={mapContainerRef} className="w-full h-full rounded-lg">

            </div>
        </div>
    )
}


const createPropertyMarker = (property: Property, map: mapboxgl.Map) => {
    const marker = new mapboxgl.Marker()
        .setLngLat([
            property.location.coordinates.longitude,
            property.location.coordinates.latitude,
        ])
        .setPopup(
            new mapboxgl.Popup().setHTML(
                `
        <div class="marker-popup">
          <div class="marker-popup-image"></div>
          <div>
            <a href="/search/${property.id}" target="_blank" class="marker-popup-title">${property.name}</a>
            <p class="marker-popup-price">
              $${property.pricePerMonth}
              <span class="marker-popup-price-unit"> / month</span>
            </p>
          </div>
        </div>
        `
            )
        )
        .addTo(map);
    return marker;
};