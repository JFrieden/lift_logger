const getCssVariable = (variableName) => {
	return getComputedStyle(document.documentElement).getPropertyValue(
		variableName
	);
};

export default getCssVariable;
