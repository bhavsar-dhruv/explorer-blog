import { NavLink, useLocation } from 'react-router-dom';
import { Home, PenSquare, Map, FileText, Info } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/create', icon: PenSquare, label: 'Create' },
  { path: '/journey', icon: Map, label: 'Journey' },
  { path: '/drafts', icon: FileText, label: 'Drafts' },
  { path: '/about', icon: Info, label: 'About' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-sunset-orange/10 shadow-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
          const isHome = path === '/' && location.pathname === '/';
          const active = isActive || isHome;

          return (
            <NavLink
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 rounded-xl transition-colors ${
                active ? 'text-terracotta' : 'text-earth-brown/40'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${active ? 'bg-terracotta/10' : ''}`}>
                <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
