import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Main from "../components/Main";
import PageWrapper from "../components/PageWrapper";
import Card from "../components/Card";
import Input from "../components/Input";
import { useState } from "react";
import supabase from "../utils/supabase";
import { useNavigate } from "react-router";

const Register = () => {

	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		firstname: "",
		lastname: "",
		email: "",
		password: "",
	});

	const handleInputChange = (event) => {
		const inputName = event.target.name;
		const inputValue = event.target.value;
		setFormData({ ...formData, [inputName]: inputValue });
	};

	const handleSubmit = async () => {
		try {
			const { data: signupData, signupError } = await supabase.auth.signUp({
				email: formData.email,
				password: formData.password,
			});

			if (signupError) throw signupError;

			if (signupData?.user?.id) {
				const { profileError } = await supabase
					.from("profiles")
					.insert({
						id: signupData.user.id,
						firstname: formData.firstname,
						lastname: formData.lastname,
						email: formData.email,
						role: "user",
					})
					.select();

				if (profileError) throw profileError;
			}
			return true;
		} catch (error) {
			alert(error?.message ?? error);
			return false;
		}
	};

	const [session, setSession] = useState(null);

	useEffect(() => {
		const { data } = supabase.auth.onAuthStateChange((event, session) => {
			setSession(session);
		});

		return () => data.subscription.unsubscribe();
	}, []);

	return (
		<PageWrapper>
			<Header />
			<Main className="flex justify-center">
				<div className="flex items-center">
					{!session ? (
						<Card>
							<h1 className="text-xl font-bold">Sign Up</h1>
							<Input
								label="Firstname"
								name="firstname"
								type="text"
								placeholder="Enter your name"
								className="w-full"
								onChange={handleInputChange}
							/>

							<Input
								label="Lastname"
								name="lastname"
								type="text"
								placeholder="Enter your lastname"
								className="w-full"
								onChange={handleInputChange}
							/>
							<Input
								label="Email"
								name="email"
								type="text"
								placeholder="Enter your Email"
								className="w-full"
								onChange={handleInputChange}
							/>
							<Input
								label="Password"
								name="password"
								type="password"
								placeholder="Enter your Password"
								className="w-full mb-5"
								onChange={handleInputChange}
							/>

							<button
								className="bg-white btn btn-neutral btn-outline px-32 hover:bg-gray-900"
								onClick={async () => {
									const ok = await handleSubmit();
									if (ok) navigate("/");
								}}
							>
								Signup
							</button>
						</Card>
					) : (
						<Card>You are already signed in</Card>
					)}
				</div>
			</Main>
			<Footer />
		</PageWrapper>
	);
};

export default Register;
