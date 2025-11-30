import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserRegistration from "./components/userRegistration";
import NavigationBar from "./components/navigationBar";
import Trips from "./pages/myTrips"
import UserLogin from "./pages/userLogin";
import TripDetails from "./pages/tripDetails";
import SearchResults from "./pages/SearchResults";
import AddExperience from "./pages/addExperience";
import ExperiencesPage from "./pages/experiencePage";
import ExperienceDetails from "./pages/experienceDetails";
import HomePage from "./pages/homePage";


function App() {
  return (
    <Router>
      {/* NAVIGATION BAR */}
      <NavigationBar/>

      {/* PAGES */}
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/register" element={<UserRegistration/>} />
        <Route path="/login" element={<UserLogin/>} />
        <Route path="/trips" element={<Trips/>} />
        <Route path="/trips/:tripId" element={<TripDetails/>} />
        <Route path="/experiences" element={<ExperiencesPage/>} />
        <Route path="/add-experience" element={<AddExperience/>} />
        <Route path="/experiences/:experienceId" element={<ExperienceDetails/>} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </Router>
  );
}

export default App;
