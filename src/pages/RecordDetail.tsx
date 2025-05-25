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
  Check,
  X,
  Download,
  Printer,
  Shield,
  AlertTriangle
} from 'lucide-react';
import api from '@/lib/api';

interface CriminalRecord {
  id: number;
  active: boolean;
  cidadao: {
    id: number;
    full_name: string;
    numero_bi_nuit: string;
    endereco: string;
    data_nascimento: string;
    nacionalidade: string;
    provincia: string;
    distrito: string;
    naturalidade?: string | null;
    nome_pai?: string | null;
    nome_mae?: string | null;
    residencia?: string | null;
    estado_civil?: string | null;
    sexo?: string | null;
    data_emissao_bi?: string | null;
    data_validade_bi?: string | null;
    local_emissao_bi?: string | null;
  };
  numero_processo: string;
  tipo_ocorrencia: string;
  tribunal: string;
  setenca: string;
  data_ocorrencia: string;
  data_setenca: string;
  observacao: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
  cumprido: boolean;
  delected: boolean;
}

const RecordDetail = () => {
  const { recordNumber } = useParams<{ recordNumber: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [record, setRecord] = useState<CriminalRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!recordNumber) return;

      try {
        setIsLoading(true);
        // Substitua esta chamada mock pelo seu endpoint real
        const response = await api.get(`/records/${recordNumber}`);
        
        if (response.data && response.data.numero_processo === recordNumber) {
          setRecord(response.data);
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error('Error fetching record:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar registo",
          description: "Não foi possível carregar os detalhes do registo criminal.",
        });
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [recordNumber, toast]);

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

  if (!isValid || !record) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-6">
            <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Documento Inválido</h2>
            <p className="text-gray-600 mb-6">O registo criminal solicitado não é válido ou não foi encontrado no sistema.</p>
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
        <div className="rounded-lg border-2 p-6 mb-8 bg-green-50 border-green-200 text-green-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Check className="h-6 w-6 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold">Documento Válido</h1>
                <p className="text-sm opacity-80">Processo Nº {record.numero_processo}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Registado em</p>
              <p className="font-semibold">{new Date(record.created_at).toLocaleDateString('pt-PT')}</p>
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
                    <p className="text-gray-900 font-semibold text-lg">{record.cidadao.full_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Número de Identificação</label>
                    <p className="text-gray-900 font-mono">{record.cidadao.numero_bi_nuit}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Data de Nascimento</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{new Date(record.cidadao.data_nascimento).toLocaleDateString('pt-PT')}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Nacionalidade</label>
                    <p className="text-gray-900">{record.cidadao.nacionalidade}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Endereço</label>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      <p className="text-gray-900">{record.cidadao.endereco}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Província/Distrito</label>
                    <p className="text-gray-900">{record.cidadao.provincia} / {record.cidadao.distrito}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Criminal Record */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Registo Criminal
                </CardTitle>
                <CardDescription>
                  Detalhes do processo criminal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-400 pl-4 py-3 bg-red-50 rounded-r-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-red-900 mb-2">Número do Processo</h4>
                        <p className="text-red-800">{record.numero_processo}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-900 mb-2">Data da Ocorrência</h4>
                        <p className="text-red-800">{new Date(record.data_ocorrencia).toLocaleDateString('pt-PT')}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-900 mb-2">Tipo de Ocorrência</h4>
                        <p className="text-red-800">{record.tipo_ocorrencia}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-900 mb-2">Tribunal</h4>
                        <p className="text-red-800">{record.tribunal}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="font-semibold text-red-900 mb-2">Sentença</h4>
                        <p className="text-red-800">{record.setenca}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="font-semibold text-red-900 mb-2">Observações</h4>
                        <p className="text-red-800">{record.observacao}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Document Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gov-primary" />
                  Informações do Documento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Número do Processo</label>
                  <p className="text-gray-900 font-mono text-lg">{record.numero_processo}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Data de Registo</label>
                  <p className="text-gray-900">{new Date(record.created_at).toLocaleDateString('pt-PT')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Última Atualização</label>
                  <p className="text-gray-900">{new Date(record.updated_at).toLocaleDateString('pt-PT')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Estado</label>
                  <div className="flex items-center gap-2">
                    {record.active ? (
                      <>
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Ativo</span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 text-red-600" />
                        <span className="text-red-600">Inativo</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Validation Notice */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Documento Verificado</p>
                  <p>Este registo criminal foi validado com sucesso no sistema oficial.</p>
                </div>
              </div>
            </div>

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