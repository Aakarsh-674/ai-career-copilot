import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Resume from "./components/Resume";
import Jobs from "./components/Jobs";

function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

    <Route
        path="/"
        element={<h1>AI Career Copilot</h1>}
    />

    <Route
        path="/register"
        element={<Register />}
    />

    <Route
        path="/login"
        element={<Login />}
    />

    <Route
        path="/dashboard"
        element={
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        }
    />

    <Route
        path="/profile"
        element={<Profile />}
    />

    <Route
        path="/resume"
        element={<Resume />}
    />

    <Route 
        path="/jobs" 
        element={
            <ProtectedRoute>
                <Jobs />
            </ProtectedRoute>
        } 
    /> 

</Routes>

        </BrowserRouter>
    );
}

export default App;