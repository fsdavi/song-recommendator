import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Song } from "@/types";

export function MusicsCarousel({
  songs
}: {
  songs: Song[] | undefined;
}) {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {songs?.length &&
          songs.map((song) => (
            <CarouselItem key={song.title}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">
                      {song.title}
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
