import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, ChevronRight, LayoutDashboard, CreditCard, User, History, LogIn, Lock } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Map for custom breadcrumb names and icons
    const breadcrumbConfig = {
        'user-login': { label: 'Login', icon: LogIn },
        'admin-login': { label: 'Admin Login', icon: Lock },
        'user-dashboard': { label: 'Dashboard', icon: LayoutDashboard },
        'admin-dashboard': { label: 'Admin Dashboard', icon: LayoutDashboard },
        'membership': { label: 'Membership', icon: CreditCard },
        'profile': { label: 'Profile', icon: User },
        'history': { label: 'History', icon: History },
    };

    return (
        <nav className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 text-sm font-medium">
            <div className="max-w-7xl mx-auto flex items-center text-zinc-400">
                <Link
                    to="/"
                    className="hover:text-orange-500 transition-colors flex items-center gap-2 group"
                >
                    <Home size={18} className="group-hover:text-orange-500 transition-colors" />
                    <span className="group-hover:text-white transition-colors">Home</span>
                </Link>

                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;

                    // Get config or default
                    const config = breadcrumbConfig[value];
                    const displayName = config ? config.label : value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');
                    const Icon = config ? config.icon : null;

                    return (
                        <React.Fragment key={to}>
                            <ChevronRight size={16} className="mx-2 text-zinc-600" />

                            {isLast ? (
                                <span className="text-white flex items-center gap-2 px-2 py-1 rounded bg-zinc-800/50 border border-zinc-700/50">
                                    {Icon && <Icon size={14} className="text-orange-500" />}
                                    {displayName}
                                </span>
                            ) : (
                                <Link
                                    to={to}
                                    className="hover:text-orange-500 transition-colors flex items-center gap-2"
                                >
                                    {Icon && <Icon size={16} />}
                                    {displayName}
                                </Link>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navbar;
