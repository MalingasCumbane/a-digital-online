
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { FileText, Printer, Download, Check, X, Loader2 } from 'lucide-react';

// Mock citizen data including criminal record info
const mockCitizenData = {
  '123456789': {
    id: '123456789',
    name: 'João Silva',
    dob: '1985-05-15',
    address: 'Av. da Liberdade, 123, Maputo',
    nationality: 'Portuguesa',
    hasCriminalRecord: false,
    recordDetails: null,
  },
  '987654321': {
    id: '987654321',
    name: 'Maria Santos',
    dob: '1990-10-25',
    address: 'Rua Augusta, 45, Maputo',
    nationality: 'Portuguesa',
    hasCriminalRecord: true,
    recordDetails: [
      {
        case: 'PROC-2020-789',
        court: 'Tribunal Judicial de Maputo',
        offense: 'Furto',
        sentence: 'Multa de 1000€',
        date: '2021-03-15',
      },
    ],
  },
  '456789123': {
    id: '456789123',
    name: 'António Ferreira',
    dob: '1978-03-08',
    address: 'Praça do Comércio, 7, Maputo',
    nationality: 'Portuguesa',
    hasCriminalRecord: false,
    recordDetails: null,
  },
};

const RecordGenerate = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [citizen, setCitizen] = useState<any>(null);
  const [recordGenerated, setRecordGenerated] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!id) {
      navigate('/search');
      return;
    }

    // Simulate API call to fetch citizen data
    setLoading(true);
    setTimeout(() => {
      const citizenData = mockCitizenData[id as keyof typeof mockCitizenData];
      if (citizenData) {
        setCitizen(citizenData);
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Cidadão não encontrado. Por favor, retorne à pesquisa.",
        });
        navigate('/search');
      }
      setLoading(false);
    }, 1200);
  }, [id, navigate, toast]);

  const handleGenerateRecord = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setRecordGenerated(true);
      toast({
        title: "Registro gerado com sucesso",
        description: "O documento PDF está pronto para impressão ou download.",
      });
    }, 2000);
  };

  const handlePrint = () => {
    toast({
      title: "A imprimir documento",
      description: "Enviando para a impressora...",
    });
    // In a real app, this would print the document
  };

  const handleDownload = () => {
    toast({
      title: "Download iniciado",
      description: "O seu documento PDF está a ser baixado.",
    });
    // In a real app, this would download the PDF file
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-gov-primary mb-4" />
            <p className="text-lg text-gray-500">Carregando dados do cidadão...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-semibold mb-1">Geração de Registro Criminal</h1>
        <p className="text-gray-500 mb-6">
          Visualize e gere um registro criminal para o cidadão selecionado.
        </p>

        <Card className="gov-card mb-6">
          <CardHeader className="border-b">
            <CardTitle>Dados do Cidadão</CardTitle>
            <CardDescription>Informação pessoal registrada no sistema</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nome Completo</h3>
                  <p className="text-lg">{citizen.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Número de Identificação</h3>
                  <p className="text-lg">{citizen.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Data de Nascimento</h3>
                  <p className="text-lg">{citizen.dob}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nacionalidade</h3>
                  <p className="text-lg">{citizen.nationality}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Endereço</h3>
                  <p className="text-lg">{citizen.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Estado do Registro</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {citizen.hasCriminalRecord ? (
                      <>
                        <div className="bg-red-100 p-1 rounded-full">
                          <X className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="text-red-600 font-medium">Com Registros Criminais</span>
                      </>
                    ) : (
                      <>
                        <div className="bg-green-100 p-1 rounded-full">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-green-600 font-medium">Sem Registros Criminais</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {citizen.hasCriminalRecord && (
              <>
                <Separator className="my-6" />
                <div>
                  <h3 className="text-lg font-semibold mb-4">Detalhes do Registro Criminal</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="pb-2 font-medium">Processo</th>
                          <th className="pb-2 font-medium">Tribunal</th>
                          <th className="pb-2 font-medium">Infração</th>
                          <th className="pb-2 font-medium">Sentença</th>
                          <th className="pb-2 font-medium">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {citizen.recordDetails.map((record: any, index: number) => (
                          <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                            <td className="py-3">{record.case}</td>
                            <td className="py-3">{record.court}</td>
                            <td className="py-3">{record.offense}</td>
                            <td className="py-3">{record.sentence}</td>
                            <td className="py-3">{record.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50 border-t flex justify-end gap-3">
            {!recordGenerated ? (
              <Button 
                onClick={handleGenerateRecord} 
                className="bg-gov-primary hover:bg-gov-secondary"
                disabled={generating}
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    A gerar documento...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Gerar Documento PDF
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar PDF
                </Button>
                <Button 
                  onClick={handlePrint}
                  className="bg-gov-primary hover:bg-gov-secondary"
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir Documento
                </Button>
              </>
            )}
          </CardFooter>
        </Card>

        {recordGenerated && (
          <Card className="gov-card animate-fade-in">
            <CardHeader>
              <CardTitle>Documento Gerado com Sucesso</CardTitle>
              <CardDescription>Pré-visualização do certificado de registro criminal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-8 bg-white shadow-sm">
                <div className="flex justify-center mb-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gov-primary">REPÚBLICA PORTUGUESA</h2>
                    <h3 className="text-lg">Ministério da Justiça</h3>
                    <p className="text-sm text-gray-500 mt-1">Direção-Geral da Administração da Justiça</p>
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <h1 className="text-xl font-bold uppercase">Certificado de Registro Criminal</h1>
                  <p className="text-sm text-gray-500">Documento Oficial - Nº {Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}/2023</p>
                </div>
                
                <div className="space-y-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Nome Completo</h3>
                      <p className="font-medium">{citizen.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Número de Identificação</h3>
                      <p className="font-medium">{citizen.id}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Data de Nascimento</h3>
                      <p className="font-medium">{citizen.dob}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Nacionalidade</h3>
                      <p className="font-medium">{citizen.nationality}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="py-2">
                    <h3 className="text-md font-semibold mb-2">Resultado da Pesquisa:</h3>
                    
                    {citizen.hasCriminalRecord ? (
                      <div className="bg-red-50 border border-red-100 rounded-md p-4">
                        <p className="font-medium text-red-800">
                          O cidadão acima identificado POSSUI registros criminais no sistema nacional.
                        </p>
                        <p className="text-sm text-red-700 mt-2">
                          Detalhes dos registros estão incluídos neste certificado.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-100 rounded-md p-4">
                        <p className="font-medium text-green-800">
                          O cidadão acima identificado NÃO POSSUI registros criminais no sistema nacional.
                        </p>
                        <p className="text-sm text-green-700 mt-2">
                          Este certificado é válido por 90 dias a partir da data de emissão.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {citizen.hasCriminalRecord && (
                    <div className="space-y-4">
                      <h3 className="text-md font-semibold">Detalhes dos Registros:</h3>
                      {citizen.recordDetails.map((record: any, index: number) => (
                        <div key={index} className="border rounded p-3 bg-gray-50">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium">Processo:</span> {record.case}
                            </div>
                            <div>
                              <span className="font-medium">Data:</span> {record.date}
                            </div>
                            <div>
                              <span className="font-medium">Tribunal:</span> {record.court}
                            </div>
                            <div>
                              <span className="font-medium">Infração:</span> {record.offense}
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium">Sentença:</span> {record.sentence}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-center text-sm text-gray-500 mt-10 pt-6 border-t">
                    <p>Documento emitido eletronicamente em {new Date().toLocaleDateString()} às {new Date().toLocaleTimeString()}</p>
                    <p className="mt-1">Para validar este certificado, visite <span className="text-gov-primary">www.registocriminal.gov.pt</span> e introduza o código de verificação.</p>
                    <div className="mt-3 font-mono bg-gray-100 p-2 rounded">
                      {Array.from({length: 6}, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()}-
                      {Array.from({length: 6}, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecordGenerate;

