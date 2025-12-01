import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState, } from "react";
import TripMap from "../components/tripMap";

function TripDetails() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [showEditForm, setEditForm] = useState(false);
    const [editName, setEditName] = useState("");
    const [editSummary, setEditSummary] = useState("");
    const [experiences, setExperiences] = useState([]);
    const navigate = useNavigate();

    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    const isOwner = 
        currentUser && trip && (
            (trip.user_id && trip.user_id._id === currentUser._id) ||
            trip.user_id === currentUser._id
        );

    {/* FETCH TRIP DATA FROM BACKEND */}
    useEffect(() => {
        const fetchTrips = async() => {
            try {
                const response = await fetch(`http://localhost:5555/api/trips/${tripId}`, { 
                    credentials: "include",
                });
                const data = await response.json();
                setTrip(data);

                setEditName(data.trip_name);
                setEditSummary(data.trip_summary);
            } catch (error) {
                console.error("Error fetching trip details:", error);
            }
        };
        fetchTrips();
    }, [tripId]);

    {/* HANDLES SUBMITTING EDITS FOR A TRIP. PUT REQUEST SENT TO BACKEND. */}
    const handleUpdateTrip = async (e) => {
        e.preventDefault();

        const response = await fetch(`http://localhost:5555/api/trips/${tripId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json", 
            },
            credentials: "include",
            body: JSON.stringify({
                trip_name: editName,
                trip_summary: editSummary,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            setTrip(data);
            setEditForm(false);
        } else {
            alert("Error updating trip.");
        }
    };

    {/* HANDLES DELETING A TRIP. DELETE REQUEST SENT TO BACKEND. */}
    const handleDeleteTrip = async (e) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this trip?");
        if (!confirmDelete) return;

        const response = await fetch(`http://localhost:5555/api/trips/${tripId}`, {
            method: "DELETE",
                credentials: "include",
        });

        if (response.ok) {
            navigate("/trips");
        } else {
            alert("Error deleting trip.");
        }
    }



    return (
        <div className="container mt-4">
            {/* DISPLAY TRIP NAME AND SUMMARY ON TRIP DETAILS PAGE */}
            {trip ? (
                <div className="card p-4 shadow">
                    <div style={{flexGrow: 1}}>
                        <h2>{trip.trip_name}</h2>
                        <p>{trip.trip_summary}</p>
                        {trip?.experiences?.length > 0 ? (
                            <TripMap experiences={trip.experiences} />
                        ) : (
                            <div className="d-flex flex-column justify-content-center align-items-center text-muted">
                                <i className="bi bi-map" style={{ fontSize: "2.5rem", marginBottom: "10px" }}></i>
                                <p className="m-0 fw-semibold">No map available</p>
                                <p className="m-0 small">Add an experience with a location to see it appear here.</p>
                            </div>
                        )}
                    </div>
                    {/* BUTTONS TO NAVIGATE BACK, EDIT, AND DELETE TRIP */}
                    <div className="d-flex justify-content-end mt-3">
                        <button className="btn btn-secondary me-2 align-self-start" onClick={() => navigate(-1)} title="Back to Trips">
                            <i className="bi bi-arrow-left"></i>
                        </button>

                        { /* Only show if it is user's trip */}
                        {isOwner && (
                            <>
                            <button className="btn btn-secondary me-2 align-self-start" onClick={() => navigate(`/trips/${tripId}/add-experience`)}>Add an experience!</button>
                            <button className="btn btn-secondary me-2 align-self-start" onClick={() => setEditForm(true)} title="Edit trip">
                                <i className="bi bi-pencil-square"></i>
                            </button>
                            <button className="btn btn-secondary me-2 align-self-start" onClick={handleDeleteTrip} title="Delete trip">
                                <i class="bi bi-trash"></i>
                            </button>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <p>Loading trip details...</p>
            )}
            {/* EXPERIENCES SECTION HEADER */}
            { trip && (
                <div className="mt-4">
                    <h5 className="fw-semibold mb-1">
                        Experiences in this Trip {" "}
                        {Array.isArray(trip.experiences) && trip.experiences.length > 0
                        ? `(${trip.experiences.length})`
                        : ""}
                    </h5>
                    <p className="text-muted mb-0">
                        These are the experiences added to this trip. Click a card below to see more details.
                    </p>
                </div>
            )}

            {/* PLACEHOLDER FOR NO EXPERIENCES */}
            {trip?.experiences?.length === 0 && (
                <div className="text-center text-muted mt-4 mb-4">
                    <div className="p-4 border rounded" style={{ maxWidth: "500px", margin: "0 auto", backgroundColor: "#fafafa" }}>
                        <h6 className="fw-semibold mb-2">No Experiences Added.</h6>
                        <p className="mb-0">
                            This trip hasn't had any experiences added yet. 
                            {isOwner && " Click 'Add an experience!' to create one."}
                        </p>
                    </div>
                </div>
            )}
            
            {/* DISPLAY EXPERIENCES FROM TRIP */}
            <div className="row mt-4">
                {trip?.experiences?.map((experience) => (
                    <div className="col-md-4 mb-3" key={experience._id}>
                        <div className="card h-100 shadow-sm"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/experiences/${experience._id}`)}>
                            <div className="card-body">
                                <h5 className="card-title text-center">{experience.title}</h5>
                            </div>
                        </div>
                    </div>
            ))}
            </div>
            {/* MODAL TO EDIT TRIP NAME AND SUMMARY */}
            {showEditForm && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit trip:</h5>
                            <button type="button" className="btn-close" onClick={() => setEditForm(false)}></button>
                        </div>
                        <form onSubmit={handleUpdateTrip}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Trip name:</label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)} required/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Summary:</label>
                                    <textarea
                                    rows="5"
                                    className="form-control"
                                    value={editSummary}
                                    onChange={(e) => setEditSummary(e.target.value)} required/>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setEditForm(false)}>Close</button>
                                <button type="submit" className="btn btn-primary">Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}

export default TripDetails;