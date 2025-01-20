import React, { useState } from "react";
import axios from "../axios_instance";
import { FaCirclePlus } from "react-icons/fa6";
import { swalBasic } from "./SwalCardMixins";
import { debounce } from "lodash";
import ExerciseModal from "./ExerciseModal";

const AddMovementForm = ({ liftId, onMovementAdded }) => {
	// Grouping state into one object for better manageability
	const [formData, setFormData] = useState({
		addingMovement: false,
		creatingMovement: false,
		searchTerm: "",
		movements: [],
		selectedMovement: null,
	});

	// Reset all form data to initial state
	const resetFormData = () => {
		setFormData({
			addingMovement: false,
			creatingMovement: false,
			searchTerm: "",
			movements: [],
			selectedMovement: null,
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
		console.log(movement);
		setFormData((prevState) => ({
			...prevState,
			selectedMovement: movement,
			movements: [],
		}));
	};

	// Handle form submission
	const handleSubmitLog = async (log) => {
		if (formData.selectedMovement) {
			const newLiftLog = {
				movement_id: log.movement_id,
				movement_name: log.movement_name,
				lift_id: liftId,
				sets: parseInt(log.sets),
				reps: log.reps,
				weight: log.weight,
				notes: log.notes,
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

			<ExerciseModal
				isOpen={formData.selectedMovement}
				onClose={() => resetFormData()}
				onSave={(log) => handleSubmitLog(log)}
				initialData={{
					movement_id: formData.selectedMovement?.id || "",
					movement_name: formData.selectedMovement?.name || "",
					sets: 1,
				}}
			/>

			{/* {formData.selectedMovement && (
				<div className="movement-form">
					<h3>{formData.selectedMovement.name}</h3>
					<input
						className="default-input-box"
						type="number"
						inputMode="numeric"
						min="1"
						value={formData.sets}
						onChange={(e) => {
							const sets = parseInt(e.target.value, 10);
							if (isFinite(sets)) {
								setFormData((prevState) => ({
									...prevState,
									sets: sets,
									reps: Array(sets).fill(""),
									weight: Array(sets).fill(""),
								}));
							} else {
								setFormData((prevState) => ({
									...prevState,
									sets: "",
									reps: "",
									weight: "",
								}));
							}
						}}
						placeholder="Sets"
					/>
					{formData.setsError && (
						<p style={{ color: "red", fontSize: "0.8em" }}>
							{formData.setsError}
						</p>
					)}
					{Array.from({ length: formData.sets }).map((_, index) => (
						<div key={index}>
							{index === 0 && (
								<div className="flex justify-between">
									<div className="flex-1 text-center">
										Reps
									</div>
									<div className="flex-1 text-center">
										Weight
									</div>
								</div>
							)}
							<div className="flex space-x-2">
								<input
									className="default-input-box flex-1"
									type="number"
									inputMode="numeric"
									min="1"
									value={formData.reps[index] || ""}
									onChange={(e) => {
										const newReps = [...formData.reps];
										newReps[index] = e.target.value;
										setFormData((prevState) => ({
											...prevState,
											reps: newReps,
										}));
									}}
									placeholder={`Reps for Set ${index + 1}`}
								/>
								<input
									className="default-input-box flex-1"
									type="number"
									min="0"
									inputMode="decimal"
									value={formData.weight[index] || ""}
									onChange={(e) => {
										const newWeight = [...formData.weight];
										newWeight[index] = e.target.value;
										setFormData((prevState) => ({
											...prevState,
											weight: newWeight,
										}));
									}}
									placeholder={`Weight for Set ${index + 1}`}
								/>
							</div>
						</div>
					))}
					{formData.repsError && (
						<p style={{ color: "red", fontSize: "0.8em" }}>
							{formData.repsError}
						</p>
					)}

					{formData.weightError && (
						<p style={{ color: "red", fontSize: "0.8em" }}>
							{formData.weightError}
						</p>
					)} 
					<textarea
						className="default-input-box"
						type="text"
						style={{
							width: "100%",
							borderColor: "white",
							border: "1px solid white",
							borderRadius: "4px",
							padding: "10px",
							marginTop: "10px",
							height: "fit-content",
						}}
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
                */}

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
