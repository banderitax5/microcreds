import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import AdminLayout from "../../components/AdminLayout";
import supabase from "../../utils/supabase";

const EventDetails = () => {
	const { eventId } = useParams();
	const [event, setEvent] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchEvent() {
			try {
				const { data, error } = await supabase
					.from("events")
					.select("*")
					.eq("id", eventId)
					.single();

				if (error) throw error;
				setEvent(data);
			} catch (err) {
				console.error(err);
				setEvent(null);
			} finally {
				setLoading(false);
			}
		}
		if (eventId) fetchEvent();
	}, [eventId]);

	const formatDate = (dateStr) => {
		const d = new Date(dateStr);
		return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
	};

	const formatTime = (timeStr) => {
		if (!timeStr) return "";
		const [hours, minutes] = timeStr.split(":");
		const h = parseInt(hours, 10);
		const ampm = h >= 12 ? "PM" : "AM";
		const h12 = h % 12 || 12;
		return `${h12}:${minutes} ${ampm}`;
	};

	if (loading) {
		return (
			<AdminLayout>
				<div className="flex justify-center py-12">
					<span className="loading loading-spinner loading-lg text-[#14532d]"></span>
				</div>
			</AdminLayout>
		);
	}

	if (!event) {
		return (
			<AdminLayout>
				<div className="card bg-base-100 shadow-xl">
					<div className="card-body items-center text-center py-12">
						<h2 className="card-title">Event not found</h2>
						<Link to="/manage-events" className="btn btn-primary bg-[#14532d] hover:bg-[#166534] border-0">
							Back to Manage Events
						</Link>
					</div>
				</div>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<div className="space-y-6 max-w-4xl">
				{/* Event header card */}
				<div className="card bg-white/60 text-white shadow-xl">
					<div className="card-body">
						<h1 className="text-3xl font-bold">{event.title}</h1>
						<p className="text-white/90">
							{event.short_description || event.description || "No description provided."}
						</p>
						<div className="flex flex-wrap gap-6 mt-4">
							<div className="flex items-center gap-2">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								<span>{formatDate(event.event_date)}</span>
							</div>
							<div className="flex items-center gap-2">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<span>{formatTime(event.event_time)}</span>
							</div>
							<div className="flex items-center gap-2">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
								</svg>
								<span>{event.location}</span>
							</div>
						</div>
					</div>
				</div>

				{/* About this event */}
				<div className="card bg-base-100 shadow-xl">
					<div className="card-body">
						<h2 className="card-title flex items-center gap-2">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							About This Event
						</h2>
						<p className="text-base-content/80">
							{event.description || "No detailed description available."}
						</p>
					</div>
				</div>

				{/* Manage event access - Launch check-in desk */}
				<div className="card bg-base-100 shadow-xl">
					<div className="card-body">
						<h2 className="card-title flex items-center gap-2">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
							</svg>
							Manage Event Access
						</h2>
						<p className="text-base-content/70">
							Ready to open the doors? Launch the scanner to start checking in guests.
						</p>
						<div className="card-actions mt-4">
							<Link
								to={`/check-in-desk/${event.id}`}
								className="btn btn-neutral bg-red-500 hover:bg-red-500/40 border-0"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
								</svg>
								Launch Check-In Desk
							</Link>
							<Link
								to={`/manage-events/${event.id}/edit`}
								className="btn btn-outline"
							>
								Edit Event
							</Link>
						</div>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
};

export default EventDetails;
