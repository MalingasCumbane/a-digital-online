import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Lock } from 'lucide-react';
import api from '@/lib/api';

const Login = () => {
  const [email, setEmail] = useState(''); // Mudamos de username para email
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        user_name: email,
        password: password
      }

      console.log("data: ", data)

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');

      const response = await api.post('/login/', data);

      // Armazena o token e os dados do usuário
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('isAuthenticated', 'true');

      // Navega para o dashboard
      navigate('/dashboard');
      
      toast({
        title: "Autenticação bem-sucedida",
        description: "Bem-vindo ao Sistema de Registo Criminal.",
      });
    } catch (error) {
      console.error('Login error:', error);
      
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: "Credenciais inválidas ou erro no servidor.",
      });
    } finally {
      setIsLoading(false);
    }
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
            Sistema de Registo Criminal
          </h1>
          <p className="text-gray-500 mt-2">Ministério da Justiça</p>
        </div>

        <Card className="gov-card">
          <CardHeader>
            <CardTitle>Autenticação de Oficial</CardTitle>
            <CardDescription>
              Insira as suas credenciais para acessar o sistema de registos criminais.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="gov-input"
                  placeholder="Insira o seu email"
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
          © {new Date().getFullYear()} Sistema de Registo Criminal - Todos os direitos reservados
        </p>
      </div>
    </div>
  );
};

export default Login;