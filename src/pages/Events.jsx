import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Main from "../components/Main";
import PageWrapper from "../components/PageWrapper";
import supabase from "../utils/supabase";
import { SessionContext } from "../context/SessionContext";
import { useProfile } from "../hooks/useProfile";
import { useContext } from "react";

const Events = () => {
	const [events, setEvents] = useState([]);
	const [registrations, setRegistrations] = useState({});
	const [loading, setLoading] = useState(true);
	const session = useContext(SessionContext);
	const { profile } = useProfile(session?.user?.id);
	const navigate = useNavigate();
	const isAdmin = profile?.role === "admin";

	useEffect(() => {
		async function fetchData() {
			try {
				const { data: eventsData, error: eventsError } = await supabase
					.from("events")
					.select("*")
					.eq("status", "published")
					.order("event_date", { ascending: true });

				if (eventsError) throw eventsError;
				setEvents(eventsData || []);

				if (session?.user?.id) {
					const { data: regData } = await supabase
						.from("event_registrations")
						.select("event_id, id")
						.eq("user_id", session.user.id);
					const map = {};
					(regData || []).forEach((r) => {
						map[r.event_id] = r.id;
					});
					setRegistrations(map);
				}
			} catch (err) {
				console.error(err);
				setEvents([]);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, [session?.user?.id]);

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
		const parts = timeStr.split(":");
		const h = parseInt(parts[0], 10);
		const m = parts[1] || "00";
		const ampm = h >= 12 ? "PM" : "AM";
		const h12 = h % 12 || 12;
		return `${h12}:${m} ${ampm}`;
	};

	return (
		<PageWrapper>
			<Header />
			<Main className="px-4">
				<div className="space-y-6">
					<div>
						<h1 className="text-2xl font-bold">Events</h1>
						<p className="text-base-content/70">Browse and register for campus events.</p>
					</div>

					{loading ? (
						<div className="flex justify-center py-12">
							<span className="loading loading-spinner loading-lg text-red-500"></span>
						</div>
					) : events.length === 0 ? (
						<div className="card bg-base-100 shadow-xl">
							<div className="card-body items-center text-center py-12">
								<svg className="w-16 h-16 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								<h2 className="card-title">No events yet</h2>
								<p className="text-base-content/70">Check back soon for upcoming events.</p>
							</div>
						</div>
					) : (
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{events.map((event) => {
								const regId = registrations[event.id];
								return (
									<div
										key={event.id}
										className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-shadow"
									>
										<div className="card-body">
											<div className="flex gap-4">
												<div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-red-500/10 text-red-200 shrink-0">
													<span className="text-xs font-bold uppercase">{formatDate(event.event_date).split(" ")[0]}</span>
													<span className="text-2xl font-bold">{new Date(event.event_date).getDate()}</span>
												</div>
												<div className="flex-1 min-w-0">
													<h2 className="card-title text-lg line-clamp-2">{event.title}</h2>
													<p className="text-sm text-base-content/70 line-clamp-2">
														{event.short_description || event.description || "No description"}
													</p>
													<div className="flex flex-col gap-1 mt-2 text-sm text-base-content/60">
														<span className="flex items-center gap-2">
															<svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
															</svg>
															{formatTime(event.event_time)}
														</span>
														<span className="flex items-center gap-2">
															<svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
															</svg>
															<span className="truncate">{event.location}</span>
														</span>
													</div>
												</div>
											</div>
											<div className="card-actions justify-end mt-4 gap-2 flex-wrap">
												{isAdmin ? (
													<>
														<button
															onClick={() => navigate(`/manage-events/${event.id}/edit`)}
															className="btn btn-sm btn-ghost"
														>
															Edit
														</button>
														<button onClick={(e) => handleDelete(e, event.id)} className="btn btn-sm btn-ghost text-error">
															Delete
														</button>
														<Link to={`/manage-events/${event.id}`} className="btn btn-sm btn-neutral bg-red-500 hover:bg-red-500/40">
															Details
														</Link>
													</>
												) : (
													<>
														{regId ? (
															<>
																<Link
																	to={`/ticket/${regId}`}
																	className="btn btn-sm btn-ghost hover:bg-red-500/40"
																>
																	Ticket
																</Link>
																<button
																	onClick={async (e) => {
																		e.preventDefault();
																		if (!confirm("Unregister from this event?")) return;
																		try {
																			await supabase.from("event_registrations").delete().eq("id", regId);
																			setRegistrations((prev) => {
																				const next = { ...prev };
																				delete next[event.id];
																				return next;
																			});
																		} catch (err) {
																			alert(err?.message);
																		}
																	}}
																	className="btn btn-sm btn-ghost hover:bg-red-500/40"
																>
																	Unregister
																</button>
															</>
														) : null}
														<Link
															to={`/events/${event.id}`}
															className="btn btn-sm btn-neutral bg-red-500 hover:bg-red-500/40"
														>
															Details
														</Link>
													</>
												)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</Main>
			<Footer />
		</PageWrapper>
	);
};

export default Events;
