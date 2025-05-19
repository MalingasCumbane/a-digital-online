
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User, Menu } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useSidebar } from '@/hooks/use-sidebar';

const Header = () => {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { toggleSidebar } = useSidebar();
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    toast({
      title: "Sessão terminada",
      description: "A sua sessão foi encerrada com sucesso.",
    });
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-gov-primary p-1.5 rounded">
              <div className="text-white font-bold text-sm">SRC</div>
            </div>
            <h1 className="text-lg font-semibold hidden sm:block">
              Sistema de Registro Criminal
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 bg-gov-primary/10 rounded-full">
                  <User className="h-5 w-5 text-gov-primary" />
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
