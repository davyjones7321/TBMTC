import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    TrendingUp,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Shield,
    User,
    FolderTree,
    Settings,
    MessageSquare,
} from 'lucide-react';

const AdminLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/products', label: 'Products', icon: Package },
        { path: '/categories', label: 'Categories', icon: FolderTree },
        { path: '/orders', label: 'Orders', icon: ShoppingCart },
        { path: '/customers', label: 'Customers', icon: Users },
        { path: '/queries', label: 'Queries', icon: MessageSquare },
        { path: '/users', label: 'User Management', icon: Shield },
        { path: '/reports', label: 'Reports', icon: TrendingUp },
        { path: '/settings', label: 'Settings', icon: Settings },
        { path: '/profile', label: 'Profile', icon: User },
    ];

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex h-screen bg-light overflow-hidden">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 
          bg-gradient-dark text-white
          shadow-soft-xxl z-50
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo/Brand */}
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                                <p className="text-xs text-white/70 mt-1">JHOM FOODS dashboard</p>
                            </div>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`
                    group flex items-center justify-between px-4 py-3 rounded-soft-lg
                    transition-all duration-300
                    ${active
                                            ? 'bg-white text-dark shadow-soft-md'
                                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        }
                  `}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Icon
                                            className={`w-5 h-5 transition-colors ${active ? 'text-primary-500' : 'text-white/60 group-hover:text-white'
                                                }`}
                                        />
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                    {active && (
                                        <ChevronRight className="w-4 h-4 text-primary-500" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile & Logout */}
                    <div className="p-4 border-t border-white/10">
                        <div className="bg-white/10 backdrop-blur-md rounded-soft-lg p-4 mb-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-soft-md">
                                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">
                                        {user?.name || 'Admin User'}
                                    </p>
                                    <p className="text-xs text-white/60 truncate">
                                        {user?.email || 'admin@example.com'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="
                w-full flex items-center justify-center space-x-2 px-4 py-3
                bg-white/10 hover:bg-danger text-white
                rounded-soft-lg transition-all duration-300
                hover:shadow-soft-md
              "
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white shadow-soft-sm z-30">
                    <div className="flex items-center justify-between px-6 py-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Menu className="w-6 h-6 text-dark" />
                        </button>

                        <div className="flex-1 lg:flex-none">
                            {/* Breadcrumbs or page title can go here */}
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center space-x-4">
                            <div className="hidden sm:block text-sm text-secondary">
                                Welcome back, <span className="font-semibold text-dark">{user?.name}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-light">
                    <div className="p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
