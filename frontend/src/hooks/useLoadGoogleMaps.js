import { useState, useEffect } from "react";

export default function useLoadGoogleMaps() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // If already loaded, don't load again
    if (window.google && window.google.maps) {
      setLoaded(true);
      return;
    }

    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;

    if (!apiKey) {
      console.error("Missing REACT_APP_GOOGLE_MAPS_KEY in .env");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => setLoaded(true);
    script.onerror = () => console.error("Google Maps SDK failed to load");

    document.body.appendChild(script);
  }, []);

  return loaded;
}
