import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import Home from "./pages/Home";
import CreateLift from "./pages/CreateLift";
import Lift from "./pages/Lift";

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/login" element={<Login />} />
					<Route
						path="/home"
						element={
							<ProtectedRoute>
								<Home />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/create-lift"
						element={
							<ProtectedRoute>
								<CreateLift />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/view-lift/:liftId"
						element={
							<ProtectedRoute>
								<Lift />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
