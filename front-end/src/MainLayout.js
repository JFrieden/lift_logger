import { Outlet } from "react-router-dom";
import Navbar from "./components/NavBar";
import NewLiftModal from "./components/NewLiftModal";

const MainLayout = () => {
	return (
		<div className="pb-[var(--mobile-navbar-max-height)]">
			<Navbar />
			<NewLiftModal />
			<Outlet />
		</div>
	);
};

export default MainLayout;
