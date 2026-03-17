function Footer() {
    return (
        <>
            <footer className="bg-gray-900">
                <div className="w-full max-w-screen-7xl shadow-sm mx-auto flex justify-center">
                    <div className="grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-4">
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-heading uppercase">Company</h2>
                            <ul className="text-body font-medium">
                                <li className="mb-4 hover:text-red-500 transition ease-in-out duration-200">
                                    <a href="#" className=" ">About</a>
                                </li>
                                <li className="mb-4 hover:text-red-500 transition ease-in-out duration-200">
                                    <a href="#" className="">Careers</a>
                                </li>
                                <li className="mb-4 hover:text-red-500 transition ease-in-out duration-200">
                                    <a href="#" className="">Brand Center</a>
                                </li>
                                <li className="mb-4 hover:text-red-500 transition ease-in-out duration-200">
                                    <a href="#" className="">Blog</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-heading uppercase">Help center</h2>
                            <ul className="text-body font-medium">
                                <li className="mb-4">
                                    <a href="#" className="hover:text-red-500 transition ease-in-out duration 200">Discord Server</a>
                                </li>
                                <li className="mb-4">
                                    <a href="#" className="hover:text-red-500 transition ease-in-out duration 200">Twitter</a>
                                </li>
                                <li className="mb-4">
                                    <a href="#" className="hover:text-red-500 transition ease-in-out duration 200">Facebook</a>
                                </li>
                                <li className="mb-4">
                                    <a href="#" className="hover:text-red-500 transition ease-in-out duration 200">Contact Us</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-heading uppercase">Legal</h2>
                            <ul className="text-body font-medium">
                                <li className="mb-4">
                                    <a href="#" className="hover:text-red-500 transition ease-in-out duration 200">Privacy Policy</a>
                                </li>
                                <li className="mb-4">
                                    <a href="#" className="hover:text-red-500 transition ease-in-out duration 200">Licensing</a>
                                </li>
                                <li className="mb-4">
                                    <a href="#" className="hover:text-red-500 transition ease-in-out duration 200">Terms &amp; Conditions</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-heading uppercase">Download</h2>
                            <ul className="text-body font-medium">
                                <li className="mb-4">
                                    <a href="#" className="hover:text-red-500 transition ease-in-out duration 200">iOS</a>
                                </li>
                                <li className="mb-4">
                                    <a href="#" className="hover:text-red-500 transition ease-in-out duration 200">Android</a>
                                </li>
                                <li className="mb-4">
                                    <a href="#" className="hover:text-red-500 transition ease-in-out duration 200">Windows</a>
                                </li>
                                <li className="mb-4">
                                    <a href="#" className="hover:text-red-500 transition ease-in-out duration 200">MacOS</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer
