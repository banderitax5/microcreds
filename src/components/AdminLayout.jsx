import React from "react";
import { NavLink, useNavigate } from "react-router";
import supabase from "../utils/supabase";
import { SessionContext } from "../context/SessionContext";
import { useContext } from "react";
import { useProfile } from "../hooks/useProfile";
import AdminNavLink from "./AdminNavLink";

const AdminLayout = ({ children }) => {
	const session = useContext(SessionContext);
	const { profile } = useProfile(session?.user?.id);
	const navigate = useNavigate();

	const handleSignout = async () => {
		await supabase.auth.signOut();
		navigate("/");
	};

	const initials = profile
		? `${profile?.firstname?.[0] || ""}${profile?.lastname?.[0] || ""}`.toUpperCase() || "A"
		: "?";

	return (
		<div className="flex min-h-screen bg-base-200">
			{/* Sidebar */}
			<aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
				<div className="p-6 border-b border-white/10">
					<h1 className="text-2xl font-bold"><img src="https://upload.wikimedia.org/wikipedia/commons/e/e2/RecoveryLogo.png" alt="" className="h-8 w-auto border-2" /></h1>
					<p className="text-sm text-white/80">Admin Portal</p>
				</div>

				<nav className="flex-1 p-4 space-y-2">
					<AdminNavLink
						to="/admin"
						linkText="Home"
						end
						icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
						</svg>}
					>
					</AdminNavLink>
					<AdminNavLink
						to="/manage-events"
						linkText="Manage Events"
						icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>}
					>
					</AdminNavLink>
				</nav>

				<button
					onClick={() => navigate("/")}
					className="btn btn-neutral bg-transparent text-white/90 hover:bg-white/10 transition">
					Back
				</button>

				<div className="p-4 border-t border-white/10">

					<div className="flex items-center gap-3 mb-3">
						<div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold">
							{initials}
						</div>
						<div className="flex-1 min-w-0">
							<p className="font-medium truncate">
								{profile?.firstname} {profile?.lastname}
							</p>
							<p className="text-xs text-white/70">{profile?.role === "admin" ? "Admin" : "User"}</p>
						</div>
					</div>
					<button
						onClick={handleSignout}
						className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-white/90 hover:bg-white/10 transition"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>
						Logout
					</button>
				</div>
			</aside>

			<main className="flex-1 overflow-auto p-8 bg-base-200">{children}</main>
		</div>
	);
};

export default AdminLayout;
