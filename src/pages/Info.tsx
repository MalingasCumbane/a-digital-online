
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Info as InfoIcon, Download, File, Search, User } from 'lucide-react';

const InfoPage = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-semibold mb-1">Informações</h1>
        <p className="text-gray-500 mb-6">
          Detalhes sobre o Sistema de Registro Criminal e procedimentos.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="gov-card">
            <CardHeader>
              <div className="p-3 bg-blue-100 rounded-md w-fit">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="mt-4">Sobre o Sistema</CardTitle>
              <CardDescription>Informações sobre o sistema e sua finalidade</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                O Sistema de Registro Criminal é uma plataforma oficial do Ministério da Justiça para emissão, consulta e gestão de certificados de registo criminal para cidadãos e empresas.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <InfoIcon className="mr-2 h-4 w-4" /> Saiba Mais
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="gov-card">
            <CardHeader>
              <div className="p-3 bg-green-100 rounded-md w-fit">
                <File className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="mt-4">Documentação</CardTitle>
              <CardDescription>Manuais e documentação do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Acesse manuais de utilização, tutoriais em vídeo e guias de procedimentos para o Sistema de Registro Criminal.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" /> Baixar Manuais
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="gov-card">
            <CardHeader>
              <div className="p-3 bg-amber-100 rounded-md w-fit">
                <Search className="h-5 w-5 text-amber-600" />
              </div>
              <CardTitle className="mt-4">FAQ</CardTitle>
              <CardDescription>Perguntas frequentes sobre o sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Encontre respostas para as questões mais comuns sobre o processo de emissão de certificados de registro criminal.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <InfoIcon className="mr-2 h-4 w-4" /> Ver FAQ
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="gov-card">
          <CardHeader>
            <CardTitle>Processo de Emissão de Registro Criminal</CardTitle>
            <CardDescription>Fluxo de trabalho completo para processamento de registros</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-gov-primary/10 rounded-full mb-3">
                    <Search className="h-5 w-5 text-gov-primary" />
                  </div>
                  <h3 className="font-medium mb-2">1. Pesquisa</h3>
                  <p className="text-sm text-gray-500">
                    Pesquise o cidadão pelo número de ID ou nome completo
                  </p>
                </div>
                
                <div className="hidden md:flex items-center justify-center">
                  <div className="h-0.5 w-full bg-gray-200 relative">
                    <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 border-t-2 border-r-2 border-gray-200"></div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-gov-primary/10 rounded-full mb-3">
                    <User className="h-5 w-5 text-gov-primary" />
                  </div>
                  <h3 className="font-medium mb-2">2. Verificação</h3>
                  <p className="text-sm text-gray-500">
                    Verifique os dados do cidadão no sistema
                  </p>
                </div>
                
                <div className="hidden md:flex items-center justify-center">
                  <div className="h-0.5 w-full bg-gray-200 relative">
                    <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 border-t-2 border-r-2 border-gray-200"></div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-gov-primary/10 rounded-full mb-3">
                    <FileText className="h-5 w-5 text-gov-primary" />
                  </div>
                  <h3 className="font-medium mb-2">3. Emissão</h3>
                  <p className="text-sm text-gray-500">
                    Gere o certificado e imprima ou faça download
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border">
                <h3 className="font-semibold text-lg mb-4">Informações Importantes</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Validade do Certificado</h4>
                    <p className="text-sm text-gray-600">
                      Os certificados de registro criminal têm validade de 90 dias a partir da data de emissão.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Verificação Online</h4>
                    <p className="text-sm text-gray-600">
                      Todos os certificados incluem um código único de verificação que pode ser validado online no site oficial.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Privacidade e Segurança</h4>
                    <p className="text-sm text-gray-600">
                      Todos os dados são tratados de acordo com a legislação de proteção de dados pessoais em vigor.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InfoPage;
