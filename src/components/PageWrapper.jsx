import React from "react";

const PageWrapper = ({ children }) => {
	return <div className="flex flex-col min-h-screen">{children}</div>;
};

export default PageWrapper;
