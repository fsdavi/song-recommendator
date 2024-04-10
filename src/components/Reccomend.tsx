import { Button } from '@/components/ui/button';

interface RecommendProps {
  onClick: () => void;
}

export default function Recommend({ onClick }: RecommendProps) {
  return (
    <div className="space-y-8 container flex justify-center items-center h-full flex-col w-full">
      <Button type="button" onClick={onClick}>
        Gerar recomendações com base no histórico
      </Button>
    </div>
  );
}
