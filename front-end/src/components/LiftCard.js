import React from "react";
import "../styles/LiftCard.css";
import { BsThreeDots } from "react-icons/bs";

const LiftCard = ({ lift, onClick }) => {
	return (
		<div className="lift-card" onClick={onClick} key={lift.key}>
			<div>
				<h2 className="lift-name">{lift.name}</h2>
				<p className="lift-date">
					{new Date(lift.date).toISOString().slice(0, 10)}
				</p>
			</div>
			<div className="three-dots-container">
				<BsThreeDots style={{ fontSize: "1.5em" }} />
			</div>
		</div>
	);
};

export default LiftCard;
