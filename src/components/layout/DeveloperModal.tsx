import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const developers = [
  {
    name: "João Silva",
    role: "Desenvolvedor Frontend",
    avatar: "/avatars/joao.jpg",
    description: "Responsável pela interface do usuário e experiência do usuário."
  },
  {
    name: "Maria Santos",
    role: "Desenvolvedor Backend",
    avatar: "/avatars/maria.jpg",
    description: "Responsável pela API e integração com banco de dados."
  },
  {
    name: "Carlos Oliveira",
    role: "Designer UI/UX",
    avatar: "/avatars/carlos.jpg",
    description: "Responsável pelo design da interface e fluxos de usuário."
  },
  // Adicione mais desenvolvedores conforme necessário
];

export function DevelopersModal({ open, onOpenChange }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Equipe de Desenvolvimento</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <Carousel className="w-full">
            <CarouselContent>
              {developers.map((dev, index) => (
                <CarouselItem key={index}>
                  <div className="flex flex-col items-center gap-4 p-4 text-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={dev.avatar} alt={dev.name} />
                      <AvatarFallback>
                        {dev.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{dev.name}</h3>
                      <p className="text-sm text-muted-foreground">{dev.role}</p>
                    </div>
                    <p className="text-sm text-gray-600">{dev.description}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Grupo 3 - {new Date().toLocaleDateString('pt-PT')}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}