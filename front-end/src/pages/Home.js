/* 
  Homepage, displays a user's recent lift routines in a paginated scrollable card view,
  and navigation to primary use-cases (e.g. drafting a new lift, viewing a specific lift, etc.)
*/

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";

import { useAuth } from "../contexts/AuthContext";
import axios from "../axios_instance";
import LiftGridContainer from "../components/LiftGridContainer";

const Home = () => {
	const { user } = useAuth();
	const [lifts, setLifts] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchLifts = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get("/lifts", {
					headers: { Authorization: `Bearer ${token}` },
					params: { limit: 12 },
				});
				setLifts(response.data);
			} catch (error) {
				console.error("Error fetching lifts:", error);
			}
		};

		fetchLifts();
	}, [user]);

	const handleLiftSelect = (lift) => {
		// Navigate to lift details page for the lift selected
		navigate(`/view-lift/${lift.id}`);
	};

	return (
		<div className="home-page">
			<div className="home-page header">
				<h2>
					Welcome Back
					{user.user_metadata.name
						? ", " + user.user_metadata.name.split(" ")[0]
						: ""}
				</h2>
				<button
					className="icon-left-button small-button icon-txt-wrapper"
					onClick={() => navigate("/create-lift")}
				>
					<FaCirclePlus
						style={{
							marginRight: "5px",
							fontSize: "1.5em",
						}}
					/>
					<h2>Create New Workout</h2>
				</button>
				<hr />
			</div>
			<div
				className="text-danger"
				style={{ marginTop: "15px", marginLeft: "20px" }}
			>
				Recent Lifts:
			</div>
			<LiftGridContainer
				ifEmptyMessage={
					<h2 style={{ alignItems: "center" }}>
						No Lifts Found! Create a Lift to Get Started!
					</h2>
				}
				items={lifts}
				onSelectCard={handleLiftSelect}
			/>
		</div>
	);
};

export default Home;
