
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Resume from "./components/Resume";
import Jobs from "./components/Jobs";
import MockTests from "./components/MockTests";
import MockTestHistory from "./components/MockTestHistory";
import MockTestReview from "./components/MockTestReview";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route
                    path="/"
                    element={<Home />}
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

                <Route
                    path="/mock-tests"
                    element={
                        <ProtectedRoute>
                            <MockTests />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/mock-test-history"
                    element={
                        <ProtectedRoute>
                            <MockTestHistory />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/mock-test-history/:id/review"
                    element={
                       <ProtectedRoute>
                          <MockTestReview />
                       </ProtectedRoute>
              }
            />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
