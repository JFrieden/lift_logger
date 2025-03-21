import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	AiOutlineAreaChart,
	AiFillPlusCircle,
	AiFillHome,
} from "react-icons/ai";
import { PiUserFill } from "react-icons/pi";
import { useMediaQuery } from "react-responsive";
import { useNewLiftModal } from "../contexts/NewLiftModalContext";

const NavBar = () => {
	const isMobile = useMediaQuery({ maxWidth: 768 });
	const navigate = useNavigate();
	const location = useLocation();
	const { openNewLiftModal } = useNewLiftModal();

	const isActive = (path) => location.pathname === path;
	const activeStyle = {
		color: "slategray",
		fontSize: isMobile ? "2.5em" : "2em",
	};
	const inactiveStyle = { fontSize: isMobile ? "2.5em" : "2em" };

	const navItems = [
		{ icon: <AiOutlineAreaChart />, label: "Charts", path: "/charts" },
		{ icon: <AiFillHome />, label: "Home", path: "/home" },
		{
			icon: <AiFillPlusCircle />,
			label: "New Lift",
			action: openNewLiftModal,
		},
		{ icon: <PiUserFill />, label: "Profile", path: "/profile" },
	];

	if (isMobile) {
		return (
			<div
				className="mobile-nav flex row justify-evenly fixed bottom-0 left-0 w-full py-2 h-[var(--mobile-navbar-max-height)] items-beginning"
				style={{
					backgroundColor: "var(--background-gray)",
					zIndex: 1000,
				}}
			>
				{navItems.map(({ icon, path, action }, index) => (
					<div
						key={index}
						style={isActive(path) ? activeStyle : inactiveStyle}
						onClick={action || (() => navigate(path))}
					>
						{icon}
					</div>
				))}
			</div>
		);
	} else {
		return (
			<div
				className="desktop-nav group fixed top-0 left-0 h-full w-16 bg-[var(--background-gray)] text-white flex flex-col hover:w-40 transition-all duration-300"
				style={{
					zIndex: 1000,
				}}
			>
				{navItems.map(({ icon, label, path, action }, index) => (
					<div
						key={index}
						className="flex items-center cursor-pointer p-4 hover:bg-gray-700"
						onClick={action || (() => navigate(path))}
					>
						<div
							style={isActive(path) ? activeStyle : inactiveStyle}
						>
							{icon}
						</div>
						<span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							{label}
						</span>
					</div>
				))}
			</div>
		);
	}
};

export default NavBar;
