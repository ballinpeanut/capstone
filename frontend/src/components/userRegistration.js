import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserRegistration() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const URL = process.env.REACT_APP_URL;

    const handleSubmit = async (event) => {
        event.preventDefault();

        {/* HANDLES FORM SUBMISSION FOR USER REGISTRATION. POST REQUEST SENT TO BACKEND. */}
        try{
            const response = await fetch(`${URL}/api/users/register`, {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({username, email, password}),
              credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
              alert("Account successfully created!");
              console.log("Success:", data);
              setUsername("");
              setEmail("");
              setPassword("");

              navigate("/");
            } else {
              alert(data.message || "Something went wrong");
              console.error("Error:", data);
            }
          } catch (error) {
            console.error("Fetch error:", error);
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            alert("An issue with the server has occurred: " + error.message);
          }
    };

    return (
        <div className="container d-flex justify-content-center" style={{marginTop: "200px"}}>
        {/* USER REGISTRATION FORM: USERNAME, EMAIL, PASSWORD */}
        <div className="card p-4 shadow" style={{maxWidth: "400px"}}>
            <h1 className="mb-4 text-center">Create your account</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="usernameInput" className="form-label">Username</label>
                <input
                 type="text"
                 class="form-control"
                 id="usernameInput"
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}/>
              </div>

              <div class="mb-3">
                  <label htmlFor="emailInput" className="form-label">Email address</label>
                  <input
                  type="email"
                  class="form-control"
                  id="emailInput"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}/>

                  <div id="emailPrivacy" className="form-text">We'll never share your email with anyone else.</div>
            </div>

            <div class="mb-3">
                <label for="passwordInput" className="form-label">Password</label>
                <input
                type="password"
                class="form-control"
                id="passwordInput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>

                <div id="passwordDetails" className="form-text">Must include:</div>
                <ul class="mb-0 small">
                <li>At least 8 characters</li>
                <li>At least one capital letter</li>
                <li>At least one special character</li>
                </ul>
            </div>

            <button type="submit" className="btn btn-primary">Submit</button>
              </form>
        </div>
    </div>
    );
}

export default UserRegistration;