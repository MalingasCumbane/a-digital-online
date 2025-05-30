
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Search, FileCheck, Plus, Calendar, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import CreateCriminalRecordModal from '@/components/CreateCriminalRecordModal';
import api from '@/lib/api';

type CriminalRecordRequest = {
  id: string;
  cidadao_nome: string;
  cidadao_bi: string;
  data_solicitacao: string;
  status: 'PENDENTE' | 'EM_PROCESSAMENTO' | 'CONCLUIDO';
  motivo: string;
  cidadao_id: number;
};

const CriminalRecordRequests = () => {
  const [requests, setRequests] = useState<CriminalRecordRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<CriminalRecordRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/all/solicitacoes/');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar solicitações.",
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter(request =>
    request.cidadao.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.cidadao.numero_bi_nuit.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'EM_PROCESSAMENTO':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Em Processamento</Badge>;
      case 'CONCLUIDO':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Concluído</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleCreateRecord = (request: CriminalRecordRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleRecordCreated = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
    fetchRequests();
    toast({
      title: "Sucesso",
      description: "Registo criminal criado com sucesso.",
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Solicitações de Registo Criminal</h1>
            <p className="text-gray-500">Gerir e processar solicitações de certificados de registo criminal</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar por nome ou número de BI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{request.cidadao.full_name}</span>
                      </div>
                      <span className="text-sm text-gray-500">BI: {request.cidadao.numero_bi_nuit}</span>
                      {getStatusBadge(request.estado)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(request.data_solicitacao).toLocaleDateString('pt-PT')}</span>
                      </div>
                      <span>Motivo: {request.finalidade}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {request.estado === 'PENDENTE' && (
                      <Button
                        onClick={() => handleCreateRecord(request)}
                        className="bg-gov-primary hover:bg-gov-secondary"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Registo
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma solicitação encontrada
              </h3>
              <p className="text-gray-500">
                {searchTerm ? 'Tente ajustar os termos de pesquisa.' : 'Não há solicitações pendentes no momento.'}
              </p>
            </CardContent>
          </Card>
        )}
    
        <CreateCriminalRecordModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          request={selectedRequest}
          onRecordCreated={handleRecordCreated}
        />
      </div>
    </DashboardLayout>
  );
};

export default CriminalRecordRequests;