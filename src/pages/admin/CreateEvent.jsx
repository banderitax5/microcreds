import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import AdminLayout from "../../components/AdminLayout";
import supabase from "../../utils/supabase";
import { SessionContext } from "../../context/SessionContext";
import { useContext } from "react";

const CreateEvent = () => {
	const { eventId } = useParams();
	const navigate = useNavigate();
	const session = useContext(SessionContext);
	const isEdit = !!eventId;

	const [formData, setFormData] = useState({
		title: "",
		short_description: "",
		description: "",
		event_date: "",
		event_time: "",
		location: "",
		capacity: 45,
		status: "draft",
	});

	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(isEdit);

	useEffect(() => {
		if (!isEdit) return;
		async function fetchEvent() {
			try {
				const { data, error } = await supabase
					.from("events")
					.select("*")
					.eq("id", eventId)
					.single();

				if (error) throw error;
				if (data) {
					const d = new Date(data.event_date);
					const dateStr = d.toISOString().split("T")[0];
					const timeStr = data.event_time?.substring(0, 5) || "10:00";
					setFormData({
						title: data.title || "",
						short_description: data.short_description || "",
						description: data.description || "",
						event_date: dateStr,
						event_time: timeStr,
						location: data.location || "",
						capacity: data.capacity || 45,
						status: data.status || "draft",
					});
				}
			} catch (err) {
				console.error(err);
			} finally {
				setFetching(false);
			}
		}
		fetchEvent();
	}, [eventId, isEdit]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const payload = {
				title: formData.title,
				short_description: formData.short_description || null,
				description: formData.description || null,
				event_date: formData.event_date,
				event_time: formData.event_time,
				location: formData.location,
				capacity: parseInt(formData.capacity, 10) || 45,
				status: formData.status,
			};

			if (isEdit) {
				const { error } = await supabase
					.from("events")
					.update({ ...payload, updated_at: new Date().toISOString() })
					.eq("id", eventId);
				if (error) throw error;
				navigate(`/manage-events/${eventId}`);
			} else {
				const { data, error } = await supabase
					.from("events")
					.insert({ ...payload, created_by: session?.user?.id })
					.select("id")
					.single();
				if (error) throw error;
				navigate(`/manage-events/${data?.id}`);
			}
		} catch (err) {
			alert(err.message);
		} finally {
			setLoading(false);
		}
	};

	if (fetching) {
		return (
			<AdminLayout>
				<div className="flex justify-center py-12">
					<span className="loading loading-spinner loading-lg text-[#14532d]"></span>
				</div>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<div className="max-w-2xl space-y-6">
				<div>
					<h1 className="text-2xl font-bold">
						{isEdit ? "Edit Event" : "Create a new Event"}
					</h1>
					<p className="text-base-content/70">
						{isEdit ? "Update the event details below." : "Fill in the details to publish a new activity for SJC students."}
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="card bg-base-100 shadow-xl">
						<div className="card-body">
							<h2 className="card-title flex items-center gap-2 mb-4">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								General Information
							</h2>
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="sm:col-span-2">
									<label className="label">
										<span className="label-text">Title</span>
									</label>
									<input
										type="text"
										name="title"
										value={formData.title}
										onChange={handleChange}
										className="input input-bordered w-full"
										placeholder="Event title"
										required
									/>
								</div>
								<div>
									<label className="label">
										<span className="label-text">Date</span>
									</label>
									<input
										type="date"
										name="event_date"
										value={formData.event_date}
										onChange={handleChange}
										className="input input-bordered w-full"
										required
									/>
								</div>
								<div>
									<label className="label">
										<span className="label-text">Time</span>
									</label>
									<input
										type="time"
										name="event_time"
										value={formData.event_time}
										onChange={handleChange}
										className="input input-bordered w-full"
										required
									/>
								</div>
								<div>
									<label className="label">
										<span className="label-text">Location</span>
									</label>
									<input
										type="text"
										name="location"
										value={formData.location}
										onChange={handleChange}
										className="input input-bordered w-full"
										placeholder="Venue or room"
										required
									/>
								</div>
								<div>
									<label className="label">
										<span className="label-text">Capacity</span>
									</label>
									<input
										type="number"
										name="capacity"
										value={formData.capacity}
										onChange={handleChange}
										className="input input-bordered w-full"
										min={1}
									/>
								</div>
								<div>
									<label className="label">
										<span className="label-text">Status</span>
									</label>
									<select
										name="status"
										value={formData.status}
										onChange={handleChange}
										className="select select-bordered w-full"
									>
										<option value="draft">Draft</option>
										<option value="published">Published</option>
										<option value="cancelled">Cancelled</option>
									</select>
								</div>
							</div>
						</div>
					</div>

					<div className="card bg-base-100 shadow-xl">
						<div className="card-body">
							<h2 className="card-title flex items-center gap-2 mb-4">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								Description
							</h2>
							<div>
								<label className="label">
									<span className="label-text">Short description</span>
								</label>
								<input
									type="text"
									name="short_description"
									value={formData.short_description}
									onChange={handleChange}
									className="input input-bordered w-full"
									placeholder="Brief summary"
								/>
							</div>
							<div>
								<label className="label">
									<span className="label-text">Full description</span>
								</label>
								<textarea
									name="description"
									value={formData.description}
									onChange={handleChange}
									className="textarea textarea-bordered w-full min-h-[120px]"
									placeholder="Detailed event description..."
								/>
							</div>
						</div>
					</div>

					<div className="flex gap-4">
						<button
							type="submit"
							disabled={loading}
							className="btn btn-neutral bg-red-500 hover:bg-red-500/40 border-0"
						>
							{loading ? (
								<span className="loading loading-spinner loading-sm"></span>
							) : isEdit ? (
								"Update Event"
							) : (
								"Create Event"
							)}
						</button>
						<button
							type="button"
							onClick={() => navigate(isEdit ? `/manage-events/${eventId}` : "/manage-events")}
							className="btn btn-ghost hover:bg-red-500/20"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</AdminLayout>
	);
};

export default CreateEvent;
