
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FileText, User, Search, Check } from 'lucide-react';

// Mock data
const stats = [
  {
    title: 'Registos Emitidos',
    value: 346,
    icon: FileText,
    color: 'bg-blue-100 text-blue-600',
    change: '+12%',
  },
  {
    title: 'Pesquisas Realizadas',
    value: 584,
    icon: Search,
    color: 'bg-green-100 text-green-600',
    change: '+18%',
  },
  {
    title: 'Cidadãos Processados',
    value: 429,
    icon: User,
    color: 'bg-amber-100 text-amber-600',
    change: '+7%',
  },
  {
    title: 'Registos Limpos',
    value: 268,
    icon: Check,
    color: 'bg-indigo-100 text-indigo-600',
    change: '+4%',
  },
];

const recentRecords = [
  { id: 'CR-5932', name: 'Ana Silva', date: '2023-05-10', status: 'Emitido' },
  { id: 'CR-5931', name: 'João Santos', date: '2023-05-10', status: 'Pendente' },
  { id: 'CR-5930', name: 'Maria Oliveira', date: '2023-05-09', status: 'Emitido' },
  { id: 'CR-5929', name: 'António Costa', date: '2023-05-09', status: 'Emitido' },
  { id: 'CR-5928', name: 'Carla Mendes', date: '2023-05-08', status: 'Emitido' },
];

const Dashboard = () => {
  const [greeting, setGreeting] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Bom dia');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Boa tarde');
    } else {
      setGreeting('Boa noite');
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUsername(userData.name);
    }
  }, []);

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-semibold mb-1">Painel de Controle</h1>
        <p className="text-gray-500 mb-6">
          {greeting}, {username}! Bem-vindo ao Sistema de Registo Criminal.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="animate-fade-in gov-card" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="bg-green-50 text-green-600 text-xs font-medium px-2 py-1 rounded">
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="gov-card animate-fade-in">
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Últimos registos criminais processados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-2 font-medium">Reg. ID</th>
                      <th className="pb-2 font-medium">Nome</th>
                      <th className="pb-2 font-medium">Data</th>
                      <th className="pb-2 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRecords.map((record, index) => (
                      <tr 
                        key={record.id}
                        className="border-b last:border-b-0 hover:bg-gray-50 transition-colors animate-slide-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <td className="py-3">{record.id}</td>
                        <td className="py-3">{record.name}</td>
                        <td className="py-3">{record.date}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            record.status === 'Emitido'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="gov-card animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardHeader>
              <CardTitle>Informação Rápida</CardTitle>
              <CardDescription>Instruções e links úteis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <h4 className="font-medium text-blue-800 mb-1">Processar Novo Registo</h4>
                <p className="text-sm text-blue-700">
                  Para emitir um novo certificado de registo criminal, comece por pesquisar o cidadão pela página de pesquisa.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors border">
                  <div className="bg-gov-primary/10 p-2 rounded">
                    <Search className="h-4 w-4 text-gov-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Pesquisar Cidadão</h4>
                    <p className="text-sm text-gray-500">
                      Procure por número de ID ou nome
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors border">
                  <div className="bg-gov-primary/10 p-2 rounded">
                    <FileText className="h-4 w-4 text-gov-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Registos Recentes</h4>
                    <p className="text-sm text-gray-500">
                      Acesse os últimos registos processados
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
