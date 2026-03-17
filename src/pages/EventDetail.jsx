import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Main from "../components/Main";
import PageWrapper from "../components/PageWrapper";
import supabase from "../utils/supabase";
import { SessionContext } from "../context/SessionContext";
import { useContext } from "react";

const EventDetail = () => {
	const { eventId } = useParams();
	const [event, setEvent] = useState(null);
	const [registration, setRegistration] = useState(null);
	const [loading, setLoading] = useState(true);
	const session = useContext(SessionContext);

	useEffect(() => {
		async function fetchData() {
			try {
				const { data: eventData, error: eventError } = await supabase
					.from("events")
					.select("*")
					.eq("id", eventId)
					.eq("status", "published")
					.single();

				if (eventError || !eventData) {
					setEvent(null);
					setLoading(false);
					return;
				}
				setEvent(eventData);

				if (session?.user?.id) {
					const { data: regData } = await supabase
						.from("event_registrations")
						.select("id")
						.eq("event_id", eventId)
						.eq("user_id", session.user.id)
						.single();
					setRegistration(regData);
				}
			} catch (err) {
				console.error(err);
				setEvent(null);
			} finally {
				setLoading(false);
			}
		}
		if (eventId) fetchData();
	}, [eventId, session?.user?.id]);

	const handleRegister = async () => {
		if (!session) {
			window.location.href = "/signin?redirect=/events/" + eventId;
			return;
		}
		try {
			const { data, error } = await supabase
				.from("event_registrations")
				.insert({ event_id: eventId, user_id: session.user.id })
				.select("id")
				.single();

			if (error) throw error;
			setRegistration(data);
		} catch (err) {
			alert(err.message);
		}
	};

	const handleUnregister = async () => {
		if (!registration?.id) return;
		if (!confirm("Are you sure you want to unregister?")) return;
		try {
			const { error } = await supabase.from("event_registrations").delete().eq("id", registration.id);
			if (error) throw error;
			setRegistration(null);
		} catch (err) {
			alert(err.message);
		}
	};

	const formatDate = (dateStr) => {
		const d = new Date(dateStr);
		return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
	};

	const formatTime = (timeStr) => {
		if (!timeStr) return "";
		const parts = timeStr.split(":");
		const h = parseInt(parts[0], 10);
		const m = parts[1] || "00";
		const ampm = h >= 12 ? "PM" : "AM";
		const h12 = h % 12 || 12;
		return `${h12}:${m} ${ampm}`;
	};

	if (loading) {
		return (
			<PageWrapper>
				<Header />
				<Main className="flex justify-center py-12">
					<span className="loading loading-spinner loading-lg text-[#14532d]"></span>
				</Main>
				<Footer />
			</PageWrapper>
		);
	}

	if (!event) {
		return (
			<PageWrapper>
				<Header />
				<Main>
					<div className="card bg-base-100 shadow-xl">
						<div className="card-body items-center text-center py-12">
							<h2 className="card-title">Event not found</h2>
							<Link to="/events" className="btn btn-primary bg-red-500 hover:bg-[#166534] border-0">
								Back to Events
							</Link>
						</div>
					</div>
				</Main>
				<Footer />
			</PageWrapper>
		);
	}

	return (
		<PageWrapper>
			<Header />
			<Main className="px-4">
				<div className="space-y-6 max-w-4xl mx-auto">
					<div className="card bg-white/60 text-white shadow-xl">
						<div className="card-body">
							<h1 className="text-3xl font-bold">{event.title}</h1>
							<p className="text-white/90">{event.short_description || event.description || "No description provided."}</p>
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

					<div className="card bg-base-100 shadow-xl">
						<div className="card-body">
							<h2 className="card-title flex items-center gap-2">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								About This Event
							</h2>
							<p className="text-base-content/80">{event.description || "No detailed description available."}</p>
						</div>
					</div>

					{registration ? (
						<div className="card bg-base-100 shadow-xl">
							<div className="card-body">
								<div className="bg-red-900/10 border border-red-500/30 rounded-lg p-6">
									<h2 className="text-xl font-bold text-red-400">Your Spot is Secured</h2>
									<p className="text-sm text-base-content/70 mt-1">Registration ID: {registration.id}</p>
									<div className="flex gap-2 mt-4">
										<button onClick={handleUnregister} className="btn btn-neutral bg-red-500 hover:bg-red-500/40">
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
											</svg>
											Unregister
										</button>
										<Link
											to={`/ticket/${registration.id}`}
											className="btn btn-neutral bg-red-900 hover:bg-red-300/40"
										>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
											</svg>
											View Ticket
										</Link>
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className="card bg-base-100 shadow-xl">
							<div className="card-body">
								<h2 className="card-title">Register for this event</h2>
								<p className="text-base-content/70">Sign in and register to secure your spot.</p>
								<div className="card-actions mt-4">
									{session ? (
										<button
											onClick={handleRegister}
											className="btn btn-neutral bg-red-500 hover:bg-red-500/40"
										>
											Register
										</button>
									) : (
										<Link to={`/signin?redirect=/events/${eventId}`} className="btn btn-neutral bg-red-500 hover:bg-red-500/40">
											Sign in to Register
										</Link>
									)}
								</div>
							</div>
						</div>
					)}

					<Link to="/events" className="btn btn-ghost my-6 hover:bg-red-500/40">
						← Back to Events
					</Link>
				</div>
			</Main>
			<Footer />
		</PageWrapper>
	);
};

export default EventDetail;
