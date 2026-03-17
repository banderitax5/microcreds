import React from 'react'
import { NavLink } from 'react-router'

const AdminNavLink = ({ to, linkText, icon }) => {
    return (
        <NavLink
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition 
                ${isActive ? 
                    "bg-red-500 text-white" : 
                    "bg-transparent text-white hover:bg-red-500/20"
                }`
            }
            to={to}
        >
            {icon}
            {linkText}
        </NavLink>
    )
}

export default AdminNavLink