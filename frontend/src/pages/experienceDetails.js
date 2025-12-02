 import { useParams, useNavigate } from "react-router-dom";
 import React, { useEffect, useState } from "react";

 function ExperienceDetails() {
    const { experienceId } = useParams();
    const [experience, setExperience] = useState(null);
    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [score, setScore] = useState("");
    const [showRating, setShowRating] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const URL = process.env.REACT_APP_URL;

    {/* FETCH EXPERIENCE DATA FROM BACKEND. */}
    useEffect(() => {
        const fetchExperiences = async() => {
            try {
                const response = await fetch(`${URL}/api/experiences/${experienceId}`);
                const data = await response.json();
                setExperience(data);
            } catch(error) {
                console.error("Error fetching experience details.", error);
            }
        };
        fetchExperiences();
    }, [experienceId]);

    {/* FETCH TRIP DATA FROM BACKEND */}
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const userId = user._id;
                const response = await fetch(`${URL}/api/trips`, {
                     headers: {
                        // "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    credentials: "include",
                });
                const data = await response.json();
                setTrips(data);
            } catch (error) {
                console.error("Error fetching trips.", error);
            }
        };  
        fetchTrips();
    }, []);

    if (!experience) {
        return <p className="container mt-4">Loading...</p>
    }

    {/* HANDLES ADDING EXPERIENCE TO A TRIP. POST REQUEST SENT TO BACKEND. */}
    const handleSaveToTrip = async() => {
        if (!selectedTrip) return alert("Please select a trip.");

        try {
            const response = await fetch(`${URL}/api/trips/${selectedTrip}/addExperience`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ experience_id: experience._id }),
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to save experience.");
            alert("Experience saved!");
            setShowModal(false);
            navigate(`/trips/${selectedTrip}`)
        } catch (error) {
            console.error("Error saving experience", error);
        }
    }

    {/* HANDLES SUBMITTING A SCORE FOR EXPERIENCES. POST REQUEST SENT TO BACKEND. */}
    const handleSubmitRating = async (e) => {
        e.preventDefault();
        if (!user) return alert ("You must be logged in to rate an experience.")

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${URL}/api/ratings/${experience._id}`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    // "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ score} ),
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to submit rating.");

            const updatedResponse = await fetch(`${URL}/api/experiences/${experienceId}`);
            const updatedData = await updatedResponse.json();
            setExperience(updatedData);

            setScore("");
            setShowRating(false);
            alert("Rating submitted!");
        } catch (error) {
            console.error("Error rating experience", error);
        }
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-center mt-4" style={{ width: "100%" }}>
                <div className="card p-4 shadow d-flex flex-column"style={{maxWidth: "900px", width: "100%"}}>
                    <h2>{experience.title}</h2>
                    <p className="text-muted">{experience.location?.name}</p>

                    {/* DATE TRAVELED */}
                    <h6>Date Traveled: {new Date(experience.date_traveled).toLocaleString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}</h6>

                    {/* AVERAGE SCORE */}
                    <p><strong>Score: </strong>{experience.averageRating?.toFixed(1)}/10.0</p>
                    {experience.images?.length > 0 && (
                        <img
                            src={experience.images[0]}
                            alt=""
                            style={{width: "100%", height: "450px", objectFit: "cover"}}
                            className="rounded mb-3"
                        />
                    )}
                    {/* CREATED AT DATETIME */}
                    <h6>Posted<strong>{experience.user_id?.username}</strong>: {new Date(experience.created_at).toLocaleString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true
                    })}</h6>
                    <p>{experience.description}</p>

                {/* KEYWORDS AND BUTTONS TO RATE AND SAVE */}
                    <div className="d-flex justify-content-between align-items-center mt-3 w-100">
                        <p className="mb-0 text-wrap">Keywords: {experience.keywords?.join(", ")}</p>
                        
                        <div className="d-flex gap-2">
                             {/* back button */}
                            <button className="btn btn-secondary" onClick={() => navigate(-1)} title="Back">
                                <i className="bi bi-arrow-left"></i>
                            </button>
                            
                             {/* Logged in only buttons */}
                            {user && (
                                <>
                                {/* Add rating button */}
                                <button className="btn btn-secondary" onClick={() => setShowRating(true)}>
                                    <i className="bi bi-star-fill"></i>
                                </button>

                                {/* Add to a Trip */}
                                <button className="btn btn-secondary" onClick={() => setShowModal(true)}>
                                    <i className="bi bi-bookmark-plus-fill"></i>
                                </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
     
            {/* DISPLAY SAVE TO MY TRIP MODAL */}
            {showModal&& (
                <div className="modal-content p-4 shadow bg-white rounded" style={{maxWidth: "400px", margin: "100px auto"}}>
                    <h5>Save to My Trip</h5>
                    <select
                        className="form-select my-3"
                        value={selectedTrip}
                        onChange={(e) => setSelectedTrip(e.target.value)}
                    >
                        <option value="">Select a trip</option>
                        {trips.map((trip) => (
                            <option key={trip._id} value={trip._id}>{trip.trip_name}</option>
                        ))}
                        </select>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleSaveToTrip}>
                                Save
                            </button>
                        </div>
                </div>
            )}
            {/* DISPLAY RATING MODAL */}
            {showRating&& (
                <div className="modal-content p-4 shadow bg-white rounded" style={{maxWidth: "400px", margin: "100px auto"}}>
                    <h5>Rate this experience</h5>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        className="form-control my-2"
                        placeholder="Enter rating from 1-10"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                    />
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-secondary me-2" onClick={() => setShowRating(false)}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleSubmitRating}>
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
 }

 export default ExperienceDetails;
