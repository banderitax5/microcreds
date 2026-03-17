import React from "react";
import { Link } from "react-router";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import PageWrapper from "../components/PageWrapper";
import { SessionContext } from "../context/SessionContext";
import { useContext } from "react";

//DRY

const Home = () => {
	const session = useContext(SessionContext);
	return (
		<PageWrapper>
			<Header />
			<Main className="flex flex-col items-center">
				<div className="w-full max-w-3xl flex flex-col items-center justify-center text-center py-16 space-y-6">
					<h1 className="text-4xl font-bold flex items-center justify-center gap-2 flex-wrap">
						Welcome to <img src="https://upload.wikimedia.org/wikipedia/commons/e/e2/RecoveryLogo.png" alt="REC+VERY" className="h-8 w-auto border-2" />
					</h1>
					<p className="text-xl text-base-content/70 max-w-2xl">
						Discover and register for concerts and events.
					</p>
					{session?.user?.id ? <Link to="/events" className="btn btn-neutral bg-red-500 hover:bg-red-500/40 border-0 btn-lg">
						Browse Events
					</Link> : <Link to="/signin" className="btn btn-neutral bg-red-500 hover:bg-red-500/40 border-0 btn-lg">
						Sign in to Browse Events
					</Link>}
				</div>
			</Main>
			<Footer />
		</PageWrapper>
	);
};

export default Home;
