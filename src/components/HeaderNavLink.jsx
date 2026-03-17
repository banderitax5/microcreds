import { NavLink } from "react-router";

const HeaderNavLink = ({ to, linkText }) => {
	return (
		<NavLink
			className={({ isActive }) =>
				isActive
					? "bg-red-600 text-white btn btn-neutral btn-outline px-4 hover:text-white transition ease-in-out duration-200 text-sm/6 font-bold mr-4"
					: "text-white btn btn-neutral btn-outline px-4 hover:bg-white hover:text-black transition ease-in-out duration-200 text-sm/6 font-bold mr-4"
			}
			to={to}
		>
			{linkText}
		</NavLink>
	);
};

export default HeaderNavLink;
