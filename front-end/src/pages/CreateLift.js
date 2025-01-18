import React, { useState, useEffect } from "react";
import axios from "../axios_instance";
import { useNavigate, useLocation } from "react-router-dom";
import { swalBasic } from "../components/SwalCardMixins";
import { debounce } from "lodash";
import LiftGridContainer from "../components/LiftGridContainer";
import Spinner from "../components/Spinner";
import "../styles/CreateLift.css";

const CreateLift = () => {
	const navigate = useNavigate();
	const location = useLocation();

	// Retrieve the type parameter from the query string
	const params = new URLSearchParams(location.search);
	const type = params.get("type");

	const [name, setName] = useState("");
	const [date, setDate] = useState("");
	const [prevLiftList, setPrevLiftList] = useState([]);
	const [prevLift, setPrevLift] = useState(null);
	const [searchTerm, setSearchTerm] = useState(null);

	const formatDate = (date) => {
		const offset = date.getTimezoneOffset();
		const localDate = new Date(date.getTime() - offset * 60 * 1000);
		return localDate.toISOString().split("T")[0];
	};

	useEffect(() => {
		setDate(formatDate(new Date()));
	}, []);

	const handleSearch = debounce(async (term) => {
		// Query for lifts to use as template for new lift
		if (term.length >= 1) {
			const params = { search: term };
			const response = await axios.get("/lifts", {
				params,
			});
			setPrevLiftList(response.data);
		} else {
			console.log("Previous Lift Search Bar Cleared!");
			setPrevLiftList([]);
			setPrevLift(null);
		}
	}, 300);

	const handleLiftSelect = (lift) => {
		setPrevLift(lift);
		setName(lift.name);
		setPrevLiftList([]);
		//TODO
	};
	const handleCreateLift = async () => {
		try {
			const token = localStorage.getItem("token");
			const newLift = await axios.post(
				"/lifts",
				{ name, date },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			if (type === "previous") {
				const prevExercises = await axios.get(
					`/lift_logs/${prevLift.id}`
				);
				await prevExercises.data.map((exercise) => {
					return axios.post("/lift_logs", {
						lift_id: newLift.data.lift[0].id,
						movement_id: exercise.movement_id,
						movement_name: exercise.movement_name,
						sets: exercise.sets,
						reps: exercise.reps,
						weight: exercise.weight,
						notes: exercise.notes,
					});
				});
				// Proceed with navigation once the alert has finished
			}
			await new Promise((resolve) => {
				swalBasic
					.fire({
						title: `${name}\nCreated!`,
						icon: "success",
						showConfirmButton: false,
						timer: 750,
					})
					.then(resolve); // Resolve once the modal closes
			});
			navigate("/home");
		} catch (error) {
			console.error("Error creating lift:", error);
		}
	};

	return (
		<div className="create-lift">
			<h2 className="mb-2">
				{type === "previous"
					? "Create From Previous Lift"
					: "Create a New Lift"}
			</h2>
			{type === "previous" && (
				<h4>This will copy the exercises from your previous lift</h4>
			)}
			<hr></hr>
			<form
				onSubmit={(e) => {
					e.preventDefault();
				}}
				className="mt-2"
			>
				<label>
					{type === "previous" ? (
						prevLift ? (
							<div className="selected-lift-container">
								<div className="selected-lift-info">
									<span className="lift-label">
										Selected Lift:
									</span>
									<div className="lift-details">
										<span className="selected-lift-name">
											{prevLift.name}
										</span>
										<span className="selected-lift-date">
											{prevLift.date}
										</span>
									</div>
								</div>
								<button
									type="button"
									className="delete-button deselect-lift"
									onClick={() => {
										setPrevLift(null);
										setSearchTerm("");
									}}
								>
									✕
								</button>
							</div>
						) : (
							"Search Previous Lifts:"
						)
					) : (
						"Lift Name:"
					)}
					{!prevLift && (
						<div className="input-wrapper">
							<input
								type="text"
								className="default-input-box" // Add padding-left to avoid text overlapping icon
								onChange={(e) => {
									if (type === "previous") {
										setSearchTerm(e.target.value); // Update state immediately for input reflection
										handleSearch(e.target.value);
									} else {
										setName(e.target.value);
									}
								}}
								required
								placeholder={
									type === "previous"
										? "🔎︎ Search Previous Lifts by Name"
										: "Enter a New Lift Name"
								}
							/>
						</div>
					)}
				</label>
				{!prevLift &&
					(prevLiftList ? (
						<LiftGridContainer
							ifEmptyMessage={searchTerm ? "No Lifts Found!" : ""}
							items={prevLiftList}
							onSelectCard={handleLiftSelect}
						/>
					) : (
						<Spinner />
					))}

				{prevLift && (
					<div>
						New Lift Name:{" "}
						<span
							style={{
								color: "lightgray",
								fontSize: ".75rem",
								fontStyle: "italic",
							}}
						>
							(Lifts with the same name are easier to track!)
						</span>
						<input
							className="default-input-box"
							defaultValue={prevLift.name}
							onChange={(e) => setName(e.target.value)}
						></input>
					</div>
				)}

				<label>
					Date:
					<input
						type="date"
						className="default-input-box"
						value={date}
						onChange={(e) => setDate(e.target.value)}
					/>
				</label>
				<div className="flex items-center justify-center flex-col">
					<button
						type="submit"
						className={type === "previous" ? "blue-button" : ""}
						onClick={() => handleCreateLift()}
					>
						{type === "previous"
							? "Create From Previous"
							: "Create New Lift"}
					</button>
					<button
						className="delete-button"
						onClick={() => navigate("/home")}
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export default CreateLift;
