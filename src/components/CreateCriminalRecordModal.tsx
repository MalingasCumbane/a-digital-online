
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';

type Cidadao = {
  id: number;
  full_name: string;
  numero_bi_nuit: string;
};

type CriminalRecordRequest = {
  id: string;
  cidadao: Cidadao;
  data_solicitacao: string;
  status: string;
  motivo: string;
};

type CreateCriminalRecordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  request: CriminalRecordRequest | null;
  onRecordCreated: () => void;
};

const CreateCriminalRecordModal = ({ isOpen, onClose, request, onRecordCreated }: CreateCriminalRecordModalProps) => {
  const [formData, setFormData] = useState({
    numero_processo: '',
    data_ocorrencia: null as Date | null,
    tipo_ocorrencia: '',
    tribunal: '',
    setenca: '',
    data_setenca: null as Date | null,
    cumprido: false,
    observacao: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;

    setIsSubmitting(true);
    
    try {
      const data = {
        id: request.id,
        cidadao: request.cidadao.id,
        numero_processo: formData.numero_processo,
        data_ocorrencia: formData.data_ocorrencia?.toISOString().split('T')[0],
        tipo_ocorrencia: formData.tipo_ocorrencia,
        tribunal: formData.tribunal,
        setenca: formData.setenca,
        data_setenca: formData.data_setenca?.toISOString().split('T')[0],
        cumprido: formData.cumprido,
        observacao: formData.observacao
      };

      await api.post('/criminal-new-records/', data);
      onRecordCreated();
      
      // Reset form
      setFormData({
        numero_processo: '',
        data_ocorrencia: null,
        tipo_ocorrencia: '',
        tribunal: '',
        setenca: '',
        data_setenca: null,
        cumprido: false,
        observacao: ''
      });
    } catch (error) {
      console.error('Error creating criminal record:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao criar registo criminal.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Registo Criminal</DialogTitle>
          <DialogDescription>
            Criando registo criminal para {request?.cidadao.full_name} (BI: {request?.cidadao.numero_bi_nuit})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero_processo">Número do Processo *</Label>
              <Input
                id="numero_processo"
                value={formData.numero_processo}
                onChange={(e) => handleInputChange('numero_processo', e.target.value)}
                placeholder="Ex: PROC-2024-001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Data da Ocorrência *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.data_ocorrencia && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.data_ocorrencia ? (
                      format(formData.data_ocorrencia, "PPP", { locale: pt })
                    ) : (
                      <span>Selecionar data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.data_ocorrencia || undefined}
                    onSelect={(date) => handleInputChange('data_ocorrencia', date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo_ocorrencia">Tipo de Ocorrência *</Label>
              <Select onValueChange={(value) => handleInputChange('tipo_ocorrencia', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CRIME">Crime</SelectItem>
                  <SelectItem value="CONTRAVENCAO">Contravenção</SelectItem>
                  <SelectItem value="INFRACCAO">Infração</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tribunal">Tribunal *</Label>
              <Input
                id="tribunal"
                value={formData.tribunal}
                onChange={(e) => handleInputChange('tribunal', e.target.value)}
                placeholder="Ex: Tribunal Provincial de Luanda"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="setenca">Sentença *</Label>
            <Textarea
              id="setenca"
              value={formData.setenca}
              onChange={(e) => handleInputChange('setenca', e.target.value)}
              placeholder="Descreva a sentença aplicada..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Data da Sentença *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.data_setenca && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.data_setenca ? (
                    format(formData.data_setenca, "PPP", { locale: pt })
                  ) : (
                    <span>Selecionar data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.data_setenca || undefined}
                  onSelect={(date) => handleInputChange('data_setenca', date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="cumprido"
              checked={formData.cumprido}
              onCheckedChange={(checked) => handleInputChange('cumprido', checked)}
            />
            <Label htmlFor="cumprido">Sentença cumprida</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacao">Observações</Label>
            <Textarea
              id="observacao"
              value={formData.observacao}
              onChange={(e) => handleInputChange('observacao', e.target.value)}
              placeholder="Observações adicionais (opcional)..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gov-primary hover:bg-gov-secondary"
            >
              {isSubmitting ? 'Criando...' : 'Criar Registo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCriminalRecordModal;
