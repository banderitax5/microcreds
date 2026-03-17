import { Navigate, useLocation } from "react-router";
import { useContext } from "react";
import { SessionContext, AuthReadyContext } from "../context/SessionContext";
import { useProfile } from "../hooks/useProfile";

const AdminRoute = ({ children }) => {
	const session = useContext(SessionContext);
	const authReady = useContext(AuthReadyContext);
	const location = useLocation();
	const { profile, loading } = useProfile(session?.user?.id);

	if (!authReady) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<span className="loading loading-spinner loading-lg text-[#14532d]"></span>
			</div>
		);
	}

	if (!session) {
		const redirectTo = location.pathname;
		const signInUrl = "/signin?redirect=" + encodeURIComponent(redirectTo);
		return <Navigate to={signInUrl} replace />;
	}

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<span className="loading loading-spinner loading-lg text-[#14532d]"></span>
			</div>
		);
	}

	if (profile?.role !== "admin") {
		return <Navigate to="/" replace />;
	}

	return children;
};

export default AdminRoute;
