import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Printer,
  Shield
} from 'lucide-react';
import api from '@/lib/api';

interface CriminalRecord {
  id: string;
  record_number: string;
  citizen_name: string;
  citizen_id: string;
  birth_date: string;
  birth_place: string;
  address: string;
  phone: string;
  email: string;
  status: 'clean' | 'pending' | 'convicted';
  issued_date: string;
  expiry_date: string;
  description?: string;
  convictions?: {
    date: string;
    crime: string;
    sentence: string;
    court: string;
  }[];
  officer_name: string;
  badge_number: string;
}

const RecordDetail = () => {
  const { recordNumber } = useParams<{ recordNumber: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [record, setRecord] = useState<CriminalRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!recordNumber) return;

      try {
        setIsLoading(true);
        const response = await api.get(`/records/${recordNumber}`);
        setRecord(response.data);
      } catch (error) {
        console.error('Error fetching record:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar registo",
          description: "Não foi possível carregar os detalhes do registo criminal.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [recordNumber, toast]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'clean':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'pending':
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      case 'convicted':
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <FileText className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'clean':
        return 'Registo Limpo';
      case 'pending':
        return 'Processo Pendente';
      case 'convicted':
        return 'Condenação Registada';
      default:
        return 'Estado Desconhecido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clean':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'convicted':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gov-primary/20 border-t-gov-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Carregando detalhes do registo...</p>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Registo não encontrado</h2>
            <p className="text-gray-600 mb-6">O registo criminal solicitado não foi encontrado no sistema.</p>
            <Button onClick={() => navigate('/')} className="bg-gov-primary hover:bg-gov-secondary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar à Pesquisa
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/" 
              className="inline-flex items-center text-gov-primary hover:text-gov-secondary transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar à Pesquisa
            </Link>
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-gov-primary" />
              <span className="font-semibold text-gray-900">Sistema de Registo Criminal</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        <div className={`rounded-lg border-2 p-6 mb-8 ${getStatusColor(record.status)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getStatusIcon(record.status)}
              <div>
                <h1 className="text-2xl font-bold">{getStatusText(record.status)}</h1>
                <p className="text-sm opacity-80">Registo Nº {record.record_number}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Emitido em</p>
              <p className="font-semibold">{new Date(record.issued_date).toLocaleDateString('pt-PT')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gov-primary" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Nome Completo</label>
                    <p className="text-gray-900 font-semibold text-lg">{record.citizen_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Número de Identificação</label>
                    <p className="text-gray-900 font-mono">{record.citizen_id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Data de Nascimento</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{new Date(record.birth_date).toLocaleDateString('pt-PT')}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Local de Nascimento</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{record.birth_place}</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Morada</label>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      <p className="text-gray-900">{record.address}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Telefone</label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-900">{record.phone}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-900">{record.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Criminal History */}
            {record.convictions && record.convictions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Histórico Criminal
                  </CardTitle>
                  <CardDescription>
                    Registo de condenações e processos criminais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {record.convictions.map((conviction, index) => (
                      <div key={index} className="border-l-4 border-red-400 pl-4 py-3 bg-red-50 rounded-r-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-red-900">{conviction.crime}</h4>
                          <span className="text-sm text-red-600">{new Date(conviction.date).toLocaleDateString('pt-PT')}</span>
                        </div>
                        <p className="text-red-800 mb-2">{conviction.sentence}</p>
                        <p className="text-sm text-red-600">Tribunal: {conviction.court}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Record Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gov-primary" />
                  Informações do Registo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Número do Registo</label>
                  <p className="text-gray-900 font-mono text-lg">{record.record_number}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Data de Emissão</label>
                  <p className="text-gray-900">{new Date(record.issued_date).toLocaleDateString('pt-PT')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Validade</label>
                  <p className="text-gray-900">{new Date(record.expiry_date).toLocaleDateString('pt-PT')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Oficial Responsável</label>
                  <p className="text-gray-900">{record.officer_name}</p>
                  <p className="text-sm text-gray-500">Crachá: {record.badge_number}</p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            {record.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{record.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Security Notice */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Documento Oficial</p>
                  <p>Este registo criminal é um documento oficial emitido pelo Ministério da Justiça. Qualquer falsificação é crime.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordDetail;
