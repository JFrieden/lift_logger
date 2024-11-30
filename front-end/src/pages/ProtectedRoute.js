// ./pages/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "../components/Spinner";

const ProtectedRoute = ({ children }) => {
	const { user, isLoading } = useAuth();

	// Wait until isLoading is false before making a decision
	if (isLoading) return <Spinner />; // Or a loading spinner

	return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
