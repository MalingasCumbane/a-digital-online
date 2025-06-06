import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { FileText, Printer, Download, Check, X, Loader2, RefreshCw, User, Calendar, MapPin, Home, Fingerprint, Heart, Users, Flag, Briefcase, Smartphone } from 'lucide-react';
import api from '@/lib/api';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import {
  Dialog,
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
import { Badge } from "@/components/ui/badge";

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
    observacoes: '',
    telefone: ''
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
        const [citizenRes, registosRes] = await Promise.all([
          api.get(`/pesquisar/cidadaos/${id}/`),
          api.get(`/cidadaos/${id}/registos/`)
        ]);

        const citizenData = {
          ...citizenRes.data,
          hasCriminalRecord: registosRes.data.length > 0,
          recordDetails: registosRes.data
        };
        setCitizen(citizenData);

        try {
          const requestRes = await api.get(`/${id}/solicitacoes/?cidadao=${id}&expand=certificado`);
          if (requestRes.data.length > 0) {
            const requestData = requestRes.data.find((req: any) => 
              req.cidadao === id || req.cidadao?.id === id
            );
            
            if (requestData) {
              setRequest(requestData);
              
              if (requestData.certificado) {
                if (typeof requestData.certificado === 'object') {
                  setCertificate(requestData.certificado);
                } else {
                  const certResponse = await api.get(`/certificados/${requestData.certificado}/`);
                  setCertificate(certResponse.data);
                }
              }
            }
          }
        } catch (error) {
          console.log('Error checking requests:', error);
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
        const response = await api.post(`${id}/solicitacoes/`, {
          cidadao: citizen.id,
          finalidade: formData.finalidade,
          agencia: formData.agencia,
          forma_pagamento: formData.forma_pagamento,
          observacoes: formData.observacoes,
          telefone: formData.telefone
        });
        
        const requestWithCert = await api.get(`/solicitacoes/${response.data.id}/?expand=certificado`);
        setRequest(requestWithCert.data);
        
        if (requestWithCert.data.certificado) {
          if (typeof requestWithCert.data.certificado === 'object') {
            setCertificate(requestWithCert.data.certificado);
          } else {
            const certResponse = await api.get(`/certificados/${requestWithCert.data.certificado}/`);
            setCertificate(certResponse.data);
          }
        }
        
        toast({
          title: "Solicitação criada",
          description: "Solicitação de registo criada com sucesso.",
        });
        setIsRequestModalOpen(false);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: error.response?.data?.message || "Falha ao criar solicitação.",
        });
        setIsRequestModalOpen(false);
      }
    };
