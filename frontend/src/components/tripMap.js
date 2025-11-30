import React, { useEffect, useRef } from "react";
import useLoadGoogleMaps from "../hooks/useLoadGoogleMaps";

function TripMap({ experiences }) {
  const mapRef = useRef(null);
  const loaded = useLoadGoogleMaps();

  useEffect(() => {
  if (!loaded || !experiences || experiences.length === 0) return;

  const validLocations = experiences.filter((exp) => {
    const coords = exp.location?.coordinates;
    return (
      Array.isArray(coords) &&
      coords.length === 2 &&
      typeof coords[0] === "number" &&
      typeof coords[1] === "number"
    );
  });

  if (validLocations.length === 0) return;

  const [lng, lat] = validLocations[0].location.coordinates;
  console.log("Coordinates used:", lat, lng);

  // Adds Map 
  const map = new window.google.maps.Map(mapRef.current, {
    center: { lat: lat, lng: lng },
    zoom: 8,
  });

  validLocations.forEach((exp) => {
    const [lng, lat] = exp.location.coordinates;

    // Add Markers for Experiences 
    const marker = new window.google.maps.Marker({
        position: { lat: lat, lng: lng },
        map,
    });

    // Adds hover label for Markers 
    const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="font-weight: 600;">${exp.title}</div>`
    });

    marker.addListener("mouseover", () => {
        infoWindow.open({
        anchor: marker,
        map,
        shouldFocus: false
        });
    });

    marker.addListener("mouseout", () => {
        infoWindow.close();
    });
  });
}, [loaded, experiences]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    />
  );
}

export default TripMap;
