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
			swalBasic.fire({
				title: "Exercise Added!",
				icon: "success",
				timer: 750,
				showConfirmButton: false,
			});
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
