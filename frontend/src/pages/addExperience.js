import { useNavigate, useParams } from "react-router-dom";
import React, { useState } from "react";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import useLoadGoogleMaps from "../hooks/useLoadGoogleMaps";

function AddExperience() {
    const loaded = useLoadGoogleMaps();    
    const { tripId } = useParams();
    const navigate = useNavigate();
    const URL = process.env.REACT_APP_URL;


    // check if loaded after all hooks 
    if (!loaded) {
        return (
            <div className="container mt-4">
                <p>Loading Google Maps...</p>
            </div>
        );
    }

    return <AddExperienceForm tripId={tripId} navigate={navigate} />;

    function AddExperienceForm({tripId, navigate}) {
        const [title, setTitle] = useState("");
        const [description, setDescription] = useState("");
        const [location, setLocation] = useState("");
        const [imageFile, setImageFile] = useState(null);
        const [dateTraveled, setDateTraveled] = useState("");
        const [keywords, setKeywords] = useState("");
        const [visibility, setVisibility] = useState("public");
        const [coords, setCoords] = useState({ lat: null, lng: null });

        // Call usePlacesAutocomplete  
    const {
        ready,
        value: locationInput,
        suggestions: { status, data },
        setValue: setLocationValue,
        clearSuggestions
    } = usePlacesAutocomplete({
        debounce: 300,
        requestOptions: {},
    });

    const handleSelectLocation = async (address) => {        
        setLocationValue(address, false);
        clearSuggestions();
        setLocation(address);

        try {
            const results = await getGeocode({ address });            
            const { lat, lng } = await getLatLng(results[0]);
            
            setCoords({ lat, lng });
        } catch (error) {
            console.error("Error getting location coordinates:", error);
            alert("Could not get coordinates for this location. Please try another.");
        }
    };

    const handleAddExperience = async (event) => {
        event.preventDefault();
        console.log("Form submitted!");

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("You must be logged in to add an experience.");
            return;
        }

        // Check if coordinates are set
        if (!location.trim()) {
            alert("Please enter a location");
            return;
        }

        const newExperience = {
            user_id: user._id,
            title,
            description,
            location: { name: location, coordinates: [coords.lng, coords.lat] },
            date_traveled: dateTraveled,
            keywords: keywords ? keywords.split(",").map(k => k.trim()) : [],
            visibility,
        };

        console.log("Sending experience:", newExperience);

        try {
            const response = await fetch(`${URL}/api/experiences`, {
                method: "POST",
                headers: { "Content-Type": "application/json", 
                },
                body: JSON.stringify(newExperience),
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || `Error creating experience: ${response.status}`);
                return;
            }

            const experienceId = data.newExperience?._id || data._id;

            // adding experience directly from trip
            if (tripId && experienceId) {
                const attachRes = await fetch(`${URL}/api/trips/${tripId}/addExperience`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    credentials: "include",
                    body: JSON.stringify({experience_id: experienceId}),
                });
                if (!attachRes.ok) {
                    console.error("Error adding experience to trip.");
                }
                alert("Experience added to Trip!")
            }

            // go back to trip
            if (tripId) {
                navigate(`/trips/${tripId}`);
            } else {
                alert("Experience added")
                navigate(`/experiences`, {state: {refresh: true}});
            }

            if (imageFile) {
                const formData = new FormData();
                formData.append("image", imageFile);
                formData.append("user_id", user._id);

                const uploadResponse = await fetch(`{URL}/api/upload/${experienceId}`, {
                    method: "POST",
                    body: formData,
                });

                console.log("Image upload status:", uploadResponse.status);
            }

            // alert("Experience added!");
            // navigate(`/experiences`, { state: { refresh: true } });

        } catch (error) {
            console.error("Error adding experience:", error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Add an experience</h2>
            <form onSubmit={handleAddExperience} className="card p-3 shadow">
                <div className="mb-3">
                    <label className="form-label">Title:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Description:</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Location:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={locationInput}
                        onChange={(e) => setLocationValue(e.target.value)}
                        disabled={false}
                        placeholder="Search for a location..."
                    />
                    {status === "OK" && (
                        <ul className="list-group mt-2">
                            {data.map((suggestion) => {
                                const {
                                    place_id,
                                    structured_formatting: { main_text, secondary_text },
                                } = suggestion;

                                return (
                                    <li
                                        key={place_id}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => handleSelectLocation(suggestion.description)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <strong>{main_text}</strong> <small>{secondary_text}</small>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    {location && (
                        <small className="text-success d-block mt-1">
                            ✓ Selected: {location}
                        </small>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label">Date Traveled:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={dateTraveled}
                        onChange={(e) => setDateTraveled(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Keywords (comma-separated):</label>
                    <input
                        type="text"
                        className="form-control"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="beach, sunset, adventure"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Image:</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Visibility:</label>
                    <select
                        className="form-select"
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                <div className="d-flex justify-content-between mt-3">
                    <button type="button" className="btn btn-secondary"
                    onClick={() => navigate(-1)}>Cancel
                    </button>

                    <button type="submit" className="btn btn-primary">Add Experience</button>
                </div>
            </form>
        </div>
    );
}
}


export default AddExperience;