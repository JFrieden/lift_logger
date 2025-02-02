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
	const activeStyle = { color: "slategray", fontSize: "2.5em" }; // Darkened color for active icon
	const inactiveStyle = { fontSize: "2.5em" };

	if (isMobile) {
		return (
			<>
				<div

					className="mobile-nav flex row justify-evenly fixed bottom-0 left-0 w-full py-2 h-[var(--mobile-navbar-max-height)] items-center"
					style={{
						backgroundColor: "var(--background-gray)",
						zIndex: 1000,
					}}
				>
					<AiOutlineAreaChart
						style={
							isActive("/charts") ? activeStyle : inactiveStyle
						}
						onClick={() => navigate("/charts")}
					/>
					<AiFillHome
						style={isActive("/home") ? activeStyle : inactiveStyle}
						onClick={() => navigate("/home")}
					/>
					<AiFillPlusCircle
						style={
							isActive("/create-lift")
								? activeStyle
								: inactiveStyle
						}
						onClick={openNewLiftModal}
					/>
					<PiUserFill
						style={
							isActive("/profile") ? activeStyle : inactiveStyle
						}
						onClick={() => navigate("/profile")}
					/>
				</div>
			</>
		);
	} else {
		return <></>;
	}
};

export default NavBar;
