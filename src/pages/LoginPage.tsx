
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Lock, ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');

      const response = await api.post('/login/', data);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('isAuthenticated', 'true');

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <div className="mb-8 animate-fade-in">
          <Link 
            to="/" 
            className="inline-flex items-center text-gov-primary hover:text-gov-secondary transition-colors duration-200 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Voltar à página inicial</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-10 animate-slide-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gov-primary rounded-full blur-xl opacity-20 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-br from-gov-primary to-gov-secondary rounded-full shadow-lg">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Sistema de Registo Criminal
          </h1>
          <p className="text-gray-600 text-lg font-medium">Ministério da Justiça</p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-gov-primary to-gov-secondary mx-auto rounded-full"></div>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm animate-scale-in">
          <CardHeader className="space-y-4 pb-8">
            <div className="flex items-center justify-center gap-3">
              <Lock className="h-6 w-6 text-gov-primary" />
              <CardTitle className="text-2xl font-bold text-gray-900">Autenticação Oficial</CardTitle>
            </div>
            <CardDescription className="text-center text-gray-600 text-base leading-relaxed">
              Insira as suas credenciais para acessar o sistema seguro de registos criminais
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email ou Nome de Utilizador
                </label>
                <Input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="oficial@justica.gov.pt"
                  className="h-12 bg-white border-gray-200 focus:border-gov-primary focus:ring-gov-primary/20 transition-all duration-200"
                  required
                />
              </div>
              
              <div className="space-y-3">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Palavra-passe
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="h-12 pr-12 bg-white border-gray-200 focus:border-gov-primary focus:ring-gov-primary/20 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="rounded border-gray-300 text-gov-primary focus:ring-gov-primary"
                  />
                  <label htmlFor="remember" className="text-gray-600">Lembrar-me</label>
                </div>
                <a href="#" className="text-gov-primary hover:text-gov-secondary transition-colors duration-200 font-medium">
                  Esqueceu a palavra-passe?
                </a>
              </div>
            </CardContent>
            
            <CardFooter className="pt-6">
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-gov-primary to-gov-secondary hover:from-gov-secondary hover:to-gov-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Autenticando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Entrar no Sistema
                  </div>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Acesso Seguro</p>
              <p>Esta é uma área restrita. Todas as atividades são monitorizadas e registadas para fins de segurança.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 animate-fade-in">
          <p>© {new Date().getFullYear()} Sistema de Registo Criminal</p>
          <p className="mt-1">Ministério da Justiça - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
