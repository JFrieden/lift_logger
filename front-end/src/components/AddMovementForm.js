import React, { useState } from "react";
import axios from "../axios_instance";
import { FaCirclePlus } from "react-icons/fa6";
import { swalBasic } from "./SwalCardMixins";
import { debounce } from "lodash";

const AddMovementForm = ({ liftId, onMovementAdded }) => {
	// Grouping state into one object for better manageability
	const [formData, setFormData] = useState({
		addingMovement: false,
		creatingMovement: false,
		searchTerm: "",
		movements: [],
		selectedMovement: null,
		sets: "",
		reps: "",
		weight: "",
		notes: "",
		setsError: "",
		repsError: "",
		weightError: "",
	});

	// Reset all form data to initial state
	const resetFormData = () => {
		setFormData({
			addingMovement: false,
			creatingMovement: false,
			newMovementName: "",
			searchTerm: "",
			movements: [],
			selectedMovement: null,
			sets: "",
			reps: "",
			weight: "",
			notes: "",
			setsError: "",
			repsError: "",
			weightError: "",
		});
	};
	// Handle adding a movement (show movement form workflow)
	const changeAddingMovement = () => {
		setFormData((prevState) => ({
			...prevState,
			addingMovement: !prevState.addingMovement,
		}));

		if (formData.addingMovement) {
			resetFormData(); // Reset all form fields when canceling
		}
	};

	const handleNewExerciseNameChange = (movementName) => {
		setFormData((prevState) => ({
			...prevState,
			newMovementName: movementName,
		}));
	};

	const handleSubmitNewExercise = async () => {
		if (formData.newMovementName.trim() === "") {
			alert("Please provide a valid name for the new exercise.");
			return;
		}
		try {
			const response = await axios.post("/movements", {
				name: formData.newMovementName.trim(),
			});

			const newMovement = response.data.movement;

			setFormData((prevState) => ({
				...prevState,
				creatingMovement: false,
				searchTerm: newMovement.name,
			}));
			handleSearch(formData.searchTerm);
		} catch (error) {
			console.error("Error creating new movement: ", error);
			if (error.status === 409) {
				swalBasic.fire({
					text: `Error Creating ${formData.newMovementName}: ${error.response.data.error}`,
				});
			} else {
				swalBasic.fire("Failure Creating New Exercise: ", error.status);
			}
		}
	};

	const handleSearch = debounce(async (term) => {
		if (term.length > 2) {
			const response = await axios.get("/movements", {
				params: { search: term },
			});
			setFormData((prevState) => ({
				...prevState,
				movements: response.data,
			}));
		} else if (term.length === 0) {
			setFormData((prevState) => ({
				...prevState,
				movements: [],
			}));
		}
	}, 300);

	// Immediately update the searchTerm on every keystroke
	const handleSearchChange = (e) => {
		const term = e.target.value;
		setFormData((prevState) => ({
			...prevState,
			searchTerm: term,
		}));
		handleSearch(term); // This will debounce the actual API call
	};

	// Handle selecting a movement from search results
	const selectMovement = (movement) => {
		setFormData((prevState) => ({
			...prevState,
			selectedMovement: movement,
			movements: [],
		}));
	};

	// Validation for positive num types
	const isValidInteger = (value) =>
		parseInt(value) - parseFloat(value) === 0 && parseInt(value) > 0;
	const isValidFloat = (value) => !isNaN(value) && parseFloat(value) > 0;

	const validateInputs = () => {
		let valid = true;
		const newErrors = {
			setsError: "",
			repsError: "",
			weightError: "",
		};

		if (!isValidInteger(formData.sets)) {
			newErrors.setsError = "Sets must be a positive whole number.";
			valid = false;
		}

		if (!isValidInteger(formData.reps)) {
			newErrors.repsError = "Reps must be a positive whole number.";
			valid = false;
		}

		if (!isValidFloat(formData.weight)) {
			newErrors.weightError = "Weight must be a positive number.";
			valid = false;
		}

		setFormData((prevState) => ({
			...prevState,
			...newErrors,
		}));

		return valid;
	};

	// Handle form submission
	const handleSubmitLog = async (e) => {
		e.preventDefault();

		if (formData.selectedMovement && validateInputs()) {
			const newLiftLog = {
				movement_id: formData.selectedMovement.id,
				movement_name: formData.selectedMovement.name,
				lift_id: liftId,
				sets: parseInt(formData.sets),
				reps: parseInt(formData.reps),
				weight: parseFloat(formData.weight),
				notes: formData.notes,
			};

			const response = await axios.post("/lift_logs", newLiftLog);
			onMovementAdded(response.data.lift_log);
			resetFormData();
		}
	};

	return (
		<div>
			{!formData.addingMovement && (
				<button
					className="icon-left-button blue-button small-button icon-txt-wrapper inline-flex items-center"
					onClick={changeAddingMovement}
				>
					<FaCirclePlus
						className="self-center"
						style={{ marginRight: "5px", fontSize: "1.5em" }}
					/>
					<h2 className="m-0 leading-tight">Add an Exercise </h2>
				</button>
			)}
			{formData.addingMovement && !formData.creatingMovement && (
				<input
					className="default-input-box"
					type="text"
					value={formData.searchTerm}
					onChange={handleSearchChange}
					placeholder="🔎︎ Search Existing Exercises..."
				/>
			)}

			<div>
				<ul style={{ padding: "0" }}>
					{formData.movements.map((movement) => (
						<li
							className="lift-card"
							style={{ margin: "10px 0" }}
							key={movement.id}
							onClick={() => selectMovement(movement)}
						>
							<h2>{movement.name}</h2>
						</li>
					))}
				</ul>
			</div>

			{formData.selectedMovement && (
				<div className="movement-form">
					<h3>{formData.selectedMovement.name}</h3>
					<input
						className="default-input-box"
						type="number"
						value={formData.sets}
						onChange={(e) =>
							setFormData((prevState) => ({
								...prevState,
								sets: e.target.value,
							}))
						}
						placeholder="Sets"
					/>
					{formData.setsError && (
						<p style={{ color: "red", fontSize: "0.8em" }}>
							{formData.setsError}
						</p>
					)}
					<input
						className="default-input-box"
						type="number"
						value={formData.reps}
						onChange={(e) =>
							setFormData((prevState) => ({
								...prevState,
								reps: e.target.value,
							}))
						}
						placeholder="Reps"
					/>
					{formData.repsError && (
						<p style={{ color: "red", fontSize: "0.8em" }}>
							{formData.repsError}
						</p>
					)}
					<input
						className="default-input-box"
						type="number"
						value={formData.weight}
						onChange={(e) =>
							setFormData((prevState) => ({
								...prevState,
								weight: e.target.value,
							}))
						}
						placeholder="Weight"
					/>
					{formData.weightError && (
						<p style={{ color: "red", fontSize: "0.8em" }}>
							{formData.weightError}
						</p>
					)}
					<input
						className="default-input-box"
						type="text"
						value={formData.notes}
						onChange={(e) =>
							setFormData((prevState) => ({
								...prevState,
								notes: e.target.value,
							}))
						}
						placeholder="Notes"
					/>
				</div>
			)}

			{formData.creatingMovement && (
				<div>
					<input
						className="default-input-box"
						type="text"
						value={formData.newMovementName}
						placeholder="Enter New Exercise Name"
						onChange={(e) =>
							handleNewExerciseNameChange(e.target.value)
						}
					/>
				</div>
			)}

			{/* Contains the buttons for all adding exercise options. 
            Only Cancel and one other button shoud be visible at a time */}
			<div className="flex flex-col items-center">
				{formData.addingMovement &&
					!formData.creatingMovement &&
					!formData.selectedMovement && (
						<button
							onClick={() => {
								resetFormData();
								setFormData((prevState) => ({
									...prevState,
									addingMovement: true,
									creatingMovement: true,
								}));
							}}
							className="blue-button span-button"
						>
							Create New Exercise
						</button>
					)}
				{formData.creatingMovement && (
					<button onClick={handleSubmitNewExercise}>
						Save Exercise
					</button>
				)}
				{formData.selectedMovement && (
					<button onClick={handleSubmitLog}>Add Exercise</button>
				)}
				{formData.addingMovement && (
					<button
						onClick={changeAddingMovement}
						className="delete-button"
					>
						Cancel
					</button>
				)}
			</div>
			{formData.movements.length > 0 && <hr></hr>}
		</div>
	);
};
export default AddMovementForm;