// .
    const handleGenerateCertificate = async () => {
        if (!request) return;
        
        setGenerating(true);
        try {
          const pdfBlob = await generatePDF();
          const formData = new FormData();
          formData.append('pdf', pdfBlob, `certificado-${id}.pdf`);
          
          const response = await api.post(`/certificados/${request.id}/gerar/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          const updatedRequest = await api.get(`/solicitacoes/${request.id}/?expand=certificado`);
          setRequest(updatedRequest.data);
          setCertificate(response.data);
          
          toast({
            title: "Certificado gerado",
            description: "O certificado foi gerado com sucesso.",
          });
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Erro",
            description: error.response?.data?.message || "Falha ao gerar certificado.",
          });
        } finally {
          setGenerating(false);
        }
      };

    
  const handleDownload = async () => {
    if (!citizen) return;
    
    try {
      setGenerating(true);
      const pdfBlob = await generatePDF();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `certificado-${citizen.numero_bi_nuit}.pdf`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(pdfUrl);
      }, 100);

      toast({
        title: "Download iniciado",
        description: "O certificado foi baixado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao gerar o documento PDF.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = async () => {
    if (!citizen) return;
    
    try {
      setGenerating(true);
      const pdfBlob = await generatePDF();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(pdfUrl);
      
      if (printWindow) {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 500);
      }
      
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 10000);
      
    } catch (error) {
      console.error('Erro ao gerar PDF para impressão:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao preparar o documento para impressão.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleRefreshCertificate = async () => {
      if (!certificate) return;
      
      try {
        setGenerating(true);
        const response = await api.get(`/certificados/actualizar/${certificate.id}/`);
        setCertificate(response.data);
        
        toast({
          title: "Certificado atualizado",
          description: "Os dados do certificado foram atualizados.",
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: error.response?.data?.message || "Falha ao atualizar certificado.",
        });
      } finally {
        setGenerating(false);
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

  const generatePDF = async () => {
    if (!citizen) return;
  
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();
    const fontSize = 11;
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
    const black = rgb(0, 0, 0);
    const darkBlue = rgb(0, 0.2, 0.4);
  
    const formatDate = (dateString: string) => {
      if (!dateString) return '_________________________';
      const date = new Date(dateString);
      return `${date.getDate()} de ${getMonthName(date.getMonth())} de ${date.getFullYear()}`;
    };
  
    page.drawText('2571066/2025 REPARTIÇÃO CENTRAL', {
      x: 50,
      y: height - 40,
      size: 10,
      font,
      color: black,
    });
  
    page.drawText('MINISTÉRIO DA JUSTIÇA DE MOÇAMBIQUE', {
      x: 50,
      y: height - 60,
      size: 14,
      font: boldFont,
      color: darkBlue,
    });
  
    page.drawText('MINISTÉRIO DA JUSTIÇA, ASSUNTOS CONSTITUCIONAIS E RELIGIOSOS', {
      x: 50,
      y: height - 80,
      size: 10,
      font,
      color: black,
    });
  
    page.drawText('DIRECÇÃO NACIONAL DOS REGISTOS E NOTARIADO', {
      x: 50,
      y: height - 95,
      size: 10,
      font,
      color: black,
    });
  
    page.drawText('REPARTIÇÃO CENTRAL DO REGISTO CRIMINAL', {
      x: 50,
      y: height - 110,
      size: 10,
      font: boldFont,
      color: black,
    });
  
    // Título
    page.drawText('CERTIFICADO DE REGISTO CRIMINAL', {
      x: 50,
      y: height - 140,
      size: 16,
      font: boldFont,
      color: darkBlue,
    });
  
    // Dados do cidadão
    let y = height - 180;
    
    // Nome
    page.drawText('Nome:', { x: 50, y, size: fontSize, font: boldFont, color: black });
    page.drawText(citizen.full_name || '_________________________', { x: 100, y, size: fontSize, font, color: black });
    y -= 20;
  
    // Filho de
    page.drawText('filho de', { x: 50, y, size: fontSize, font, color: black });
    page.drawText(citizen.nome_pai || '_________________________', { x: 100, y, size: fontSize, font, color: black });
    y -= 20;
  
    // e de
    page.drawText('e de', { x: 50, y, size: fontSize, font, color: black });
    page.drawText(citizen.nome_mae || '_________________________', { x: 100, y, size: fontSize, font, color: black });
    y -= 20;
  
    // Naturalidade
    page.drawText('natural da localidade de', { x: 50, y, size: fontSize, font, color: black });
    page.drawText(citizen.naturalidade || '_________________________', { x: 200, y, size: fontSize, font, color: black });
    y -= 20;
  
    // Data de nascimento
    page.drawText('nascido em', { x: 50, y, size: fontSize, font, color: black });
    page.drawText(formatDate(citizen.data_nascimento) || '_________________________', { x: 120, y, size: fontSize, font, color: black });
    y -= 20;
  
    // Domicílio
    page.drawText('com domicílio em', { x: 50, y, size: fontSize, font, color: black });
    page.drawText(citizen.residencia || '_________________________', { x: 160, y, size: fontSize, font, color: black });
    y -= 20;
  
    // Província
    page.drawText('Província de', { x: 50, y, size: fontSize, font, color: black });
    page.drawText(citizen.provincia || '_________________________', { x: 130, y, size: fontSize, font, color: black });
    y -= 20;
  
    // BI/NUIT
    page.drawText('titular do Bilhete de Identidade', { x: 50, y, size: fontSize, font, color: black });
    page.drawText(citizen.numero_bi_nuit || '_________________________', { x: 230, y, size: fontSize, font, color: black });
    y -= 20;
  
    // Local de emissão do BI
    page.drawText('emitido pelo Arquivo de Identificação Civil de', { x: 50, y, size: fontSize, font, color: black });
    page.drawText(citizen.local_emissao_bi || '_________________________', { x: 300, y, size: fontSize, font, color: black });
    y -= 20;
  
    // Data emissão BI e estado civil
    page.drawText('em', { x: 50, y, size: fontSize, font, color: black });
    page.drawText(citizen.data_emissao_bi || '_________________________', { x: 80, y, size: fontSize, font, color: black });
    page.drawText(`, estado civil`, { x: 80 + (citizen.data_emissao_bi?.length * 5 || 100), y, size: fontSize, font, color: black });
    page.drawText(citizen.estado_civil || '_________________________', { x: 200, y, size: fontSize, font, color: black });
    y -= 20;
  
    // Finalidade
    page.drawText('E lhe passado o Certificado do Registo Criminal que se destina a', { x: 50, y, size: fontSize, font, color: black });
    y -= 20;
    page.drawText(formData.finalidade === 'EMPREGO' ? 'Emprego' : formData.finalidade === 'VIAGEM' ? 'Viagem' : 'Outros Fins', {
      x: 50,
      y,
      size: fontSize,
      font: boldFont,
      color: black,
    });
    y -= 40;
  
    // Número do certificado
    const certNumber = `15-${Math.floor(1000 + Math.random() * 9000)}`;
    page.drawText(certNumber, {
      x: width - 100,
      y,
      size: 12,
      font: boldFont,
      color: darkBlue,
    });
    y -= 30;
  
    // Resultado
    if (citizen.hasCriminalRecord) {
      page.drawText('CERTIFICA-SE QUE O REQUERENTE POSSUI OS SEGUINTES REGISTOS CRIMINAIS:', {
        x: 50,
        y,
        size: fontSize,
        font: boldFont,
        color: black,
      });
      y -= 30;
  
      citizen.recordDetails.forEach((record: any) => {
        page.drawText(`Processo: ${record.numero_processo}`, { x: 60, y, size: fontSize, font, color: black });
        y -= 15;
        page.drawText(`Data: ${record.data_ocorrencia}`, { x: 60, y, size: fontSize, font, color: black });
        y -= 15;
        page.drawText(`Tribunal: ${record.tribunal}`, { x: 60, y, size: fontSize, font, color: black });
        y -= 15;
        page.drawText(`Infração: ${record.tipo_ocorrencia}`, { x: 60, y, size: fontSize, font, color: black });
        y -= 15;
        page.drawText(`Sentença: ${record.setenca}`, { x: 60, y, size: fontSize, font, color: black });
        y -= 25;
      });
    } else {
      page.drawText('CERTIFICA - SE QUE NESTA REPARTIÇÃO NADA CONSTA, RELATIVAMENTE AO REQUERENTE SUPRA IDENTIFICADO', {
        x: 50,
        y,
        size: fontSize,
        font: boldFont,
        color: black,
      });
      y -= 30;
    }
  
    // Rodapé
    const today = new Date();
    const formattedDate = `${today.getDate()} de ${getMonthName(today.getMonth())} de ${today.getFullYear()}`;
  
    page.drawText(`Maputo, ${formattedDate}`, {
      x: 50,
      y: 100,
      size: fontSize,
      font,
      color: black,
    });
  
    page.drawText('O Director da Repartição', {
      x: 50,
      y: 80,
      size: fontSize,
      font,
      color: black,
    });
  
    page.drawText('GRUPO 3 Eng. Software', {
      x: 50,
      y: 60,
      size: fontSize,
      font: boldFont,
      color: black,
    });
  
    page.drawText('(Conservador e Notário Superior)', {
      x: 50,
      y: 40,
      size: fontSize - 2,
      font,
      color: black,
    });
  
    page.drawText('Página 1 de 1', {
      x: width - 100,
      y: 30,
      size: 10,
      font,
      color: black,
    });
  
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  };


  const getMonthName = (month: number) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[month];
};

    const checkCertificate = async () => {
    try {
      const response = await api.get(`/verificar_certificado/${citizen.id}/verif_certificado/`);
      const { has_request, is_approved, has_certificate, certificate_id } = response.data;
      
      if (has_request && is_approved && has_certificate) {
        const data = {
          'get_certificate': "get_certificate",
          'certificate_id': certificate_id
        }

        const certResponse = await api.post(`/records/certificate/`, data);
        setCertificate(certResponse.data);
      }
    } catch (error) {
      console.error('Erro ao verificar certificado:', error);
    }
  };

  useEffect(() => {
    if (citizen) {
      checkCertificate();
    }
  }, [citizen]);



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
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Registo Criminal</h1>
            <p className="text-gray-600">Detalhes completos do cidadão e registos criminais</p>
          </div>
          <Badge variant={citizen.hasCriminalRecord ? "destructive" : "success"} className="px-3 py-1 text-sm">
            {citizen.hasCriminalRecord ? "COM REGISTOS" : "SEM REGISTOS"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1 - Dados Pessoais */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gov-primary" />
                  <CardTitle className="text-lg">Dados Pessoais</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-1">
                  <Label className="text-gray-500 flex items-center">
                    <span className="mr-2">Nome Completo</span>
                  </Label>
                  <p className="font-medium">{citizen.full_name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-gray-500 flex items-center">
                      <Fingerprint className="h-4 w-4 mr-2" />
                      BI/NUIT
                    </Label>
                    <p className="font-medium">{citizen.numero_bi_nuit}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Data Nascimento
                    </Label>
                    <p className="font-medium">{citizen.data_nascimento}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-gray-500 flex items-center">
                      <Heart className="h-4 w-4 mr-2" />
                      Estado Civil
                    </Label>
                    <p className="font-medium">{citizen.estado_civil}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-500 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Sexo
                    </Label>
                    <p className="font-medium">{citizen.sexo}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-gray-500 flex items-center">
                    <Flag className="h-4 w-4 mr-2" />
                    Nacionalidade
                  </Label>
                  <p className="font-medium">{citizen.nacionalidade}</p>
                </div>
              </CardContent>
            </Card>

            {/* Documentos */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center space-x-3">
                  <Fingerprint className="h-5 w-5 text-gov-primary" />
                  <CardTitle className="text-lg">Documentos</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-1">
                  <Label className="text-gray-500">Local Emissão BI</Label>
                  <p className="font-medium">{citizen.local_emissao_bi}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-gray-500">Data Emissão BI</Label>
                    <p className="font-medium">{citizen.data_emissao_bi}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-500">Data Validade BI</Label>
                    <p className="font-medium">{citizen.data_validade_bi}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna 2 - Morada e Naturalidade */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gov-primary" />
                  <CardTitle className="text-lg">Morada</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-1">
                  <Label className="text-gray-500">Endereço</Label>
                  <p className="font-medium">{citizen.endereco}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-gray-500">Província</Label>
                    <p className="font-medium">{citizen.provincia}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-500">Distrito</Label>
                    <p className="font-medium">{citizen.distrito}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Residência</Label>
                  <p className="font-medium">{citizen.residencia}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center space-x-3">
                  <Home className="h-5 w-5 text-gov-primary" />
                  <CardTitle className="text-lg">Naturalidade</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-1">
                  <Label className="text-gray-500">Localidade</Label>
                  <p className="font-medium">{citizen.naturalidade}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Nome do Pai</Label>
                  <p className="font-medium">{citizen.nome_pai}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Nome da Mãe</Label>
                  <p className="font-medium">{citizen.nome_mae}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna 3 - Estado e Ações */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5 text-gov-primary" />
                  <CardTitle className="text-lg">Estado do Registo</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className={`p-4 rounded-lg ${citizen.hasCriminalRecord ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'}`}>
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full ${citizen.hasCriminalRecord ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {citizen.hasCriminalRecord ? <X className="h-5 w-5" /> : <Check className="h-5 w-5" />}
                    </div>
                    <div className="ml-3">
                      <h3 className={`font-medium ${citizen.hasCriminalRecord ? 'text-red-800' : 'text-green-800'}`}>
                        {citizen.hasCriminalRecord ? 'Com Registos Criminais' : 'Sem Registos Criminais'}
                      </h3>
                      <p className={`text-sm mt-1 ${citizen.hasCriminalRecord ? 'text-red-700' : 'text-green-700'}`}>
                        {citizen.hasCriminalRecord ? 
                          'Este cidadão possui registos no sistema nacional.' : 
                          'Nada consta sobre este cidadão no registo criminal.'}
                      </p>
                    </div>
                  </div>
                </div>

                {citizen.hasCriminalRecord && (
                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium text-gray-900">Detalhes dos Registos</h4>
                    <div className="space-y-3">
                      {citizen.recordDetails.map((record: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3 bg-gray-50">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium text-gray-500">Processo:</span> {record.numero_processo}
                            </div>
                            <div>
                              <span className="font-medium text-gray-500">Data:</span> {record.data_ocorrencia}
                            </div>
                            <div>
                              <span className="font-medium text-gray-500">Tribunal:</span> {record.tribunal}
                            </div>
                            <div>
                              <span className="font-medium text-gray-500">Infração:</span> {record.tipo_ocorrencia}
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium text-gray-500">Sentença:</span> {record.setenca}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-gray-50 border-t flex justify-end gap-3">
              {/* Sem solicitação */}
              {!request && (
                <Button 
                  onClick={() => setIsRequestModalOpen(true)} 
                  className="bg-gov-primary hover:bg-gov-secondary"
                >
                  Criar Solicitação
                </Button>
              )}
              
              {/* Com solicitação não aprovada */}
              {request && request.estado !== 'APROVADO' && (
                <div className="flex items-center gap-2 text-orange-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Aguardando aprovação do Tribunal</span>
                </div>
              )}
              
              {/* Solicitação aprovada sem certificado */}
              {request && request.estado === 'APROVADO' && !certificate && (
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
                      Gerar Documento
                    </>
                  )}
                </Button>
              )}
              
              {/* Com certificado */}
              {certificate && (
                <div className="flex flex-col space-y-3 w-full">
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline"
                      onClick={handleDownload}
                      disabled={generating}
                      className="flex-1"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Baixar
                    </Button>
                    <Button 
                      onClick={handlePrint}
                      className="bg-gov-primary hover:bg-gov-secondary flex-1"
                      disabled={generating}
                    >
                      <Printer className="mr-2 h-4 w-4" />
                      Imprimir
                    </Button>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={handleRefreshCertificate}
                    disabled={generating}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Actualizar Dados
                  </Button>
                </div>
              )}
            </CardFooter>
            </Card>

            {/* Status do Sistema */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-gov-primary" />
                  <CardTitle className="text-lg">Status do Sistema</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-gray-500">Ativo</Label>
                    <Badge variant={citizen.active ? "success" : "destructive"}>
                      {citizen.active ? "SIM" : "NÃO"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-500">Eliminado</Label>
                    <Badge variant={citizen.delected ? "destructive" : "success"}>
                      {citizen.delected ? "SIM" : "NÃO"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-500">Última Atualização</Label>
                  <p className="font-medium">{citizen.updated_at}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal de Criação de Solicitação (manter o mesmo) */}
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
                    <SelectItem value="CARTACONDUCAO">Carta de condução</SelectItem>
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
                <Label htmlFor="telefone" className="text-right">
                  Nr. telefone
                </Label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder='+2580000000'
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
                    <SelectItem value="EMOLA">Emola</SelectItem>
                    <SelectItem value="MPESA">M-Pesa</SelectItem>
                    <SelectItem value="NUMERARIO">Numerário</SelectItem>
                    <SelectItem value="PAYPAL">Paypal</SelectItem>
                    <SelectItem value="VISA">Visa</SelectItem>
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

        {certificate && (
          <Card className="gov-card animate-fade-in">
            <CardHeader>
              <CardTitle>Documento Gerado com Sucesso</CardTitle>
              <CardDescription>Pré-visualização do certificado de registo criminal</CardDescription>
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
                  <h1 className="text-xl font-bold uppercase">Certificado de Registo Criminal</h1>
                  <p className="text-sm text-gray-500">Documento Oficial - Nº {certificate.numero_referencia}</p>
                </div>
                
                <div className="space-y-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Nome Completo</h3>
                      <p className="font-medium">{citizen.full_name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Número de Identificação</h3>
                      <p className="font-medium">{citizen.numero_bi_nuit}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Data de Nascimento</h3>
                      <p className="font-medium">{citizen.data_nascimento}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Nacionalidade</h3>
                      <p className="font-medium">{citizen.nacionalidade}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="py-2">
                    <h3 className="text-md font-semibold mb-2">Resultado da Pesquisa:</h3>
                    
                    {citizen.hasCriminalRecord ? (
                      <div className="bg-red-50 border border-red-100 rounded-md p-4">
                        <p className="font-medium text-red-800">
                          O cidadão acima identificado POSSUI registos criminais no sistema nacional.
                        </p>
                        <p className="text-sm text-red-700 mt-2">
                          Detalhes dos registos estão incluídos neste certificado.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-100 rounded-md p-4">
                        <p className="font-medium text-green-800">
                          O cidadão acima identificado NÃO POSSUI registos criminais no sistema nacional.
                        </p>
                        <p className="text-sm text-green-700 mt-2">
                          Este certificado é válido por 90 dias a partir da data de emissão.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {citizen.hasCriminalRecord && (
                    <div className="space-y-4">
                      <h3 className="text-md font-semibold">Detalhes dos Registos:</h3>
                      {citizen.recordDetails.map((record: any, index: number) => (
                        <div key={index} className="border rounded p-3 bg-gray-50">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium">Processo:</span> {record.numero_processo}
                            </div>
                            <div>
                              <span className="font-medium">Data:</span> {record.data_ocorrencia}
                            </div>
                            <div>
                              <span className="font-medium">Tribunal:</span> {record.tribunal}
                            </div>
                            <div>
                              <span className="font-medium">Infração:</span> {record.tipo_ocorrencia}
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium">Sentença:</span> {record.setenca}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-center text-sm text-gray-500 mt-10 pt-6 border-t">
                    <p>Documento emitido eletronicamente em {new Date(certificate.data_emissao).toLocaleDateString()}</p>
                    <p className="mt-1">Para validar este certificado, visite <span className="text-gov-primary"><a target='_blank' href='http://localhost:8080/'>http://localhost:8080/</a></span> e introduza o código de verificação.</p>
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