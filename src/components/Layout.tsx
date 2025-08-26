import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Brain, Mic, Clock, BookOpen, Menu, X, LogOut, User } from "lucide-react";
import { useAppContext } from "../context/AppContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAppContext();

  const hiddenLayoutPaths = ["/", "/login", "/register"];
  const hideLayout = hiddenLayoutPaths.includes(location.pathname);

  const navItems = [
    { path: "/home", label: "Home", icon: <Brain className="w-5 h-5" /> },
    { path: "/record", label: "Record", icon: <Mic className="w-5 h-5" /> },
    { path: "/history", label: "History", icon: <Clock className="w-5 h-5" /> },
    {
      path: "/resources",
      label: "Resources",
      icon: <BookOpen className="w-5 h-5" />,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout API fails, redirect to login
      navigate("/login");
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideLayout && isAuthenticated && (
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/home" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">NeuroVox</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? "text-primary bg-blue-50"
                      : "text-gray-600 hover:text-primary hover:bg-blue-50"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* User Info */}
              {user && (
                <div className="flex items-center space-x-2 px-3 py-2 text-gray-600">
                  <User className="w-5 h-5" />
                  <span className="text-sm">{user.full_name || user.username}</span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-600 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <nav className="md:hidden bg-white py-4 px-4 shadow-inner">
              <div className="flex flex-col space-y-2">
                {/* User Info Mobile */}
                {user && (
                  <div className="flex items-center space-x-2 p-3 text-gray-600 border-b border-gray-200 mb-2">
                    <User className="w-5 h-5" />
                    <span className="text-sm">{user.full_name || user.username}</span>
                  </div>
                )}

                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 p-3 rounded-md transition-colors ${
                      location.pathname === item.path
                        ? "text-primary bg-blue-50"
                        : "text-gray-600 hover:text-primary hover:bg-blue-50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 p-3 rounded-md text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          )}
        </header>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">{children}</main>

      {/* Footer */}
      {!hideLayout && isAuthenticated && (
        <footer className="bg-gray-800 text-white py-8">
          <div className="text-center text-sm">
            © 2025 NeuroVox. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
