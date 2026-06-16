import React from "react"
import { NavLink } from "react-router-dom"
import { FaCalendarAlt, FaCut, FaUserTie, FaUserShield, FaSignOutAlt, FaRobot, FaGift, FaCalendarCheck } from "react-icons/fa"
import menuItems from "../../data/menu.json"
import { useAuth } from "../../hooks/useAuth"

const menuIcons = {
  FaCalendarAlt: <FaCalendarAlt size={24} />,
  FaCut: <FaCut size={24} />,
  FaUserTie: <FaUserTie size={24} />,
  FaUserShield: <FaUserShield size={24} />,
  FaRobot: <FaRobot size={24} />,
  FaGift: <FaGift size={24} />,
  FaCalendarCheck: <FaCalendarCheck size={24} />,
}

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <>
      {/* Overlay for mobile - clicking closes sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          w-64 bg-zinc-900/95 backdrop-blur-lg border-r border-emerald-500/30 min-h-screen
          transform transition-transform duration-300 ease-in-out shadow-lg shadow-emerald-500
          flex flex-col justify-between
          ${isOpen ? "translate-x-0" : "-translate-x-[110%] lg:translate-x-0"}
        `}
      >
        <div className="p-3 flex-1 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 border-b-2 border-emerald-500/60 pb-3 mb-4 shrink-0">
            <img className="w-14" src="logo.png" alt="" />
            <h1 className="text-xl font-bold uppercase text-emerald-500">Web Barber</h1>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2 flex-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose()
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/50"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <span aria-hidden="true">
                  {menuIcons[item.icon]}
                </span>
                <span className="font-semibold">{item.name}</span>
              </NavLink>
            ))}

            {/* Conditionally add Admin Panel link */}
            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose()
                  }
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg border border-emerald-500/20 transition-all duration-300 ${
                    isActive
                      ? "bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/50 border-emerald-500"
                      : "text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                  }`
                }
              >
                <span aria-hidden="true">
                  {menuIcons.FaUserShield}
                </span>
                <span className="font-bold">Admin Panel</span>
              </NavLink>
            )}
          </nav>
        </div>

        {/* Footer User Info section */}
        {isAuthenticated && (
          <div className="lg:hidden p-4 border-t border-white/10 bg-zinc-950/40 shrink-0">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold uppercase">
                  {user?.name?.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-xs text-white/50 truncate">
                    {isAdmin ? 'Sartarosh (Admin)' : user?.phone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  if (window.innerWidth < 1024) onClose();
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-sm font-semibold py-2 px-3 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
              >
                <FaSignOutAlt size={14} />
                <span>Chiqish</span>
              </button>
            </div>
          </div>
        )}
      </aside>

    </>
  )
}

export default Sidebar