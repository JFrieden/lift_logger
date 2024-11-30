//LiftDetails.js
import React, { useEffect, useState } from "react";
import axios from "../axios_instance";

import { swalConfirmCancel, swalBasic } from "./SwalCardMixins";
import { FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";

const LiftDetails = ({ liftId, reloadDetails }) => {
	const [logs, setLogs] = useState([]);

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

	return (
		<div>
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
								onClick={() =>
									console.log("Edit button clicked!")
								}
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
	);
};

export default LiftDetails;
