
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Lock } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication - in a real app this would call your auth API
    setTimeout(() => {
      // For demo purposes, any login works
      if (username && password) {
        // Store some user info in local storage
        localStorage.setItem('user', JSON.stringify({ name: username, role: 'Oficial de Registos' }));
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
        toast({
          title: "Autenticação bem-sucedida",
          description: "Bem-vindo ao Sistema de Registro Criminal.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Por favor, insira as credenciais válidas.",
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gov-background bg-gradient-to-b from-gov-background to-gray-100">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gov-primary rounded-full">
              <Lock className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gov-foreground">
            Sistema de Registro Criminal
          </h1>
          <p className="text-gray-500 mt-2">Ministério da Justiça</p>
        </div>

        <Card className="gov-card">
          <CardHeader>
            <CardTitle>Autenticação de Oficial</CardTitle>
            <CardDescription>
              Insira as suas credenciais para acessar o sistema de registros criminais.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Nome de utilizador
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="gov-input"
                  placeholder="Insira o seu nome de utilizador"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="gov-input"
                  placeholder="Insira a sua password"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-gov-primary hover:bg-gov-secondary"
                disabled={isLoading}
              >
                {isLoading ? 'Autenticando...' : 'Entrar'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        <p className="text-center mt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} Sistema de Registro Criminal - Todos os direitos reservados
        </p>
      </div>
    </div>
  );
};

export default Login;
