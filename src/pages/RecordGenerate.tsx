import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { FileText, Printer, Download, Check, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
 } from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";



const RecordGenerate = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [citizen, setCitizen] = useState<any>(null);
  const [certificate, setCertificate] = useState<any>(null);
  const [request, setRequest] = useState<any>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [formData, setFormData] = useState({
      finalidade: 'EMPREGO',
      agencia: '',
      forma_pagamento: 'MBWAY',
      observacoes: ''
    });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!id) {
      navigate('/search');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [citizenRes, registrosRes] = await Promise.all([ api.get(`/pesquisar/cidadaos/${id}/`), api.get(`/cidadaos/${id}/registros/`)]);

        setCitizen({
          ...citizenRes.data,
          hasCriminalRecord: registrosRes.data.length > 0,
          recordDetails: registrosRes.data
        });

        // Check for existing request
        try {
          const requestRes = await api.get(`/solicitacoes/?cidadao=${id}`);
          if (requestRes.data.length > 0) {
            setRequest(requestRes.data[0]);
            
            // Check for existing certificate
            if (requestRes.data[0].certificado) {
              setCertificate(requestRes.data[0].certificado);
            }
          }
        } catch (error) {
          console.log('No existing request found');
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Cidadão não encontrado. Por favor, retorne à pesquisa.",
        });
        navigate('/search');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, toast]);

  const handleCreateRequest = async () => {
    try {
      const response = await api.post('/solicitacoes/', {
        cidadao: citizen.id,
        finalidade: 'EMPREGO',
        agencia: 'Agência Central',
        forma_pagamento: 'MBWAY'
      });
      setRequest("");
      toast({
        title: "Solicitação criada",
        description: "Solicitação de registro criada com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao criar solicitação.",
      });
    }
  };

  const generatePDF = async () => {
    if (!citizen) return;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const fontSize = 12;
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Header
    page.drawText('REPÚBLICA PORTUGUESA', {
      x: 50,
      y: height - 50,
      size: 16,
      font,
      color: rgb(0, 0, 0.8),
    });
    page.drawText('Ministério da Justiça', {
      x: 50,
      y: height - 70,
      size: 14,
      font,
    });

    // Title
    page.drawText('CERTIFICADO DE REGISTRO CRIMINAL', {
      x: 50,
      y: height - 120,
      size: 18,
      font,
      color: rgb(0, 0, 0.8),
    });

    // Citizen data
    let y = height - 180;
    page.drawText(`Nome: ${citizen.name}`, { x: 50, y, size: fontSize, font });
    y -= 20;
    page.drawText(`BI/NUIT: ${citizen.id}`, { x: 50, y, size: fontSize, font });
    y -= 20;
    page.drawText(`Data Nascimento: ${citizen.dob}`, { x: 50, y, size: fontSize, font });
    y -= 20;
    page.drawText(`Endereço: ${citizen.address}`, { x: 50, y, size: fontSize, font });
    y -= 40;

    // Result
    if (citizen.hasCriminalRecord) {
      page.drawText('RESULTADO: POSSUI REGISTROS CRIMINAIS', {
        x: 50,
        y,
        size: 14,
        font,
        color: rgb(0.8, 0, 0),
      });
      y -= 30;

      // Criminal records
      page.drawText('Detalhes dos Registros:', { x: 50, y, size: 14, font });
      y -= 20;

      citizen.recordDetails.forEach((record: any) => {
        page.drawText(`Processo: ${record.case}`, { x: 60, y, size: fontSize, font });
        y -= 15;
        page.drawText(`Tribunal: ${record.court}`, { x: 60, y, size: fontSize, font });
        y -= 15;
        page.drawText(`Infração: ${record.offense}`, { x: 60, y, size: fontSize, font });
        y -= 15;
        page.drawText(`Sentença: ${record.sentence}`, { x: 60, y, size: fontSize, font });
        y -= 15;
        page.drawText(`Data: ${record.date}`, { x: 60, y, size: fontSize, font });
        y -= 25;
      });
    } else {
      page.drawText('RESULTADO: NÃO POSSUI REGISTROS CRIMINAIS', {
        x: 50,
        y,
        size: 14,
        font,
        color: rgb(0, 0.6, 0),
      });
      y -= 30;
    }

    // Footer
    const today = new Date();
    const validity = new Date();
    validity.setDate(validity.getDate() + 90);
    
    page.drawText(`Emitido em: ${today.toLocaleDateString()}`, {
      x: 50,
      y: 100,
      size: fontSize,
      font,
    });
    page.drawText(`Válido até: ${validity.toLocaleDateString()}`, {
      x: 50,
      y: 80,
      size: fontSize,
      font,
    });

    // Signature
    page.drawText('_________________________', {
      x: width - 200,
      y: 60,
      size: fontSize,
      font,
    });
    page.drawText('Funcionário Responsável', {
      x: width - 200,
      y: 40,
      size: fontSize,
      font,
    });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  };

  const handleGenerateCertificate = async () => {
    if (!request) return;
    
    setGenerating(true);
    try {
      // Generate PDF
      const pdfBlob = await generatePDF();
      
      // Create form data to send PDF to server
      const formData = new FormData();
      formData.append('pdf', pdfBlob, `certificado-${id}.pdf`);
      
      // Send to backend
      const response = await api.post(`/certificados/${request.id}/gerar/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setCertificate(response.data);
      toast({
        title: "Certificado gerado",
        description: "O certificado foi gerado com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao gerar certificado.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = async () => {
    if (!certificate) return;
    
    try {
      const response = await api.get(`/certificados/${certificate.id}/pdf/`, {
        responseType: 'blob'
      });
      
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(pdfUrl);
      
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao imprimir documento.",
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDownload = async () => {
    if (!certificate) return;
    
    try {
      const response = await api.get(`/certificados/${certificate.id}/pdf/`, {
        responseType: 'blob'
      });
      
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `certificado-${citizen.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download iniciado",
        description: "O certificado está sendo baixado.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao baixar documento.",
      });
    }
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

  if (!citizen) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-lg text-gray-500">Cidadão não encontrado</p>
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
                  <p className="text-lg">{citizen.full_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Número de Identificação</h3>
                  <p className="text-lg">{citizen.numero_bi_nuit}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Data de Nascimento</h3>
                  <p className="text-lg">{citizen.data_nascimento}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Nacionalidade</h3>
                  <p className="text-lg">{citizen.nacionalidade}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Endereço</h3>
                  <p className="text-lg">{citizen.endereco}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Estado do Registro</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {citizen.hasCriminalRecord ? (
                      <>
                        <div className="bg-green-100 p-1 rounded-full">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                          <span className="text-green-600 font-medium">Com Registros Criminais</span>
                      </>
                    ) : (
                      <>
                        <div className="bg-red-100 p-1 rounded-full">
                          <X className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="text-red-600 font-medium">Sem Registros Criminais</span>
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
                            <td className="py-3">{record.numero_processo}</td>
                            <td className="py-3">{record.tribunal}</td>
                            <td className="py-3">{record.tipo_ocorrencia}</td>
                            <td className="py-3">{record.setenca}</td>
                            <td className="py-3">{record.data_ocorrencia}</td>
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
            {!request ? (
              <>
              <Button 
                // onClick={handleCreateRequest} 
                                  onClick={() => setIsRequestModalOpen(true)} 

                className="bg-gov-primary hover:bg-gov-secondary"
              >
                Criar Solicitação
              </Button>
              
              <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Criar Nova Solicitação</DialogTitle>
                      <DialogDescription>
                        Preencha os detalhes da solicitação para o cidadão {citizen.full_name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="finalidade" className="text-right">
                          Finalidade
                        </Label>
                        <Select 
                          value={formData.finalidade} 
                          onValueChange={(value) => handleSelectChange('finalidade', value)}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione a finalidade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EMPREGO">Emprego</SelectItem>
                            <SelectItem value="VIAGEM">Viagem</SelectItem>
                            <SelectItem value="OUTRO">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="agencia" className="text-right">
                          Agência
                        </Label>
                        <Input
                          id="agencia"
                          name="agencia"
                          value={formData.agencia}
                          onChange={handleInputChange}
                          className="col-span-3"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="forma_pagamento" className="text-right">
                          Forma de Pagamento
                        </Label>
                        <Select 
                          value={formData.forma_pagamento} 
                          onValueChange={(value) => handleSelectChange('forma_pagamento', value)}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione a forma de pagamento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MBWAY">MBWay</SelectItem>
                            <SelectItem value="TRANSFERENCIA">Transferência Bancária</SelectItem>
                            <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="observacoes" className="text-right">
                          Observações
                        </Label>
                        <Textarea
                          id="observacoes"
                          name="observacoes"
                          value={formData.observacoes}
                          onChange={handleInputChange}
                          className="col-span-3"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsRequestModalOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="button" 
                        className="bg-gov-primary hover:bg-gov-secondary"
                        onClick={handleCreateRequest}
                      >
                        Criar Solicitação
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

              
              </>
            ) : !certificate ? (
              <Button 
                onClick={handleGenerateCertificate} 
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

        {certificate && (
          <Card className="gov-card animate-fade-in">
            <CardHeader>
              <CardTitle>Documento Gerado com Sucesso</CardTitle>
              <CardDescription>Pré-visualização do certificado de registro criminal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-8 bg-white shadow-sm">
                <div className="flex justify-center mb-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gov-primary">REPÚBLICA DE MOÇAMBIQUE</h2>
                    <h3 className="text-lg">Ministério da Justiça</h3>
                    <p className="text-sm text-gray-500 mt-1">Direção-Geral da Administração da Justiça</p>
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <h1 className="text-xl font-bold uppercase">Certificado de Registro Criminal</h1>
                  <p className="text-sm text-gray-500">Documento Oficial - Nº {certificate.numero_referencia}</p>
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
                    <p>Documento emitido eletronicamente em {new Date(certificate.data_emissao).toLocaleDateString()}</p>
                    <p className="mt-1">Para validar este certificado, visite <span className="text-gov-primary">www.registocriminal.gov.pt</span> e introduza o código de verificação.</p>
                    <div className="mt-3 font-mono bg-gray-100 p-2 rounded">
                      {certificate.numero_referencia}
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