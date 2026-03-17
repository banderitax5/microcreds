import React from "react";
import { NavLink, Link } from "react-router";
import HeaderNavLink from "./HeaderNavLink";
import supabase from "../utils/supabase";
import { SessionContext } from "../context/SessionContext";
import { useContext } from "react";
import { useProfile } from "../hooks/useProfile";

const Header = () => {
	const session = useContext(SessionContext);
	const { profile } = useProfile(session?.user?.id);

	const handleSignout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) alert(error);
	};

	return (
		<div className="navbar bg-gray-900 shadow-sm relative w-full">
			<div className="flex max-w-7xl mx-auto w-full items-center justify-between">
				{/* Left: Logo */}
				<div className="flex-none">
					<a href="/" className="-m-1.5 p-1.5">
						<span className="sr-only">Recovery</span>
						<img src="https://upload.wikimedia.org/wikipedia/commons/e/e2/RecoveryLogo.png" alt="" className="h-8 w-auto border-2" />
					</a>
				</div>

				{/* Center: Nav links */}
				<nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-10 text-sm text-white font-bold pointer-events-none">
					<a href="/" className="hover:text-red-500 transition pointer-events-auto">Shop</a>
					<a href="/" className="hover:text-red-500 transition pointer-events-auto">Lyrics</a>
					<a href="/" className="hover:text-red-500 transition pointer-events-auto">Video</a>
				</nav>

				{/* Right: Admin Portal, Auth */}
				<div className="flex-none flex items-center gap-4 ml-auto">
					{profile?.role === "admin" && (
						<Link
							to="/admin"
							className="text-white/90 hover:text-white font-medium transition"
						>
							Admin Portal
						</Link>
					)}
					{!session ? (
						<>
							<HeaderNavLink to="/signin" linkText="Sign In" />
							<HeaderNavLink to="/register" linkText="Register" />
						</>
					) : null}
					<div className="dropdown dropdown-end">
						{session ? (
							<>
								<div
									tabIndex={0}
									role="button"
									className="btn btn-ghost btn-circle avatar"
								>
									<div className="w-10 rounded-full">
										<img
											alt="Tailwind CSS Navbar component"
											src="https://i1.sndcdn.com/artworks-2Ry6sEHg4VmGusav-VJIk4A-t500x500.png"
										/>
									</div>
								</div>
							</>
						) : null}
						<ul
							tabIndex="-1"
							className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
						>
							<li>
								<a className="justify-between">
									Profile
									<span className="badge">New</span>
								</a>
							</li>
							<li>
								<a>Settings</a>
							</li>
							<li>
								<button onClick={handleSignout}>Sign Out</button>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;
