import React from "react";
import "../styles/LiftCard.css";

const LiftCard = ({ lift, onClick }) => {
	return (
		<div className="lift-card" onClick={onClick} key={lift.key}>
			<h2 className="lift-name">{lift.name}</h2>
			<p className="lift-date">
				{new Date(lift.date).toISOString().slice(0, 10)}
			</p>
		</div>
	);
};

export default LiftCard;
