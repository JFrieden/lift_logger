import React, { useState } from "react";
import axios from "../axios_instance";
import { useNavigate } from "react-router-dom";

const CreateLift = () => {
	const [usePreviousLift, setUsePreviousLift] = useState(false);
	const [name, setName] = useState("");
	const formatDate = (date) => {
		const offset = date.getTimezoneOffset();
		const localDate = new Date(date.getTime() - offset * 60 * 1000);
		return localDate.toISOString().split("T")[0];
	};

	const [date, setDate] = useState(formatDate(new Date()));
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
			navigate("/home");
		} catch (error) {
			console.error("Error creating lift:", error);
		}
	};

	return (
		<div className="create-lift">
			<h2 style={{ marginBottom: "5px" }}>Create a New Lift</h2>
			<h4>Use a Previous Lift</h4>
			<hr></hr>
			<form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
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
