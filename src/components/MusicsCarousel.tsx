import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Musics } from "@/types";

export function MusicsCarousel({
  musics
}: {
  musics: Musics[] | undefined;
}) {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {musics?.length &&
          musics.map((music) => (
            <CarouselItem key={music.title}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">
                      {music.title}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
