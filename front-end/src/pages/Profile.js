import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { TbLogout } from "react-icons/tb";

const Profile = () => {
	const { logout } = useAuth();
	const navigate = useNavigate();

	return (
		<>
			<button
				className="blue-button max-w-[250px] w-[60vw]"
				onClick={() => {
					logout();
					navigate("/");
				}}
			>
				<div>
					<h2 className="flex row items-end justify-between">
						Logout <TbLogout style={{ fontSize: "1.5em" }} />
					</h2>
				</div>
			</button>
			<div className="text-gray-500 text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				Additional profile stuff coming soon to a lifting app near you!
			</div>
		</>
	);
};

export default Profile;
