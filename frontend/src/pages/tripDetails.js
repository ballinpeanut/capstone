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
                <div className="card p-4 shadow" style={{minHeight: "600px"}}>
                    <div style={{flexGrow: 1}}>
                        <h2>{trip.trip_name}</h2>
                        <p>{trip.trip_summary}</p>
                        <TripMap experiences={trip.experiences} />
                    </div>
                    {/* BUTTONS TO NAVIGATE BACK, EDIT, AND DELETE TRIP */}
                    <div className="d-flex justify-content-end mt-3">
                        <button className="btn btn-secondary me-2 align-self-start" onClick={() => navigate(-1)}>
                            <i className="bi bi-arrow-left"></i>
                        </button>
                        <button className="btn btn-secondary me-2 align-self-start" onClick={() => navigate(`/experiences`)}>Add an experience!</button>
                        <button className="btn btn-secondary me-2 align-self-start" onClick={() => setEditForm(true)}>
                            <i className="bi bi-pencil-square"></i>
                        </button>
                        <button className="btn btn-secondary me-2 align-self-start" onClick={handleDeleteTrip}>
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            ) : (
                <p>Loading trip details...</p>
            )}
            {/* DISPLAY EXPERIENCES FROM TRIP */}
            <div className="row mt-4">
                {trip?.experiences?.map((experience) => (
                    <div className="col-md-4 mb-4 py-4" key={experience._id}>
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
                                    <label className="form-label">Location:</label>
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