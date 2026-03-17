import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Register from "./pages/Register";
import SignIn from "./pages/Signin";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Ticket from "./pages/Ticket";
import AdminHome from "./pages/admin/AdminHome";
import ManageEvents from "./pages/admin/ManageEvents";
import EventDetails from "./pages/admin/EventDetails";
import CreateEvent from "./pages/admin/CreateEvent";
import CheckInDesk from "./pages/admin/CheckInDesk";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import supabase from "./utils/supabase";
import { useEffect, useState } from "react";
import { SessionContext, AuthReadyContext } from "./context/SessionContext";

function App() {
	const [session, setSession] = useState(null);
	const [authReady, setAuthReady] = useState(false);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setAuthReady(true);
		});
		const { data } = supabase.auth.onAuthStateChange((event, session) => {
			setSession(session);
			setAuthReady(true);
		});

		return () => data.subscription.unsubscribe();
	}, []);

	return (
		<SessionContext.Provider value={session}>
			<AuthReadyContext.Provider value={authReady}>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/register" element={<Register />} />
				<Route path="/signin" element={<SignIn />} />
				<Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
				<Route path="/events/:eventId" element={<ProtectedRoute><EventDetail /></ProtectedRoute>} />
				<Route path="/ticket/:registrationId" element={<ProtectedRoute><Ticket /></ProtectedRoute>} />
				<Route path="/admin" element={<AdminRoute><AdminHome /></AdminRoute>} />
				<Route path="/manage-events" element={<AdminRoute><ManageEvents /></AdminRoute>} />
				<Route path="/manage-events/create" element={<AdminRoute><CreateEvent /></AdminRoute>} />
				<Route path="/manage-events/:eventId" element={<AdminRoute><EventDetails /></AdminRoute>} />
				<Route path="/manage-events/:eventId/edit" element={<AdminRoute><CreateEvent /></AdminRoute>} />
				<Route path="/check-in-desk/:eventId" element={<AdminRoute><CheckInDesk /></AdminRoute>} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
			</AuthReadyContext.Provider>
		</SessionContext.Provider>
	);
}

export default App;
