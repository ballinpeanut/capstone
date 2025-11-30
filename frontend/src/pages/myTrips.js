import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Trips() {

    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [showTripForm, setTripForm] = useState(false);            // Track pop-up is visible
    const [name, setName] = useState("");             // Store and update trip name in input field
    const [summary, setSummary] = useState("");       // Store and update trip summary in input field
    const [loggedIn, setLoggedIn] = useState(false);
    const [allTrips, setAllTrips] = useState([]);      // <--- NEW: store all trips
    const [showMyTrips, setShowMyTrips] = useState(false);

    {/* LOAD TRIP DATA FROM BACKEND */}
    useEffect(() => {
        const fetchTrips = async() => {
            try {
                const response = await fetch(`http://localhost:5555/api/trips`, {
                    credentials: "include"
                });
                const data = await response.json();

                if (!response.ok) {
                    console.error("Error getting trips: ", data);
                    setTrips([]);
                    setAllTrips([]);
                    return;
                }
                
                const list = Array.isArray(data) ? data: [];
                setTrips(list);
                setAllTrips(list);
                setTrips(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching trips:", error);
                setTrips([]);
                setAllTrips([]);
            }
        };

        const checkLoginStatus = async () => {
            try {
                const res = await fetch("http://localhost:5555/api/trips/my-trips", {
                    method: "GET",
                    credentials: "include",
                });
                setLoggedIn(res.ok);
            } catch (err) {
                console.error("Error checking logged in status:", err);
                setLoggedIn(false);
            }
        };

        fetchTrips();
        checkLoginStatus();

    }, []);

    {/* HANDLES FORM SUBMISSION FOR ADDING TRIPS. POST REQUEST SENT TO BACKEND. */}
    const handleAddTrip = async (event) => {
        event.preventDefault();

        // if (!localStorage.getItem("token")) {
        //     alert("You must be logged in.");
        //     return;
        // }

        const newTrip = {
            trip_name: name,
            trip_summary: summary,
        };

        try {
            const response = await fetch("http://localhost:5555/api/trips", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${localStorage.getItem("token")}`
                 },
                body: JSON.stringify(newTrip),
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                setTrips([...trips, data]);
                setTripForm(false);
                setName("");
                setSummary("");
            } else {
                alert(data.message || "Error creating trip.");
            }
        } catch (error) {
            console.error("Error adding trip", error);
        }
    };

    const handleMyTripToggle = async () => {
        if (!loggedIn) return;

        if (!showMyTrips) {
            try {
                const res = await fetch("http://localhost:5555/api/trips/my-trips", {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    console.error("Error fetching my trips");
                    return;
                }

                const data = await res.json();
                setTrips(Array.isArray(data) ? data: []);
                setShowMyTrips(true);
            } catch (err) {
                console.error("Error fetching my trips:", err);
            }
        } else {
            setTrips(allTrips);
            setShowMyTrips(false);
        }
    };


    return (
        <div className="container mt-4">
            <div className="row">
            {/* CARD FOR TRIP NAME */}
                {trips.map((trip) => (
                    <div className="col-md-4 mb-4" key={trip._id}>
                        <div className="card h-100 shadow-sm"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/trips/${trip._id}`, {state: {trip}})}>
                            <div className="card-body">
                                <h5 className="card-title text-center" class="text-center">{trip.trip_name}</h5>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ADD TRIP BUTTON */}
            {loggedIn && (
            <div className="text-center mt-4">
                <div id="addTrips" className="form-text mb-2">More adventures?</div>
                
                {/* Button to switch between all trips or user created trips */}
                <button className="btn btn-primary me-2" onClick={handleMyTripToggle}>
                    {showMyTrips ? "Show all trips" : "Show my trips"}
                </button>
                <button className="btn btn-primary" onClick={() => setTripForm(true)}>Add a trip!</button>
            </div>
            )}

            {/* ADD TRIP POP-UP FORM */}
            {showTripForm && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add a trip:</h5>
                            <button type="button" className="btn-close" onClick={() => setTripForm(false)}></button>
                        </div>
                        <form onSubmit={handleAddTrip}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Where did you go?</label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)} required/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Tell us about it!</label>
                                    <textarea
                                    rows="5"
                                    className="form-control"
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)} required/>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setTripForm(false)}>Close</button>
                                <button type="submit" className="btn btn-primary">Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}

export default Trips;