import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Main from "../components/Main";
import PageWrapper from "../components/PageWrapper";
import supabase from "../utils/supabase";
import { SessionContext } from "../context/SessionContext";
import { useContext } from "react";
import QRCode from "qrcode";

const Ticket = () => {
	const { registrationId } = useParams();
	const [registration, setRegistration] = useState(null);
	const [event, setEvent] = useState(null);
	const [profile, setProfile] = useState(null);
	const [qrDataUrl, setQrDataUrl] = useState("");
	const [loading, setLoading] = useState(true);
	const session = useContext(SessionContext);

	useEffect(() => {
		async function fetchData() {
			try {
				const { data: regData, error: regError } = await supabase
					.from("event_registrations")
					.select("id, event_id, user_id")
					.eq("id", registrationId)
					.single();

				if (regError || !regData) {
					setRegistration(null);
					setLoading(false);
					return;
				}
				if (regData.user_id !== session?.user?.id) {
					setRegistration(null);
					setLoading(false);
					return;
				}
				setRegistration(regData);

				const { data: eventData } = await supabase
					.from("events")
					.select("*")
					.eq("id", regData.event_id)
					.single();
				setEvent(eventData);

				const { data: profileData } = await supabase
					.from("profiles")
					.select("firstname, lastname, email")
					.eq("id", regData.user_id)
					.single();
				setProfile(profileData);

				const qr = await QRCode.toDataURL(regData.id, { width: 256 });
				setQrDataUrl(qr);
			} catch (err) {
				console.error(err);
				setRegistration(null);
			} finally {
				setLoading(false);
			}
		}
		if (registrationId && session?.user?.id) fetchData();
		else if (!session) setLoading(false);
	}, [registrationId, session]);

	const formatDate = (dateStr) => {
		if (!dateStr) return "";
		return new Date(dateStr).toISOString().split("T")[0];
	};

	const formatTime = (timeStr) => {
		if (!timeStr) return "";
		return timeStr.substring(0, 8);
	};

	if (!session) {
		return (
			<PageWrapper>
				<Header />
				<Main>
					<div className="card bg-base-100 shadow-xl max-w-md mx-auto">
						<div className="card-body items-center text-center py-12">
							<h2 className="card-title">Sign in required</h2>
							<p className="text-base-content/70">Please sign in to view your ticket.</p>
							<Link to={`/signin?redirect=/ticket/${registrationId}`} className="btn btn-neutral bg-red-500 hover:bg-red-500/40">
								Sign In
							</Link>
						</div>
					</div>
				</Main>
				<Footer />
			</PageWrapper>
		);
	}

	if (loading) {
		return (
			<PageWrapper>
				<Header />
				<Main className="flex justify-center py-12">
					<span className="loading loading-spinner loading-lg text-red-500"></span>
				</Main>
				<Footer />
			</PageWrapper>
		);
	}

	if (!registration || !event) {
		return (
			<PageWrapper>
				<Header />
				<Main>
					<div className="card bg-base-100 shadow-xl max-w-md mx-auto">
						<div className="card-body items-center text-center py-12">
							<h2 className="card-title">Ticket not found</h2>
							<Link to="/events" className="btn btn-neutral bg-red-500 hover:bg-red-500/40 border-0">
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
				<div className="max-w-lg mx-auto">
					<div className="card bg-base-100 shadow-xl overflow-hidden">
						<div className="bg-red-500/60 text-white p-4 text-center">
							<h1 className="text-lg font-bold uppercase tracking-wide">{event.title}</h1>
						</div>
						<div className="card-body">
							<p className="text-base-content/70">{event.location}</p>
							<div className="flex gap-4 text-sm text-base-content/70">
								<span className="flex items-center gap-2">
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
									{formatDate(event.event_date)}
								</span>
								<span className="flex items-center gap-2">
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									{formatTime(event.event_time)}
								</span>
							</div>
							<div className="divider"></div>
							<p className="font-medium">{profile?.firstname} {profile?.lastname}</p>
							<p className="text-sm text-base-content/70">{profile?.email}</p>
							{qrDataUrl && (
								<div className="flex justify-center my-6">
									<img src={qrDataUrl} alt="Ticket QR Code" className="w-64 h-64" />
								</div>
							)}
							<div className="flex items-center justify-center gap-2 py-2 px-4 bg-base-200 rounded-lg">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h12a1 1 0 001-1v-4a1 1 0 00-1-1H5a1 1 0 00-1 1v4a1 1 0 001 1z" />
								</svg>
								<span className="text-sm font-medium">Scan at the entrance</span>
							</div>
							<p className="text-xs text-base-content/50 text-center mt-4">{registration.id}</p>
						</div>
					</div>
					<div className="mt-6 text-center mb-6">
						<Link to="/events" className="btn btn-neutral bg-red-500/60 hover:bg-red-500/40">
							← Back to Events
						</Link>
					</div>
				</div>
			</Main>
			<Footer />
		</PageWrapper>
	);
};

export default Ticket;
