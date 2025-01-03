//LiftDetails.js
import React, { useEffect, useState } from "react";
import axios from "../axios_instance";

import { swalConfirmCancel, swalBasic } from "./SwalCardMixins";
import { FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import "../styles/Lift.css";

const LiftDetails = ({ liftId, reloadDetails }) => {
	const [logs, setLogs] = useState([]);
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

	const saveLog = async (logId) => {
		console.log("Saving updates for:", currentLog.id);
		try {
			await axios.put(`/lift_logs/${currentLog.id}`, currentLog);
			setLogs((prevLogs) =>
				prevLogs.map((log) =>
					log.id === currentLog.id ? currentLog : log
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
		}
	};

	return (
		<>
			<div className="exercise-list">
				{logs.map((log) => (
					<div key={log.id} className="lift-card log-entry">
						<div className="log-entry-container">
							<div>
								<h2>{log.movement_name}</h2>
								<p>Sets: {log.sets}</p>
								<p>Reps: {log.reps}</p>
								<p>Weight: {log.weight}</p>
								<p>Notes: {log.notes}</p>
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

			{/* Edit Dialog */}
			{isEditing && (
				<div className="modal">
					<div className="modal-content">
						<h2>{currentLog.movement_name}</h2>
						<label>
							Sets:
							<input
								className="standard-input-box"
								type="number"
								value={currentLog.sets}
								onChange={(e) =>
									setCurrentLog({
										...currentLog,
										sets: e.target.value,
									})
								}
							/>
						</label>
						<label>
							Reps:
							<input
								className="standard-input-box"
								type="number"
								value={currentLog.reps}
								onChange={(e) =>
									setCurrentLog({
										...currentLog,
										reps: e.target.value,
									})
								}
							/>
						</label>
						<label>
							Weight:
							<input
								className="standard-input-box"
								type="number"
								value={currentLog.weight}
								onChange={(e) =>
									setCurrentLog({
										...currentLog,
										weight: e.target.value,
									})
								}
							/>
						</label>
						<label>
							Notes:
							<br></br>
							<textarea
								className="standard-input-box"
								style={{ borderColor: "white" }}
								value={currentLog.notes}
								onChange={(e) =>
									setCurrentLog({
										...currentLog,
										notes: e.target.value,
									})
								}
							/>
						</label>
						<div className="modal-buttons">
							<button
								className="delete-button"
								onClick={() => setIsEditing(false)}
							>
								Cancel
							</button>
							<button onClick={saveLog}>Save</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default LiftDetails;
