import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NewLiftModalProvider } from "./contexts/NewLiftModalContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import Home from "./pages/Home";
import CreateLift from "./pages/CreateLift";
import Lift from "./pages/Lift";
import Charts from "./pages/Charts";
import Profile from "./pages/Profile";
import MainLayout from "./MainLayout";

function App() {
	return (
		<AuthProvider>
			<NewLiftModalProvider>
				<Router>
					<Routes>
						<Route element={<MainLayout />}>
							<Route
								path="/home"
								element={
									<ProtectedRoute>
										<Home />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/charts"
								element={
									<ProtectedRoute>
										<Charts />
									</ProtectedRoute>
								}
							></Route>
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
							<Route
								path="/profile"
								element={
									<ProtectedRoute>
										<Profile />
									</ProtectedRoute>
								}
							/>
						</Route>
						<Route path="/" element={<LandingPage />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="/login" element={<Login />} />
					</Routes>
				</Router>
			</NewLiftModalProvider>
		</AuthProvider>
	);
}

export default App;
