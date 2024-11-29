import React, { useState } from "react";
import axios from "../axios_instance";
import { useNavigate } from "react-router-dom";

const CreateLift = () => {
	const [name, setName] = useState("");
	const [date, setDate] = useState(new Date().toLocaleDateString()); // Default to today
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem("token");
			await axios.post(
				"/lifts",
				{ name, date },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			//   alert('Lift created successfully!');
			navigate("/home");
		} catch (error) {
			console.error("Error creating lift:", error);
		}
	};

	return (
		<div className="create-lift">
			<h2>Create a New Lift</h2>
			<form onSubmit={handleSubmit}>
				<label>
					Lift Name:
					<input
						type="text"
						className="standard-input-box"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</label>
				<label>
					Date:
					<input
						type="date"
						className="standard-input-box"
						value={date}
						onChange={(e) => setDate(e.target.value)}
					/>
				</label>
				<button type="submit">Create Lift</button>
			</form>
		</div>
	);
};

export default CreateLift;
