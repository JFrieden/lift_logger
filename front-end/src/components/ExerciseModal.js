import React, { useState, useEffect } from "react";
import { swalBasic } from "./SwalCardMixins";

const ExerciseModal = ({ isOpen, onClose, onSave, initialData }) => {
	const [log, setLog] = useState({
		id: "",
		movement_name: "",
		movement_id: "",
		sets: "",
		reps: [NaN],
		weight: [NaN],
		notes: "",
		setsError: false,
		repsErrorIdxs: [],
		weightErrorIdxs: [],
	});

	const repsErrorMessage = "Reps must be positive whole numbers.";
	const weightErrorMessage = "Weights must be positive numbers.";
	const setsErrorMessage = "Sets must be positive whole numbers.";

	const handleClose = () => {
		onClose();
	};

	useEffect(() => {
		if (isOpen) {
			setLog({
				id: initialData?.id || "",
				movement_name: initialData?.movement_name || "",
				movement_id: initialData?.movement_id || "",
				sets: initialData?.sets || 1,
				reps: initialData?.reps || [NaN],
				weight: initialData?.weight || [NaN],
				notes: initialData?.notes || "",
				setsError: false,
				repsErrorIdxs: [],
				weightErrorIdxs: [],
			});
		} else {
			// Reset the log state when modal is closed
			setLog({
				id: "",
				movement_name: "",
				sets: "",
				reps: [NaN],
				weight: [NaN],
				notes: "",
				setsError: false,
				repsErrorIdxs: [],
				weightErrorIdxs: [],
			});
		}
	}, [isOpen, initialData]);

	const isPositiveInteger = (value) => value > 0 && Number.isInteger(value);
	const isPositiveFloat = (value) => value > 0 && isFinite(value);

	const validateInputs = (
		{
			field = "all",
			updatedSets = log.sets,
			updatedReps = log.reps,
			updatedWeights = log.weight,
			nullCheck = false,
		} = {
			field: "all",
			updatedSets: log.sets,
			updatedReps: log.reps,
			updatedWeights: log.weight,
			nullCheck: true,
		}
	) => {
		let valid = true;

		if (field === "sets" || field === "all") {
			// Validate sets if sets is updated
			if (!isPositiveInteger(updatedSets)) {
				setLog((prevLog) => ({
					...prevLog,
					setsError: true,
				}));
				valid = false;
			} else {
				setLog((prevLog) => ({
					...prevLog,
					setsError: false,
					repsErrorIdxs: prevLog.repsErrorIdxs.filter(
						(item) => item < prevLog.sets
					),
					weightErrorIdxs: prevLog.weightErrorIdxs.filter(
						(item) => item < prevLog.sets
					),
				}));
			}
		}

		if (field === "reps" || field === "all") {
			// Validate each entry in reps array and record the index of invalid values

			updatedReps.forEach((num, index) => {
				if (
					!isPositiveInteger(num) &&
					(nullCheck ? true : !Number.isNaN(num))
				) {
					setLog((prevLog) => ({
						...prevLog,
						repsErrorIdxs: [...prevLog.repsErrorIdxs, index],
					}));
					valid = false;
				} else {
					setLog((prevLog) => ({
						...prevLog,
						repsErrorIdxs: prevLog.repsErrorIdxs.filter(
							(item) => item !== index && item < prevLog.sets
						),
					}));
				}
			});
		}

		if (field === "weight" || field === "all") {
			// Validate each entry in weights array and record the index of invalid values
			updatedWeights.forEach((num, index) => {
				if (
					!isPositiveFloat(num) &&
					(nullCheck ? true : !Number.isNaN(num))
				) {
					setLog((prevLog) => ({
						...prevLog,
						weightErrorIdxs: [...prevLog.weightErrorIdxs, index],
					}));
					valid = false;
				} else {
					setLog((prevLog) => ({
						...prevLog,
						weightErrorIdxs: prevLog.weightErrorIdxs.filter(
							(item) => item !== index && item < prevLog.sets
						),
					}));
				}
			});
		}

		return valid;
	};

	const handleSave = () => {
		if (validateInputs()) {
			onSave(log);
			onClose();
		} else {
			swalBasic.fire({
				title: `Error Updating\n${log.movement_name}!`,
				icon: "error",
				timer: 750,
				showConfirmButton: false,
			});
		}
	};

	const handleSetChange = (newSets) => {
		if (newSets >= 0) {
			const setChange = newSets - log.sets;
			setLog((prevLog) => ({
				...prevLog,
				sets: newSets,
				reps:
					setChange > 0
						? prevLog.reps.concat(new Array(setChange).fill(NaN))
						: prevLog.reps.slice(0, newSets),
				weight:
					setChange > 0
						? prevLog.weight.concat(new Array(setChange).fill(NaN))
						: prevLog.weight.slice(0, newSets),
			}));
		}
	};

	if (!isOpen) {
		document.body.classList.remove("modal-open");
		return <></>;
	}
	document.body.classList.add("modal-open");

	return (
		<div className="modal">
			<div className="modal-content">
				<h2>{log.movement_name || "New Exercise"}</h2>
				<label>
					Sets:
					<input
						className="default-input-box"
						type="number"
						min="1"
						defaultValue={log.sets}
						placeholder="Sets"
						onChange={(e) => {
							handleSetChange(parseInt(e.target.value, 10));
							if (e.target.value) {
								validateInputs({
									field: "sets",
									updatedSets: parseFloat(e.target.value),
								});
							}
						}}
					/>
					{log.setsError && (
						<div
							style={{
								color: "red",
								fontSize: "0.75rem",
								marginTop: "-10px",
							}}
						>
							{setsErrorMessage}
						</div>
					)}
				</label>
				{Array.from({ length: log.sets }).map((_, index) => (
					<div key={index}>
						{index === 0 && (
							<div className="flex justify-between">
								<div className="flex-1 text-center">Reps</div>
								<div className="flex-1 text-center">Weight</div>
							</div>
						)}
						<div className="flex gap-2">
							<div className="flex-1">
								<input
									className={"default-input-box mb-4 mt-0"}
									type="number"
									defaultValue={log.reps[index]}
									onChange={async (e) => {
										const newReps = [...log.reps];
										newReps[index] = parseFloat(
											e.target.value
										);
										setLog((prevLog) => ({
											...prevLog,
											reps: newReps,
										}));
										if (e.target.value) {
											validateInputs({
												field: "reps",
												updatedReps: newReps,
											});
										}
									}}
									placeholder={`Reps for Set ${index + 1}`}
								/>
								{log.repsErrorIdxs.includes(index) && (
									<div
										style={{
											color: "red",
											fontSize: "0.75rem",
											marginTop: "-16px",
										}}
									>
										{repsErrorMessage}
									</div>
								)}
							</div>
							<div className="flex-1">
								<input
									className={"default-input-box mb-4 mt-0"}
									type="number"
									defaultValue={log.weight[index]}
									onChange={async (e) => {
										e.preventDefault();
										const newWeights = [...log.weight];
										newWeights[index] = parseFloat(
											e.target.value
										);
										setLog((prevLog) => ({
											...prevLog,
											weight: newWeights,
										}));
										if (e.target.value) {
											validateInputs({
												field: "weight",
												updatedWeights: newWeights,
											});
										}
									}}
									placeholder={`Weight for Set ${index + 1}`}
								/>
								{log.weightErrorIdxs.includes(index) && (
									<div
										style={{
											color: "red",
											fontSize: "0.75rem",
											marginTop: "-16px",
										}}
									>
										{weightErrorMessage}
									</div>
								)}
							</div>
						</div>
					</div>
				))}
				<textarea
					className="default-input-box"
					style={{
						width: "100%",
						borderColor: "white",
						border: "1px solid white",
						borderRadius: "4px",
						padding: "10px",
						marginTop: "10px",
					}}
					value={log.notes}
					onChange={(e) =>
						setLog((prevLog) => ({
							...prevLog,
							notes: e.target.value,
						}))
					}
					placeholder="Notes"
				/>
				<div className="modal-buttons">
					<button onClick={handleSave}>Save</button>
					<button className="delete-button" onClick={handleClose}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default ExerciseModal;
