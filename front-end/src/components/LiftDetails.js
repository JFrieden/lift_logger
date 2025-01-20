//LiftDetails.js
import React, { useEffect, useState } from "react";
import axios from "../axios_instance";

import Spinner from "./Spinner";
import { swalConfirmCancel, swalBasic } from "./SwalCardMixins";
import { FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import "../styles/Lift.css";
import ExerciseModal from "./ExerciseModal";

const LiftDetails = ({ liftId, reloadDetails }) => {
	const [logs, setLogs] = useState(null);
	const [currentLog, setCurrentLog] = useState(null);
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		const fetchLogs = async () => {
			try {
				const response = await axios.get(`lift_logs/${liftId}`);
				setLogs(response.data);
			} catch (error) {
				console.error("Error fetching lift logs: ", error);
			}
		};

		fetchLogs();
	}, [liftId, reloadDetails]);

	const deleteLog = async (logId) => {
		swalConfirmCancel
			.fire({
				title: "Are You Sure?",
				text: "This action cannot be undone",
				showCancelButton: true,
				confirmButtonText: "Yes, delete!",
				cancelButtonText: "No, cancel!",
			})
			.then(async (result) => {
				if (result.isConfirmed) {
					try {
						await axios.delete(`/lift_logs/${logId}`);
						setLogs((prevLogs) =>
							prevLogs.filter((log) => log.id !== logId)
						);
					} catch (error) {
						console.error("Error deleting exercise: ", error);
					}
					swalBasic.fire({
						title: "Deleted!",
						icon: "success",
						showConfirmButton: false,
						timer: 750,
					});
				} else {
					swalBasic.fire({
						title: "Cancelled",
						icon: "error",
						showConfirmButton: false,
						timer: 750,
					});
				}
			});
	};

	const editLog = (logId) => {
		const logToEdit = logs.find((log) => log.id === logId);
		setCurrentLog(logToEdit);
		setIsEditing(true);
	};

	const saveLog = async (changedLog) => {
		try {
			await axios.put(`/lift_logs/${changedLog.id}`, changedLog);
			setLogs((prevLogs) =>
				prevLogs.map((log) =>
					log.id === changedLog.id ? changedLog : log
				)
			);
			setIsEditing(false);
			swalBasic.fire({
				title: "Updated!",
				icon: "success",
				showConfirmButton: false,
				timer: 750,
			});
		} catch (error) {
			console.error("Error updating log: ", error);
			swalBasic.fire({
				title: `Failed To Update!\n${error.message}`,
				icon: "error",
			});
			setIsEditing(false);
		}
	};

	return (
		<>
			{logs ? (
				<div className="exercise-list">
					{logs.map((log) => (
						<div key={log.id} className="lift-card log-entry">
							<div className="log-entry-container">
								<div>
									<h2>{log.movement_name}</h2>
									<p>
										<span className="font-bold">Sets:</span>{" "}
										{log.sets}
									</p>
									<div className="mb-2">
										<span className="font-bold">
											Reps x Weight:
										</span>
										<div style={{ textIndent: "1rem" }}>
											{log.reps.map((rep, index) => (
												<span
													key={index}
													className="reps-weight"
												>
													{rep}x{log.weight[index]}
													{index < log.reps.length - 1
														? ", "
														: ""}
												</span>
											))}
										</div>
									</div>
									<div>
										<span className="font-bold">
											Notes:
										</span>{" "}
										{log.notes}
									</div>
								</div>
								<div className="button-container">
									<button
										className="blue-button edit-button"
										onClick={() => editLog(log.id)}
									>
										<FaEdit />
									</button>
									<button
										className="delete-button delete-movement-button"
										onClick={() => deleteLog(log.id)}
									>
										<FaTrash />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<Spinner />
			)}

			<ExerciseModal
				isOpen={isEditing}
				initialData={currentLog}
				onClose={() => setIsEditing(false)}
				onSave={saveLog}
			/>

			{/* Edit Dialog
			{isEditing && (
				<div className="modal">
					<div className="modal-content">
						<h2>{currentLog.movement_name}</h2>
						<label>
							Sets:
							<input
								className="default-input-box"
								type="number"
								defaultValue={currentLog.sets}
								onChange={(e) => {
									const newSets = parseInt(
										e.target.value,
										10
									);
									const setChange = newSets - currentLog.sets;
									if (isFinite(newSets)) {
										setCurrentLog((prevState) => ({
											...prevState,
											sets: newSets,
											reps:
												setChange > 0
													? currentLog.reps.concat(
															new Array(
																setChange
															).fill("")
													  )
													: currentLog.reps.slice(
															0,
															newSets
													  ),
											weight:
												setChange > 0
													? currentLog.weight.concat(
															new Array(
																setChange
															).fill("")
													  )
													: currentLog.weight.slice(
															0,
															newSets
													  ),
										}));
									}
								}}
							/>
						</label>

						{Array.from({ length: currentLog.sets }).map(
							(_, index) => (
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
									<div className="flex gap-2">
										<input
											className={
												"default-input-box flex-1" +
												(index === 0 ? " mt-0" : "")
											}
											type="number"
											value={currentLog.reps[index] || ""}
											onChange={(e) => {
												const newReps = [
													...currentLog.reps,
												];
												newReps[index] = e.target.value;
												setCurrentLog((prevState) => ({
													...prevState,
													reps: newReps,
												}));
											}}
											placeholder={`Reps for Set ${
												index + 1
											}`}
										/>
										<input
											className={
												"default-input-box flex-1" +
												(index === 0 ? " mt-0" : "")
											}
											type="number"
											value={
												currentLog.weight[index] || ""
											}
											onChange={(e) => {
												const newWeight = [
													...currentLog.weight,
												];
												newWeight[index] =
													e.target.value;
												setCurrentLog((prevState) => ({
													...prevState,
													weight: newWeight,
												}));
											}}
											placeholder={`Weight for Set ${
												index + 1
											}`}
										/>
									</div>
								</div>
							)
						)}
						{currentLog.repsError && (
							<p style={{ color: "red", fontSize: "0.8em" }}>
								{currentLog.repsError}
							</p>
						)}

						{currentLog.weightError && (
							<p style={{ color: "red", fontSize: "0.8em" }}>
								{currentLog.weightError}
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
							value={currentLog.notes}
							onChange={(e) =>
								setCurrentLog((prevState) => ({
									...prevState,
									notes: e.target.value,
								}))
							}
							placeholder="Notes"
						/>
						<div className="modal-buttons">
							<button onClick={saveLog}>Save</button>
							<button
								className="delete-button"
								onClick={() => setIsEditing(false)}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)} */}
		</>
	);
};

export default LiftDetails;
