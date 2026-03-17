import { Link } from "react-router";
import AdminLayout from "../../components/AdminLayout";

const AdminHome = () => {
	return (
		<AdminLayout>
			<div className="space-y-6">
				<div className="">
					<h1 className="text-2xl font-bold flex items-center gap-2">Welcome to <img src="https://upload.wikimedia.org/wikipedia/commons/e/e2/RecoveryLogo.png" alt="" className="h-8 w-auto border-2" /> Admin Portal</h1>
				</div>
				<p className="text-base-content/70">Manage your events and check-in guests.</p>

				<div className="grid gap-4 sm:grid-cols-2">
					<Link
						to="/manage-events"
						className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
					>
						<div className="card-body">
							<svg className="w-12 h-12 text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<h2 className="card-title">Manage Events</h2>
							<p>Create, edit, and manage your campus events.</p>
						</div>
					</Link>
				</div>
			</div>
		</AdminLayout>
	);
};

export default AdminHome;
