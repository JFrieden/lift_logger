// LiftPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios_instance";

import Spinner from "../components/Spinner";
import { swalBasic, swalConfirmCancel } from "../components/SwalCardMixins";
import { FaTrash } from "react-icons/fa"; // Importing FontAwesome trashcan icon
import AddMovementForm from "../components/AddMovementForm";
import LiftDetails from "../components/LiftDetails";

import "../styles/LiftCard.css";
import "../styles/Lift.css";

const LiftPage = () => {
	const { liftId } = useParams();
	const [lift, setLift] = useState(null);
	const [reloadDetails, setReloadDetails] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchLift = async () => {
			try {
				const response = await axios.get(`/lifts/${liftId}`);
				setLift(response.data);
			} catch (error) {
				console.error("Error fetching lift details:", error);
			}
		};

		fetchLift();
	}, [liftId]);

	// DELETE Lift
	const deleteLift = async () => {
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
						await axios.delete(`/lifts/${liftId}`);
						navigate("/home");
					} catch (error) {
						console.error("Error deleting lift: ", error);
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

	const handleMovementAdded = () => {
		setReloadDetails((prev) => !prev);
	};

	return (
		<div className="lift-details-page">
			{lift ? (
				<>
					<div className="lift-header">
						<div className="lift-header-container">
							<div>
								<h1>{lift.name}</h1>
								<div className="lift-date">{lift.date}</div>
							</div>
							<button
								onClick={deleteLift}
								className="delete-lift-btn"
							>
								<FaTrash /> {/* Trashcan icon */}
							</button>
						</div>
					</div>
					<hr></hr>
					<AddMovementForm
						liftId={liftId}
						onMovementAdded={handleMovementAdded}
					/>
					<LiftDetails
						liftId={liftId}
						reloadDetails={reloadDetails}
					/>
				</>
			) : (
				<Spinner />
			)}
		</div>
	);
};

export default LiftPage;
