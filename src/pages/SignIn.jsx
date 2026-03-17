import Header from "../components/Header";
import Footer from "../components/Footer";
import Main from "../components/Main";
import PageWrapper from "../components/PageWrapper";
import Card from "../components/Card";
import Input from "../components/Input";
import { useState } from "react";
import supabase from "../utils/supabase";
import { useContext } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { SessionContext } from "../context/SessionContext";

const SignIn = () => {
    const userSession = useContext(SessionContext);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirect") || null;

    const handleInputChange = (event) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        setFormData({
            ...formData,
            [inputName]: inputValue,
        });
    };

    async function handleSubmit() {
        try {
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (signInError) throw signInError;
            // Redirect: use ?redirect= param if present, else based on role
            if (signInData?.user?.id) {
                if (redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
                    navigate(redirectTo, { replace: true });
                } else {
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("role")
                        .eq("id", signInData.user.id)
                        .single();
                    if (profile?.role === "admin") {
                        navigate("/admin", { replace: true });
                    } else {
                        navigate("/events", { replace: true });
                    }
                }
            }
        } catch (error) {
            alert(error);
        }
    }

    return (
        <PageWrapper>
            <Header />
            <Main className="flex justify-center">
                <div className="flex items-center">
                    {!userSession && (
                        <Card>
                            <h1 className="text-xl font-bold">Sign In</h1>
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
                                onClick={handleSubmit}
                            >
                                SignIn
                            </button>
                        </Card>
                    )}
                    {userSession && <Card>You are already signed in</Card>}
                </div>
            </Main>
            <Footer />
        </PageWrapper>
    );
};

export default SignIn;
