//LiftDetails.js
import React, { useEffect, useState, useRef } from "react";
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

	const listRef = useRef(null);

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
		<div>
			{logs ? (
				<div className="exercise-list" ref={listRef}>
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
		</div>

	);
};

export default LiftDetails;
