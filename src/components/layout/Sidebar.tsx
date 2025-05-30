import { NavLink } from 'react-router-dom';
import { useSidebar } from '@/hooks/use-sidebar';
import { Home, Search, FileText, Info, User, Menu, Settings, FileCheck, Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

// Tipos de usuário
type UserRole = 'dic' | 'court';

// Props do componente
interface SidebarProps {
}

interface UserData {
  description: UserRole;
}

const registryNavItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Search, label: 'Pesquisar Cidadão', path: '/search' },
  { icon: FileText, label: 'Registos', path: '/records' },
  { icon: Info, label: 'Informações', path: '/info' },
];

const courtNavItems = [
  { icon: FileCheck, label: 'Pedidos', path: '/requests' },
  { icon: Info, label: 'Informações', path: '/info' },
];

const today = new Date();
const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

const Sidebar = ({}: SidebarProps) => {
  const { isOpen, toggleSidebar } = useSidebar();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Busca os dados do usuário ao montar o componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await api.post('/user/permission/');
        setUserData(response.data[0].role);
      } catch (err) {
        setError('Falha ao carregar dados do usuário');
        console.error('Erro ao buscar dados do usuário:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  
  const navItems = userData?.description === 'court' ? courtNavItems : registryNavItems;
  const userTitle = userData?.description === 'court' ? 'Tribunal' : 'Oficial de Registos';

  if (loading) {
    return (
      <aside className="fixed inset-y-0 left-0 z-0 w-[70px] flex flex-col bg-sidebar shadow-xl">
        <div className="flex items-center justify-center h-16 px-4 border-b border-sidebar-border">
          <div className="animate-pulse bg-sidebar-accent/50 h-8 w-8 rounded-full"></div>
        </div>
      </aside>
    );
  }

  if (error || !userData) {
    return (
      <aside className="fixed inset-y-0 left-0 z-0 w-[70px] flex flex-col bg-sidebar shadow-xl">
        <div className="flex items-center justify-center h-16 px-4 border-b border-sidebar-border">
          <div className="text-xs text-red-500">Erro</div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-0 flex flex-col bg-sidebar shadow-xl transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-[70px]"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {isOpen ? (
          <div className="flex items-center gap-2">
            <div className="bg-white/90 p-1.5 rounded">
              <div className="text-sidebar bg-gov-primary p-0.5 rounded text-xs font-bold">SRC</div>
            </div>
            <span className="font-semibold text-sidebar-foreground">Registo Criminal</span>
          </div>
        ) : (
          <div className="mx-auto bg-white/90 p-1.5 rounded">
            <div className="text-sidebar bg-gov-primary p-0.5 rounded text-xs font-bold">SRC</div>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-6 px-3">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm"
                    : "text-sidebar-foreground/90 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <div className="flex items-center gap-3">
          <div className="bg-sidebar-accent/50 p-2 rounded-full">
            <User className="h-5 w-5 text-sidebar-foreground/90" />
          </div>
          {isOpen && (
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">{userTitle}</p>
              <p className="text-xs text-sidebar-foreground/70">
                {userData.description || 'Usuário'} • Online
                {console.log("user: ", userData)}
              </p>
            </div>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "mt-4 w-full flex items-center justify-center gap-2 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            !isOpen && "p-2"
          )}
        >
          <Settings className="h-4 w-4" />
          {isOpen && <span>GRUPO 3 - {formattedDate}</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;