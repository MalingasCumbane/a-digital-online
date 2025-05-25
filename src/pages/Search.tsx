
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, User, Loader2, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';

// Mock citizen data
const mockCitizens = [
  { id: '123456789', name: 'João Silva', dob: '1985-05-15', address: 'Av. da Liberdade, 123, Maputo' },
  { id: '987654321', name: 'Maria Santos', dob: '1990-10-25', address: 'Rua Augusta, 45, Maputo' },
  { id: '456789123', name: 'António Ferreira', dob: '1978-03-08', address: 'Praça do Comércio, 7, Maputo' },
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'id' | 'name'>('id');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof mockCitizens>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();


    const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        variant: "destructive",
        title: "Erro na pesquisa",
        description: "Por favor, insira um termo de pesquisa válido.",
      });
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      
      const response = await api.get('/cidadaos/search/', { params: {  q: searchQuery, type: searchType === 'id' ? 'bi' : 'nome' }});

      setSearchResults(response.data.results.map(c => ({
        id: c.numero_bi_nuit,
        name: c.full_name,
        dob: c.data_nascimento,
        address: `${c.endereco}, ${c.distrito}, ${c.provincia}`
      })));

      if (response.data.count === 0) {
        toast({
          title: "Sem resultados",
          description: "Nenhum cidadão encontrado com os critérios especificados.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na pesquisa",
        description: "Ocorreu um erro ao pesquisar. Tente novamente.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenerateRecord = (citizenId: string) => {
    navigate(`/records/generate/${citizenId}`);
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-semibold mb-1">Pesquisa de Cidadão</h1>
        <p className="text-gray-500 mb-6">
          Procure cidadãos por número de identificação ou nome completo.
        </p>

        <Card className="gov-card mb-6">
          <CardHeader>
            <CardTitle>Critérios de Pesquisa</CardTitle>
            <CardDescription>Insira o número de ID ou nome do cidadão para começar</CardDescription>
          </CardHeader>
          <form onSubmit={handleSearch}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Pesquisa
                  </label>
                  <select 
                    className="gov-input w-full"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value as 'id' | 'name')}
                  >
                    <option value="id">Número de B.I</option>
                    <option value="name">Nome Completo</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Termo de Pesquisa
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder={searchType === 'id' ? 'Ex: 123456789' : 'Ex: João Silva'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="gov-input pl-10"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <SearchIcon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                type="submit"
                className="bg-gov-primary hover:bg-gov-secondary"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    A pesquisar...
                  </>
                ) : (
                  <>
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Pesquisar
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {hasSearched && (
          <Card className="gov-card animate-fade-in">
            <CardHeader>
              <CardTitle>Resultados da Pesquisa</CardTitle>
              <CardDescription>
                {searchResults.length === 0
                  ? 'Nenhum cidadão encontrado'
                  : `${searchResults.length} ${searchResults.length === 1 ? 'cidadão encontrado' : 'cidadãos encontrados'}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((citizen, index) => (
                    <div 
                      key={citizen.id} 
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors animate-slide-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-4 mb-3 md:mb-0">
                        <div className="p-2 bg-gray-100 rounded-full">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{citizen.name}</h3>
                          <div className="text-sm text-gray-500">
                            <p>ID: {citizen.id}</p>
                            <p>Data de Nasc.: {citizen.dob}</p>
                            <p className="hidden md:block">{citizen.address}</p>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleGenerateRecord(citizen.id)}
                        className="mt-2 md:mt-0 bg-gov-accent hover:bg-gov-accent/90"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Gerar Registo
                      </Button>
                    </div>
                  ))}
                </div>
              ) : hasSearched && !isSearching ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full mb-4">
                    <SearchIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Nenhum resultado encontrado</h3>
                  <p className="mt-1 text-gray-500">
                    Tente ajustar os seus critérios de pesquisa e tentar novamente.
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Search;
