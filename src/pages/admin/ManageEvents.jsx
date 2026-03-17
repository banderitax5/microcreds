import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import AdminLayout from "../../components/AdminLayout";
import supabase from "../../utils/supabase";

const ManageEvents = () => {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchEvents() {
			try {
				const { data, error } = await supabase
					.from("events")
					.select("*")
					.order("event_date", { ascending: true });

				if (error) throw error;
				setEvents(data || []);
			} catch (err) {
				console.error(err);
				setEvents([]);
			} finally {
				setLoading(false);
			}
		}
		fetchEvents();
	}, []);

	const handleDelete = async (e, id) => {
		e.preventDefault();
		if (!confirm("Are you sure you want to delete this event?")) return;
		try {
			const { error } = await supabase.from("events").delete().eq("id", id);
			if (error) throw error;
			setEvents((prev) => prev.filter((ev) => ev.id !== id));
		} catch (err) {
			alert(err.message);
		}
	};

	const formatDate = (dateStr) => {
		const d = new Date(dateStr);
		return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
	};

	const formatTime = (timeStr) => {
		if (!timeStr) return "";
		const [hours, minutes] = timeStr.split(":");
		const h = parseInt(hours, 10);
		const ampm = h >= 12 ? "PM" : "AM";
		const h12 = h % 12 || 12;
		return `${h12}:${minutes} ${ampm}`;
	};

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h1 className="text-2xl font-bold">Events Management</h1>
						<p className="text-base-content/70">Create, update, and monitor campus activities.</p>
					</div>
					<Link
						to="/manage-events/create"
						className="btn btn-neutral bg-red-500 hover:bg-red-500/40 border-0"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
						</svg>
						Create Event
					</Link>
				</div>

				{loading ? (
					<div className="flex justify-center py-12">
						<span className="loading loading-spinner loading-lg text-[#14532d]"></span>
					</div>
				) : events.length === 0 ? (
					<div className="card bg-base-100 shadow-xl">
						<div className="card-body items-center text-center py-12">
							<svg className="w-16 h-16 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<h2 className="card-title">No events yet</h2>
							<p className="text-base-content/70">Create your first event to get started.</p>
							<Link to="/manage-events/create" className="btn btn-neutral bg-red-500 hover:bg-red-500/40 border-0">
								Create Event
							</Link>
						</div>
					</div>
				) : (
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{events.map((event) => (
							<div
								key={event.id}
								className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-shadow"
							>
								<div className="card-body">
									<div className="flex gap-4">
										<div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-red-500/10 text-red-100 shrink-0">
											<span className="text-xs font-bold uppercase">
												{formatDate(event.event_date).split(" ")[0]}
											</span>
											<span className="text-2xl font-bold">
												{new Date(event.event_date).getDate()}
											</span>
										</div>
										<div className="flex-1 min-w-0">
											<h2 className="card-title text-lg line-clamp-2">{event.title}</h2>
											<p className="text-sm text-base-content/70 line-clamp-2">
												{event.short_description || event.description || "No description"}
											</p>
											<div className="flex flex-col gap-1 mt-2 text-sm text-base-content/60">
												<span className="flex items-center gap-2">
													<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
													</svg>
													{formatTime(event.event_time)}
												</span>
												<span className="flex items-center gap-2">
													<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
													</svg>
													<span className="truncate">{event.location}</span>
												</span>
											</div>
										</div>
									</div>
									<div className="card-actions justify-end mt-4 gap-2">
										<button
											onClick={() => navigate(`/manage-events/${event.id}/edit`)}
											className="btn btn-sm btn-ghost"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
											</svg>
											Edit
										</button>
										<button
											onClick={(e) => handleDelete(e, event.id)}
											className="btn btn-sm btn-ghost text-error"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
											Delete
										</button>
										<Link
											to={`/manage-events/${event.id}`}
											className="btn btn-sm btn-neutral bg-red-500 hover:bg-red-500/40 border-0"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
											</svg>
											Details
										</Link>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</AdminLayout>
	);
};

export default ManageEvents;
