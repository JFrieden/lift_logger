import React, { createContext, useContext, useState } from "react";

const NewLiftModalContext = createContext();

export const useNewLiftModal = () => useContext(NewLiftModalContext);

export const NewLiftModalProvider = ({ children }) => {
	const [isNewLiftModalOpen, setIsNewLiftModalOpen] = useState(false);

	const openNewLiftModal = () => setIsNewLiftModalOpen(true);
	const closeNewLiftModal = () => setIsNewLiftModalOpen(false);

	return (
		<NewLiftModalContext.Provider
			value={{ isNewLiftModalOpen, openNewLiftModal, closeNewLiftModal }}
		>
			{children}
		</NewLiftModalContext.Provider>
	);
};
