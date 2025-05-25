
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Info as InfoIcon, Download, File, Search, User } from 'lucide-react';

const InfoPage = () => {
  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Informações</h1>
        <p className="text-gray-500 mb-8 text-lg">
          Detalhes sobre o Sistema de Registo Criminal e procedimentos.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="gov-card hover:scale-[1.01] transition-all duration-300 border-t-4 border-t-blue-500 shadow-md">
            <CardHeader className="pb-3">
              <div className="p-3 bg-blue-100 rounded-md w-fit">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="mt-4 text-gray-800">Sobre o Sistema</CardTitle>
              <CardDescription className="text-gray-600">Informações sobre o sistema e sua finalidade</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                O Sistema de Registo Criminal é uma plataforma oficial do Ministério da Justiça para emissão, consulta e gestão de certificados de registo criminal para cidadãos e empresas.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full hover:bg-blue-50">
                <InfoIcon className="mr-2 h-4 w-4" /> Saiba Mais
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="gov-card hover:scale-[1.01] transition-all duration-300 border-t-4 border-t-green-500 shadow-md">
            <CardHeader className="pb-3">
              <div className="p-3 bg-green-100 rounded-md w-fit">
                <File className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="mt-4 text-gray-800">Documentação</CardTitle>
              <CardDescription className="text-gray-600">Manuais e documentação do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Acesse manuais de utilização, tutoriais em vídeo e guias de procedimentos para o Sistema de Registo Criminal.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full hover:bg-green-50">
                <Download className="mr-2 h-4 w-4" /> Baixar Manuais
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="gov-card hover:scale-[1.01] transition-all duration-300 border-t-4 border-t-amber-500 shadow-md">
            <CardHeader className="pb-3">
              <div className="p-3 bg-amber-100 rounded-md w-fit">
                <Search className="h-5 w-5 text-amber-600" />
              </div>
              <CardTitle className="mt-4 text-gray-800">FAQ</CardTitle>
              <CardDescription className="text-gray-600">Perguntas frequentes sobre o sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Encontre respostas para as questões mais comuns sobre o processo de emissão de certificados de registo criminal.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full hover:bg-amber-50">
                <InfoIcon className="mr-2 h-4 w-4" /> Ver FAQ
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="gov-card shadow-md border-l-4 border-l-gov-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-gray-800">Processo de Emissão de Registo Criminal</CardTitle>
            <CardDescription className="text-gray-600">Fluxo de trabalho completo para processamento de registos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="p-4 bg-gov-primary/10 rounded-full mb-4">
                    <Search className="h-6 w-6 text-gov-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-lg">1. Pesquisa</h3>
                  <p className="text-sm text-gray-600">
                    Pesquise o cidadão pelo número de ID ou nome completo
                  </p>
                </div>
                
                <div className="hidden md:flex items-center justify-center">
                  <div className="h-1 w-full bg-gray-200 relative">
                    <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-3 h-3 border-t-2 border-r-2 border-gray-300"></div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="p-4 bg-gov-primary/10 rounded-full mb-4">
                    <User className="h-6 w-6 text-gov-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-lg">2. Verificação</h3>
                  <p className="text-sm text-gray-600">
                    Verifique os dados do cidadão no sistema
                  </p>
                </div>
                
                <div className="hidden md:flex items-center justify-center">
                  <div className="h-1 w-full bg-gray-200 relative">
                    <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-3 h-3 border-t-2 border-r-2 border-gray-300"></div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="p-4 bg-gov-primary/10 rounded-full mb-4">
                    <FileText className="h-6 w-6 text-gov-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-lg">3. Emissão</h3>
                  <p className="text-sm text-gray-600">
                    Gere o certificado e imprima ou faça download
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-6 text-gray-800 border-b pb-3">Informações Importantes</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                    <h4 className="font-semibold mb-3 text-blue-800">Validade do Certificado</h4>
                    <p className="text-sm text-gray-700">
                      Os certificados de registo criminal têm validade de 90 dias a partir da data de emissão.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                    <h4 className="font-semibold mb-3 text-green-800">Verificação Online</h4>
                    <p className="text-sm text-gray-700">
                      Todos os certificados incluem um código único de verificação que pode ser validado online no site oficial.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                    <h4 className="font-semibold mb-3 text-amber-800">Privacidade e Segurança</h4>
                    <p className="text-sm text-gray-700">
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
