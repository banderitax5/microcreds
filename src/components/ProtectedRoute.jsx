import { Navigate, useLocation } from "react-router";
import { useContext } from "react";
import { SessionContext, AuthReadyContext } from "../context/SessionContext";

const ProtectedRoute = ({ children }) => {
	const session = useContext(SessionContext);
	const authReady = useContext(AuthReadyContext);
	const location = useLocation();

	if (!authReady) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<span className="loading loading-spinner loading-lg text-[#14532d]"></span>
			</div>
		);
	}

	if (!session) {
		// Not signed in — send to sign-in page, and remember where they wanted to go
		const pageTheyWanted = location.pathname;
		const signInUrl = "/signin?redirect=" + encodeURIComponent(pageTheyWanted);
		return <Navigate to={signInUrl} replace />;
	}

	return children;
};

export default ProtectedRoute;
