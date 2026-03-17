import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { Html5Qrcode } from "html5-qrcode";
import AdminLayout from "../../components/AdminLayout";
import supabase from "../../utils/supabase";

const CheckInDesk = () => {
	const { eventId } = useParams();
	const [event, setEvent] = useState(null);
	const [scanning, setScanning] = useState(false);
	const [lastScan, setLastScan] = useState(null);
	const [error, setError] = useState(null);
	const html5QrCodeRef = useRef(null);
	const resumeTimeoutRef = useRef(null);
	const isMountedRef = useRef(true);
	const isStoppingRef = useRef(false);
	const lastProcessedScanRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	useEffect(() => {
		async function fetchEvent() {
			try {
				const { data, err } = await supabase
					.from("events")
					.select("id, title")
					.eq("id", eventId)
					.single();

				if (err) throw err;
				if (isMountedRef.current) setEvent(data);
			} catch (err) {
				console.error("Error fetching event:", err);
				if (isMountedRef.current) setEvent(null);
			}
		}
		if (eventId) fetchEvent();
	}, [eventId]);

	useEffect(() => {
		if (!scanning || !eventId) return;

		const config = {
			fps: 10,
			qrbox: { width: 250, height: 250 },
			aspectRatio: 1,
		};

		const html5QrCode = new Html5Qrcode("qr-reader");
		html5QrCodeRef.current = html5QrCode;

		html5QrCode
			.start(
				{ facingMode: "environment" },
				config,
				async (decodedText) => {
					if (!isMountedRef.current || isStoppingRef.current) return;
					const registrationId = decodedText.trim();
					if (lastProcessedScanRef.current === registrationId) return;
					lastProcessedScanRef.current = registrationId;
					setLastScan(registrationId);
					setError(null);

					try {
						const { data: reg, err: fetchErr } = await supabase
							.from("event_registrations")
							.select("id, event_id, checked_in_at")
							.eq("id", registrationId)
							.single();

						if (fetchErr || !reg) {
							if (isMountedRef.current) setError("Invalid or unknown ticket");
							return;
						}
						if (reg.event_id !== eventId) {
							if (isMountedRef.current) setError("Ticket not for this event");
							return;
						}
						if (reg.checked_in_at) {
							if (isMountedRef.current) setError("Already checked in");
							return;
						}

						const { err: updateErr } = await supabase
							.from("event_registrations")
							.update({ checked_in_at: new Date().toISOString() })
							.eq("id", registrationId);

						if (updateErr) throw updateErr;
					} catch (err) {
						if (isMountedRef.current) setError(err?.message || "Check-in failed");
					}
				},
				() => {}
			)
			.catch((err) => {
				if (isMountedRef.current) setError(err?.message || "Could not start camera.");
			});

		return () => {
			isStoppingRef.current = true;
			lastProcessedScanRef.current = null;
			clearTimeout(resumeTimeoutRef.current);
			resumeTimeoutRef.current = null;
			const instance = html5QrCodeRef.current;
			if (instance?.isScanning) {
				instance.stop().catch(() => {});
			}
			html5QrCodeRef.current = null;
		};
	}, [scanning, eventId]);

	const toggleScanning = async () => {
		if (scanning) {
			isStoppingRef.current = true;
			clearTimeout(resumeTimeoutRef.current);
			resumeTimeoutRef.current = null;
			try {
				if (html5QrCodeRef.current?.isScanning) {
					await html5QrCodeRef.current.stop();
				}
			} catch {
				/* ignore */
			}
			html5QrCodeRef.current = null;
			isStoppingRef.current = false;
			// Defer setState to next tick to avoid "Cannot transition to a new state" - lets scanner/React settle
			setTimeout(() => {
				if (isMountedRef.current) setScanning(false);
			}, 0);
		} else {
			isStoppingRef.current = false;
			setScanning(true);
		}
	};

	return (
		<AdminLayout>
			<div className="space-y-6 max-w-2xl mx-auto">
				{event && (
					<div className="text-center">
						<h1 className="text-xl font-bold">Check-In Desk</h1>
						<p className="text-base-content/70">{event.title}</p>
					</div>
				)}

				<div className="card bg-base-100 shadow-xl">
					<div className="card-body items-center">
						<div className="w-full max-w-md rounded-2xl overflow-hidden border-2 border-[#22c55e]/30 bg-black/90">
							{scanning ? (
								<div id="qr-reader" className="w-full min-h-[300px]" />
							) : (
								<div className="w-full aspect-square max-h-[350px] flex items-center justify-center border-2 border-dashed border-base-content/20 rounded-2xl">
									<p className="text-base-content/50">Scanner inactive — click Start to begin</p>
								</div>
							)}
						</div>

						{error && (
							<div className="alert alert-warning mt-4">
								<span>{error}</span>
							</div>
						)}

						{lastScan && (
							<div className="alert alert-success mt-4">
								<span>Scanned: {lastScan}</span>
							</div>
						)}

						<button
							onClick={toggleScanning}
							className={`btn mt-4 ${scanning ? "btn-error" : "btn-primary bg-[#14532d] hover:bg-[#166534] border-0"}`}
						>
							{scanning ? "Stop Scanner" : "Start Scanner"}
						</button>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
};

export default CheckInDesk;
