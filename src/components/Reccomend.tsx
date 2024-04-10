import { Button } from '@/components/ui/button';

interface RecommendProps {
  onClick: () => void;
}

export default function Recommend({ onClick }: RecommendProps) {
  return (
    <div className="space-y-8 container flex justify-center items-center h-full flex-col">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Já possui um histórico? Clique no botão abaixo para receber
        recomendações
      </h4>

      <Button type="button" onClick={onClick}>
        Recomendações
      </Button>
    </div>
  );
}
