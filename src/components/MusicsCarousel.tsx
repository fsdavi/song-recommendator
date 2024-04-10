import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Song } from "@/types";
import { FaCirclePlay } from "react-icons/fa6";

export function MusicsCarousel({ songs }: { songs: Song[] | undefined }) {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {songs?.length &&
          songs.map((song) => (
            <CarouselItem key={song.title}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6 flex-col gap-4">
                    <span className="text-3xl font-semibold">{song.title}</span>
                    <span className="text-lg font-semibold">
                      {song.artists.join(", ")}
                    </span>
                    <span className="text-lg font-semibold">
                      {song.genres.join(", ")}
                    </span>
                    <a className="text-white bg-accent hover:bg-primary/90 rounded-full p-2" href={song.link} target="_blank">
                      <FaCirclePlay />
                    </a>
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
