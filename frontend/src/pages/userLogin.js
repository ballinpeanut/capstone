import React, { useState } from "react";
import { useNavigate  } from "react-router-dom";

function UserLogin() {
    const [email, enterEmail] = useState("");
    const [password, enterPassword] = useState("");
    const navigate = useNavigate();

    const URL = process.env.REACT_APP_URL;

    const handleSubmit = async (event) => {
        event.preventDefault();

        try{
            const response = await fetch(`${URL}/api/users/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password}),
                // allow browser to send cookies
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                alert("You have successfully logged in!");
                console.log("Success:", data);

                localStorage.setItem("token", data.token);      // JWT 
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.href = "/";

                enterEmail("");
                enterPassword("");
                navigate("/");
            } else {
                alert(data.message || "Something went wrong. Try again.");
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
        {/* USER LOGIN FORM: EMAIL, PASSWORD REQUIRED */}
        <div className="card p-4 shadow" style={{maxWidth: "400px"}}>
            <h1 className="mb-4 text-center">Welcome Back!</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">Email</label>
                <input
                 type="text"
                 class="form-control"
                 id="emailInput"
                 value={email}
                 onChange={(e) => enterEmail(e.target.value)}/>
              </div>

            <div class="mb-3">
                <label for="passwordInput" className="form-label">Password</label>
                <input
                type="password"
                class="form-control"
                id="passwordInput"
                value={password}
                onChange={(e) => enterPassword(e.target.value)}/>
            </div>

            <button type="submit" className="btn btn-primary mt-4">Let's go!</button>
              </form>
        </div>
    </div>
    );
}

export default UserLogin;