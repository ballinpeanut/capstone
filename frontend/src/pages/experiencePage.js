import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ExperiencesPage() {
    const [experiences, setExperiences] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await fetch("http://localhost:5555/api/experiences");
                const data = await response.json();
                setExperiences(data);
            } catch (error) {
                console.error("Error fetching experiences.", error);
            }
        };
        fetchExperiences();
    }, [location.state?.refresh]);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Experiences</h2>
            {experiences.length === 0 && (
                <p>No experiences found.</p>
            )}
            <div className="row">
                {experiences.map((experience) => (
                    <div key={experience._id}
                     className="col-md-4 mb-4"
                     onClick={() => navigate(`/experiences/${experience._id}`)}
                     style={{cursor: "pointer"}}>
                        <div className="card shadow-sm h-100">
                            {experience.images?.length > 0 && (
                                <img
                                    src={experience.images[0]}
                                    className="card-img-top"
                                    alt={experience.title}
                                    style={{ objectFit: "cover", height: "180px"}}
                                />
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{experience.title}</h5>
                                <small className="text-muted">
                                    {experience.location?.name || "No location"}
                                </small>
                            </div>
                        </div>
                    </div>
                ))}
                {user && (
                    <div className="col-md-4 mb-4">
                    <div
                        className="card shadow-sm h-100 d-flex align-items-center justify-content-center"
                        style={{cursor: "pointer", fontSize: "2rem" }}
                        onClick={() => navigate("/add-experience")}
                    >
                        <span>+</span>
                    </div>
                </div>
                )}
            </div>
        </div>
    )
}

export default ExperiencesPage;