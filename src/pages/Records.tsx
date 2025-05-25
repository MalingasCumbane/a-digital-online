
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Download, Printer, User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock records data
const mockRecords = [
  { 
    id: 'CR-5932', 
    citizen: 'Ana Silva', 
    citizenId: '123451234',
    date: '2023-05-10', 
    status: 'Emitido',
    hasCriminalRecord: false,
  },
  { 
    id: 'CR-5931', 
    citizen: 'João Santos', 
    citizenId: '987654321',
    date: '2023-05-10', 
    status: 'Emitido',
    hasCriminalRecord: true,
  },
  { 
    id: 'CR-5930', 
    citizen: 'Maria Oliveira', 
    citizenId: '123456789',
    date: '2023-05-09', 
    status: 'Emitido',
    hasCriminalRecord: false,
  },
  { 
    id: 'CR-5929', 
    citizen: 'António Costa', 
    citizenId: '456789123',
    date: '2023-05-09', 
    status: 'Emitido',
    hasCriminalRecord: false,
  },
  { 
    id: 'CR-5928', 
    citizen: 'Carla Mendes', 
    citizenId: '789123456',
    date: '2023-05-08', 
    status: 'Emitido',
    hasCriminalRecord: true,
  },
];

const Records = () => {
  const [records, setRecords] = useState(mockRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    
    if (e.target.value === '') {
      setRecords(mockRecords);
    } else {
      const filteredRecords = mockRecords.filter(record => 
        record.id.toLowerCase().includes(e.target.value.toLowerCase()) ||
        record.citizen.toLowerCase().includes(e.target.value.toLowerCase()) ||
        record.citizenId.includes(e.target.value)
      );
      setRecords(filteredRecords);
    }
  };

  const handleViewRecord = (citizenId: string) => {
    navigate(`/records/generate/${citizenId}`);
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-semibold mb-1">Registros Criminais</h1>
        <p className="text-gray-500 mb-6">
          Visualize e gerencie todos os registros criminais emitidos.
        </p>

        <Card className="gov-card mb-6">
          <CardHeader className="border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Todos os Registros</CardTitle>
              <CardDescription>Histórico de certificados de registro criminal emitidos</CardDescription>
            </div>
            <div className="w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Pesquisar registros..."
                  className="pl-10 w-full sm:w-[300px]"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-3 font-medium">Registro ID</th>
                    <th className="pb-3 font-medium">Cidadão</th>
                    <th className="pb-3 font-medium">ID Cidadão</th>
                    <th className="pb-3 font-medium">Data</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Resultado</th>
                    <th className="pb-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr 
                      key={record.id} 
                      className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3">{record.id}</td>
                      <td className="py-3">{record.citizen}</td>
                      <td className="py-3">{record.citizenId}</td>
                      <td className="py-3">{record.date}</td>
                      <td className="py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {record.status}
                        </span>
                      </td>
                      <td className="py-3">
                        {record.hasCriminalRecord ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Com Registros
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Limpo
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleViewRecord(record.citizenId)}
                            title="Ver Registro"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Baixar PDF">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Imprimir">
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {records.length === 0 && (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Nenhum registro encontrado</h3>
                <p className="mt-1 text-gray-500">
                  Não existem registros que correspondam aos seus critérios de pesquisa.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-blue-100 rounded-md">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold">{mockRecords.length}</p>
              </div>
              <h3 className="mt-4 text-gray-500 font-medium">Total de Registros</h3>
            </CardContent>
          </Card>
          
          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-green-100 rounded-md">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold">{new Set(mockRecords.map(r => r.citizenId)).size}</p>
              </div>
              <h3 className="mt-4 text-gray-500 font-medium">Cidadãos Únicos</h3>
            </CardContent>
          </Card>
          
          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-amber-100 rounded-md">
                  <FileText className="h-5 w-5 text-amber-600" />
                </div>
                <p className="text-2xl font-bold">{mockRecords.filter(r => r.hasCriminalRecord).length}</p>
              </div>
              <h3 className="mt-4 text-gray-500 font-medium">Com Registros</h3>
            </CardContent>
          </Card>
          
          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-indigo-100 rounded-md">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <p className="text-2xl font-bold">{mockRecords.filter(r => r.date === new Date().toISOString().split('T')[0]).length}</p>
              </div>
              <h3 className="mt-4 text-gray-500 font-medium">Hoje</h3>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Records;
