import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function SearchResults() {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const URL = process.env.REACT_APP_URL;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search");

    if (!q) return;

    fetch(`${URL}/api/experiences/search?search=${q}`)
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((err) => console.error(err));
  }, [location.search]);

  return (
    <div className="container mt-4">
      <h2>Search Results</h2>

      {results.length === 0 && <p>No experiences found.</p>}

      <div className="row">
        {results.map((exp) => (
          <div
            key={exp._id}
            className="col-md-4 mb-4"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/experiences/${exp._id}`)}
          >
            <div className="card shadow-sm h-100">
              {exp.images?.length > 0 && (
                <img
                  src={exp.images[0]}
                  className="card-img-top"
                  alt={exp.title}
                  style={{ objectFit: "cover", height: "180px" }}
                />
              )}

              <div className="card-body">
                <h5 className="card-title">{exp.title}</h5>
                <small className="text-muted">
                  {exp.location?.name || "No location"}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
