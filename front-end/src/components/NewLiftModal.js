import React from "react";
import { useNavigate } from "react-router-dom";
import { useNewLiftModal } from "../contexts/NewLiftModalContext";

const NewLiftModal = () => {
	const navigate = useNavigate();
	const { isNewLiftModalOpen, closeNewLiftModal } = useNewLiftModal();

	if (!isNewLiftModalOpen) return null;

	const handleCreateLift = (type) => {
		// Navigate to the CreateLift page with a type parameter
		closeNewLiftModal();
		navigate(`/create-lift?type=${type}`);
	};

	return (
		<>
			<div className="modal">
				<div className="modal-content">
					<button
						className="blue-button flex items-center flex-col justify-center align-center mb-3"
						style={{ height: "10vh" }}
						onClick={() => handleCreateLift("previous")}
					>
						<h2 style={{ textAlign: "center" }}>
							Copy From a Previous Lift
						</h2>
					</button>
					<button
						className="flex items-center justify-center mt-3"
						style={{ height: "10vh" }}
						onClick={() => handleCreateLift("new")}
					>
						<h2
							style={{
								textAlign: "center",
							}}
						>
							Create a New Blank Lift
						</h2>{" "}
					</button>
					<button
						style={{ height: "5vh", fontSize: "1.5rem" }}
						className="delete-button mt-6 flex items-center justify-center"
						onClick={closeNewLiftModal}
					>
						Cancel
					</button>
				</div>
			</div>
		</>
	);
};

export default NewLiftModal;
