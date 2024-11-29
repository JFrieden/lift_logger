import React from "react";
import LiftCard from "./LiftCard";

const LiftGridContainer = ({
	ifEmptyMessage,
	items,
	onSelectCard,
	gridClassNames = "",
}) => {
	return (
		<>
			{items.length === 0 && ifEmptyMessage}
			<div className={"card-grid " + gridClassNames}>
				{items.map((item) => (
					<LiftCard lift={item} onClick={() => onSelectCard(item)} />
				))}
			</div>
		</>
	);
};

export default LiftGridContainer;
