
import { NavLink } from 'react-router-dom';
import { useSidebar } from '@/hooks/use-sidebar';
import { Home, Search, FileText, Info, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Search, label: 'Pesquisar Cidadão', path: '/search' },
  { icon: FileText, label: 'Registros', path: '/records' },
  { icon: Info, label: 'Informações', path: '/info' },
];

const Sidebar = () => {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-lg transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-[70px]"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {isOpen ? (
          <div className="flex items-center gap-2">
            <div className="bg-white/90 p-1.5 rounded">
              <div className="text-sidebar bg-gov-primary p-0.5 rounded text-xs font-bold">SRC</div>
            </div>
            <span className="font-semibold">Registro Criminal</span>
          </div>
        ) : (
          <div className="mx-auto bg-white/90 p-1.5 rounded">
            <div className="text-sidebar bg-gov-primary p-0.5 rounded text-xs font-bold">SRC</div>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-sidebar-foreground">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="bg-sidebar-accent/50 p-2 rounded-full">
            <User className="h-5 w-5 text-sidebar-foreground/90" />
          </div>
          {isOpen && (
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">Oficial de Registros</p>
              <p className="text-xs text-sidebar-foreground/70">Online</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
