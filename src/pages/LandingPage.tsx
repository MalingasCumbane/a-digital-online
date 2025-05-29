
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, FileText, Shield, Users, LogIn } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { Separator } from '@radix-ui/react-separator';

const LandingPage = () => {
  const [recordNumber, setRecordNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!recordNumber.trim()) {
    toast({
      variant: "destructive",
      title: "Número obrigatório",
      description: "Por favor, insira um número de registo criminal.",
    });
    return;
  }
  setIsSearching(true);
  try {
    const data = {
      num_ref: recordNumber
    }
    const response = await api.post(`/records/certificate/`, data);
    
    // Parse o conteúdo de forma segura
    let parsedContent = null;
    if (response.data.conteudo) {
      try {
        // Primeiro tenta fazer parse diretamente (caso já seja JSON válido)
        parsedContent = JSON.parse(response.data.conteudo);
        
      } catch (e) {
        // Se falhar, substitui aspas simples por aspas duplas e tenta novamente
        const fixedJson = response.data.conteudo
          .replace(/'/g, '"') // Substitui aspas simples por duplas
          .replace(/(\w+):/g, '"$1":'); // Adiciona aspas nas chaves
        parsedContent = JSON.parse(fixedJson);
      }
    }
    
    const result = {
      ...response.data,
      conteudo: parsedContent
    };
    
    setSearchResult(result);
    toast({
      title: "Registo encontrado",
      description: "Detalhes do registo criminal carregados com sucesso.",
    });
  } catch (error) {
    console.error('Search error:', error);
    setSearchResult(null);
    toast({
      variant: "destructive",
      title: "Erro na pesquisa",
      description: error.response?.data?.message || "Ocorreu um erro ao processar o registo.",
    });
  } finally {
    setIsSearching(false);
  }
};

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gov-primary p-2 rounded">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Sistema de Registo Criminal
              </h1>
            </div>
            <Button onClick={handleLogin} className="bg-gov-primary hover:bg-gov-secondary">
              <LogIn className="h-4 w-4 mr-2" />
              Entrar na Plataforma
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Consulta de Registo Criminal
          </h2>
          <p className="text-xl text-gray-600">
            Consulte informações de registos criminais de forma rápida e segura
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Search className="h-5 w-5" />
                Pesquisar Registo Criminal
              </CardTitle>
              <CardDescription>
                Insira o número do registo criminal para consultar os detalhes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Ex: RC001234567"
                    value={recordNumber}
                    onChange={(e) => setRecordNumber(e.target.value)}
                    className="text-center text-lg h-12"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gov-primary hover:bg-gov-secondary h-12"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <Search className="h-4 w-4 mr-2 animate-spin" />
                      Pesquisando...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Pesquisar Registo
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Search Results */}
        {searchResult && (
  <div className="max-w-2xl mx-auto mb-12">
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Detalhes do Certificado de Registo Criminal
        </CardTitle>
        <CardDescription>
          Número de referência: {searchResult.numero_referencia}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado do Certificado
            </label>
            <p className="text-gray-900">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                searchResult.estado_certificado === 'VALIDO' 
                  ? 'bg-green-100 text-green-800' 
                  : searchResult.estado_certificado === 'EXPIRADO'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}>
                {searchResult.estado_certificado === 'VALIDO' ? 'Válido' : 
                 searchResult.estado_certificado === 'EXPIRADO' ? 'Expirado' : 'Revogado'}
              </span>
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Emissão
            </label>
            <p className="text-gray-900">
              {new Date(searchResult.data_emissao).toLocaleDateString('pt-PT')}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Validade
            </label>
            <p className="text-gray-900">
              {new Date(searchResult.data_validade).toLocaleDateString('pt-PT')}
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        {searchResult.conteudo && (
          <>
            <h3 className="font-medium text-lg">Dados do Cidadão</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <p className="text-gray-900">
                  {searchResult.conteudo.cidadao?.nome || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de BI
                </label>
                <p className="text-gray-900">
                  {searchResult.conteudo.cidadao?.bi || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Nascimento
                </label>
                <p className="text-gray-900">
                  {searchResult.conteudo.cidadao?.nascimento ? 
                    new Date(searchResult.conteudo.cidadao.nascimento).toLocaleDateString('pt-PT') : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nacionalidade
                </label>
                <p className="text-gray-900">
                  {searchResult.conteudo.cidadao?.nacionalidade || 'N/A'}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço
                </label>
                <p className="text-gray-900">
                  {searchResult.conteudo.cidadao?.endereco || 'N/A'}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Possui registos criminais?
              </label>
              <p className="text-gray-900">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  searchResult.conteudo.tem_registos 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {searchResult.conteudo.tem_registos ? 'Sim' : 'Não'}
                </span>
              </p>
            </div>

            {searchResult.conteudo.tem_registos && searchResult.conteudo.registos?.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detalhes dos Registos Criminais
                </label>
                <div className="space-y-3">
                  {searchResult.conteudo.registos.map((registo, index) => (
                    <div key={index} className="border-l-4 border-red-400 pl-4 py-2 bg-red-50 rounded-r">
                      <p className="font-medium text-red-800">{registo.tipo_ocorrencia}</p>
                      <p className="text-sm text-red-700">{registo.descricao}</p>
                      <p className="text-xs text-red-600 mt-1">
                        {new Date(registo.data_ocorrencia).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  </div>
)}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-gov-primary mx-auto mb-2" />
              <CardTitle>Seguro e Confiável</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Sistema oficial do Ministério da Justiça com total segurança e confidencialidade.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Search className="h-12 w-12 text-gov-primary mx-auto mb-2" />
              <CardTitle>Pesquisa Rápida</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Consulte registos criminais de forma rápida e eficiente através do número do registo.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-gov-primary mx-auto mb-2" />
              <CardTitle>Acesso Autorizado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Apenas oficiais autorizados têm acesso completo ao sistema de gestão de registos.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-500">
              © {new Date().getFullYear()} Sistema de Registo Criminal - Ministério da Justiça
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
