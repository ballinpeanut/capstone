import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  const URL = process.env.REACT_APP_URL;

  // Check if user is logged in (using your cookie + /my-trips route)
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const res = await fetch(`${URL}/api/trips/my-trips`, {
          method: "GET",
          credentials: "include",
        });
        setLoggedIn(res.ok); // 200 = logged in, 401/403 = not
      } catch (err) {
        console.error("Error checking login status:", err);
        setLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <div className="container mt-5">
      {loggedIn ? (
        // 🔐 LOGGED-IN HOME
        <>
          {/* HERO SECTION FOR LOGGED-IN USER */}
          <div className="p-5 mb-5 bg-light rounded-3 shadow-sm">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1 className="display-5 fw-bold mb-3">
                  Welcome back to Voyagr 🧭
                </h1>
                <p className="fs-5 text-muted mb-4">
                  Pick up where you left off—view your trips, add new
                  experiences, and keep building your journey.
                </p>
                <button
                  className="btn btn-primary btn-lg me-2"
                  onClick={() => navigate("/trips")}
                >
                  View trips
                </button>
                <button
                  className="btn btn-outline-primary btn-lg"
                  onClick={() => navigate("/experiences")}
                >
                  Browse experiences
                </button>
              </div>
              <div className="col-md-4 text-center d-none d-md-block">
                <span style={{ fontSize: "4rem" }}>🌍</span>
                <p className="mt-2 text-muted">Let&apos;s plan the next one.</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        // 🌐 PUBLIC / LOGGED-OUT HOME
        <>
          {/* HERO SECTION */}
          <div className="p-5 mb-5 bg-light rounded-3 shadow-sm">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1 className="display-5 fw-bold mb-3">Welcome to Voyagr 🧭</h1>
                <p className="fs-5 text-muted mb-4">
                  Track your trips, share experiences, and discover adventures
                  from travelers around the world.
                </p>
                <button
                  className="btn btn-primary btn-lg me-2"
                  onClick={() => navigate("/trips")}
                >
                  Explore trips
                </button>
                <button
                  className="btn btn-outline-primary btn-lg"
                  onClick={() => navigate("/experiences")}
                >
                  Browse experiences
                </button>
              </div>

              <div className="col-md-4 text-center d-none d-md-block">
                <span style={{ fontSize: "4rem" }}>🌍</span>
                <p className="mt-2 text-muted">
                  Your next journey starts here.
                </p>
              </div>
            </div>
          </div>

          {/* FEATURES ROW */}
          <div className="row text-center mb-5">
            <div className="col-md-4 mb-3">
              <h2 style={{ fontSize: "2.2rem" }}>✈️</h2>
              <h5 className="mt-2">Plan</h5>
              <p className="text-muted mb-0">
                Create trips and keep your adventures organized.
              </p>
            </div>
            <div className="col-md-4 mb-3">
              <h2 style={{ fontSize: "2.2rem" }}>📸</h2>
              <h5 className="mt-2">Share</h5>
              <p className="text-muted mb-0">
                Add experiences to bring your journeys to life.
              </p>
            </div>
            <div className="col-md-4 mb-3">
              <h2 style={{ fontSize: "2.2rem" }}>🧭</h2>
              <h5 className="mt-2">Discover</h5>
              <p className="text-muted mb-0">
                Browse trips for inspiration and ideas.
              </p>
            </div>
          </div>

          {/* ACCOUNT SECTION */}
          <div className="mt-5 text-center">
            <h4 className="fw-bold mb-3">Ready for your next adventure?</h4>
            <p className="text-muted mb-4">
              Already traveled with us?{" "}
              <span
                className="text-primary fw-bold"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Log in.
              </span>
              <br />
              New here?{" "}
              <span
                className="text-primary fw-bold"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/register")}
              >
                Create an account and start exploring.
              </span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
