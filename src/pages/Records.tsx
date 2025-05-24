import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Download, Printer, User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CriminalRecordsService } from '@/lib/api';

interface Cidadao {
  id: number;
  full_name: string;
  numero_bi_nuit: string;
  data_nascimento: string;
  distrito: string;
  endereco: string;
  provincia: string;
}

interface RegistroCriminal {
  id: number;
  cidadao: Cidadao;
  numero_processo: string;
  data_ocorrencia: string;
  data_setenca: string;
  setenca: string;
  tipo_ocorrencia: string;
  tribunal: string;
  observacao: string;
  cumprido: boolean;
  created_at: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RegistroCriminal[];
}

const Records = () => {
  const [records, setRecords] = useState<RegistroCriminal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total_records: 0,
    unique_citizens: 0,
    with_records: 0,
    today_records: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [recordsData, statsData] = await Promise.all([
          CriminalRecordsService.getAllRecords(searchTerm),
          CriminalRecordsService.getRecordStats()
        ]);
        
        // Ajuste para a estrutura da API
        const apiResponse = recordsData as ApiResponse;
        setRecords(apiResponse.results);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm]);

  const handleViewRecord = (cidadaoId: number) => {
    navigate(`/records/generate/${cidadaoId}`);
  };

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT');
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
            {loading ? (
              <div className="text-center py-10">Carregando...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-3 font-medium">Processo</th>
                      <th className="pb-3 font-medium">Cidadão</th>
                      <th className="pb-3 font-medium">BI/NUIT</th>
                      <th className="pb-3 font-medium">Data Ocorrência</th>
                      <th className="pb-3 font-medium">Sentença</th>
                      <th className="pb-3 font-medium">Tipo</th>
                      <th className="pb-3 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr 
                        key={record.id} 
                        className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3">{record.numero_processo}</td>
                        <td className="py-3">{record.cidadao.full_name}</td>
                        <td className="py-3">{record.cidadao.numero_bi_nuit}</td>
                        <td className="py-3">{formatDate(record.data_ocorrencia)}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            record.cumprido ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {record.setenca} {record.cumprido ? '(Cumprido)' : '(Pendente)'}
                          </span>
                        </td>
                        <td className="py-3">{record.tipo_ocorrencia}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleViewRecord(record.cidadao.id)}
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
            )}
            
            {!loading && records.length === 0 && (
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
                <p className="text-2xl font-bold">{stats.total_records}</p>
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
                <p className="text-2xl font-bold">{stats.unique_citizens}</p>
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
                <p className="text-2xl font-bold">{stats.with_records}</p>
              </div>
              <h3 className="mt-4 text-gray-500 font-medium">Com Sentença</h3>
            </CardContent>
          </Card>
          
          <Card className="gov-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-indigo-100 rounded-md">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <p className="text-2xl font-bold">{stats.today_records}</p>
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