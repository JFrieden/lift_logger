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
import NavBar from "../components/NavBar";
import { debounce } from "lodash";
import { useMediaQuery } from "react-responsive";
import NewLiftModal from "../components/NewLiftModal";

const Home = () => {
	const { user } = useAuth();
	const [lifts, setLifts] = useState(null);
	const [searchTerm, setSearchTerm] = useState(""); // Only used for asthetic concern
	const navigate = useNavigate();
	const isMobile = useMediaQuery({ maxWidth: 768 });
	const [setCreateNewLift, createNewLift] = useState(false);

	useEffect(() => {
		const fetchLifts = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get("/lifts", {
					headers: { Authorization: `Bearer ${token}` },
					params: { limit: isMobile ? 12 : 30 },
				});
				setLifts(response.data);
			} catch (error) {
				console.error("Error fetching lifts:", error);
			}
		};

		fetchLifts();
	}, [user, isMobile]);

	const handleLiftSelect = (lift) => {
		// Navigate to lift details page for the lift selected
		navigate(`/view-lift/${lift.id}`);
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
		<>
			<div className="home-page">
				<div className="home-page header mb-2">
					<div className="flex row items-center justify-between pr-2">
						<h2>
							Welcome Back
							{user.user_metadata.name
								? ", " + user.user_metadata.name.split(" ")[0]
								: ""}
						</h2>
						{!isMobile && (
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
								<h2 className="m-0 leading-tight">
									Create New Lift
								</h2>
							</button>
						)}
					</div>

					<hr />
					{/*TODO: Update with search functionality to control what appears in the lift grid... somehow!*/}
					<input
						id="Homepage Lift Search"
						className="default-input-box mb-2"
						style={{
							border: "none",
							borderRadius: "10px",
							backgroundColor: "var(--dark-gray)",
						}}
						onChange={(e) => handleSearch(e.target.value)}
						placeholder="🔎︎ Search Lifts"
					></input>
				</div>
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
			</div>
		</>
	);
};

export default Home;
