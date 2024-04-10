import { Button } from "@/components/ui/button";
import { Song } from "@/types";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { MusicsCarousel } from "./MusicsCarousel";
import Recommend from "@/components/Reccomend";

export default function MusicsDrawer({
  songs,
  userName,
  handleRecommendedSongs,
}: {
  songs: Song[] | undefined;
  userName?: string | undefined;
  handleRecommendedSongs: () => void;
}) {
  return (
    <DrawerContent>
      <div className="mx-auto w-full max-w-sm flex items-center justify-center flex-col">
        <DrawerHeader>
          <DrawerTitle>
            {userName} aqui estão algumas músicas que talvez você goste
          </DrawerTitle>
          <DrawerDescription>
            Espero que aproveite e curta essas somzeira.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <MusicsCarousel songs={songs} />
        </div>
        <DrawerFooter className="flex items-center">
          <Recommend onClick={handleRecommendedSongs} />
          <DrawerClose asChild className="w-20">
            <Button variant="outline">Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  );
}
