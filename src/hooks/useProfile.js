import { useState, useEffect } from "react";
import supabase from "../utils/supabase";

export function useProfile(userId) {
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!userId) {
			setProfile(null);
			setLoading(false);
			return;
		}

		async function fetchProfile() {
			try {
				const { data, error: err } = await supabase
					.from("profiles")
					.select("id, firstname, lastname, email, role")
					.eq("id", userId)
					.single();

				if (err) throw err;
				setProfile(data || { role: "user" });
			} catch (err) {
				setError(err);
				setProfile({ role: "user" });
			} finally {
				setLoading(false);
			}
		}

		fetchProfile();
	}, [userId]);

	return { profile, loading, error };
}
