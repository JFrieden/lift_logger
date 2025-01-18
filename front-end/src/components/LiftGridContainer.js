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
			{items.length === 0 ? (
				<h2 className="flex items-center justify-center font-bold text-center">
					{ifEmptyMessage}
				</h2>
			) : (
				<div className={"card-grid " + gridClassNames}>
					{items.map((item) => (
						<LiftCard
							lift={item}
							onClick={() => onSelectCard(item)}
							key={item.id}
						/>
					))}
				</div>
			)}
		</>
	);
};

export default LiftGridContainer;
