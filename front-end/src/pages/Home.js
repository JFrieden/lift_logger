/*
  Homepage, displays a user's recent lift routines in a paginated scrollable card view,
  and navigation to primary use-cases (e.g. drafting a new lift, viewing a specific lift, etc.)
*/

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";
import Spinner from "../components/Spinner";

import { useAuth } from "../contexts/AuthContext";
import axios from "../axios_instance";
import LiftGridContainer from "../components/LiftGridContainer";
import { debounce } from "lodash";

const Home = () => {
	const { user } = useAuth();
	const [lifts, setLifts] = useState(null);
	const [createNewLift, setCreateNewLift] = useState(false);
	const [searchTerm, setSearchTerm] = useState(""); // Only used for asthetic concern
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

	const handleCreateLift = (type) => {
		// Navigate to the CreateLift page with a type parameter
		navigate(`/create-lift?type=${type}`);
	};

	const handleSearch = debounce(async (term) => {
		// Update the lifts displayed on the home page to match search
		const params = { search: term };

		if (!term) {
			params.limit = 12;
		} else {
			params.limit = 36;
		}

		const response = await axios.get("/lifts", {
			params,
		});
		setLifts(response.data);
		setSearchTerm(term);
	}, 200);

	return (
		<div className="home-page">
			<div className="home-page header" style={{ marginBottom: "10px" }}>
				<h2>
					Welcome Back
					{user.user_metadata.name
						? ", " + user.user_metadata.name.split(" ")[0]
						: ""}
				</h2>

				<button
					className="icon-left-button small-button icon-txt-wrapper inline-flex items-center"
					onClick={() => setCreateNewLift(true)}
				>
					<FaCirclePlus
						style={{
							marginRight: "5px",
							fontSize: "1.5em", // You can adjust the size of the icon here if needed
						}}
						className="self-center"
					/>
					<h2 className="m-0 leading-tight">Create New Lift</h2>
				</button>
				<hr />
			</div>
			{<div>Recent Lifts:</div>}
			{/*TODO: Update with search functionality to control what appears in the lift grid... somehow!*/}
			<input
				id="Homepage Lift Search"
				className="default-input-box"
				style={{
					marginTop: "0px",
					// border: "1px white solid",
					border: "none",
					borderRadius: "10px",
					backgroundColor: "var(--dark-gray)",
				}}
				onChange={(e) => handleSearch(e.target.value)}
				placeholder="🔎︎ Search Lifts"
			></input>

			{lifts ? (
				<LiftGridContainer
					ifEmptyMessage={
						searchTerm
							? "No Lifts Found!"
							: "No Lifts Found! Create a Lifts to Get Started!"
					}
					items={lifts}
					onSelectCard={handleLiftSelect}
				/>
			) : (
				<Spinner />
			)}

			{createNewLift && (
				<div className="modal">
					<div className="modal-content">
						<button
							className="blue-button flex items-center flex-col justify-center align-center mb-3"
							style={{ height: "10vh" }}
							onClick={() => handleCreateLift("previous")}
						>
							<h2 style={{ textAlign: "center" }}>
								Copy From a Previous Lift
							</h2>
						</button>
						<button
							className="flex items-center justify-center mt-3"
							style={{ height: "10vh" }}
							onClick={() => handleCreateLift("new")}
						>
							<h2
								style={{
									textAlign: "center",
								}}
							>
								Create a New Blank Lift
							</h2>{" "}
						</button>
						<button
							style={{ height: "5vh", fontSize: "1.5rem" }}
							className="delete-button mt-6 flex items-center justify-center"
							onClick={() => setCreateNewLift(false)}
						>
							Cancel
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Home;
