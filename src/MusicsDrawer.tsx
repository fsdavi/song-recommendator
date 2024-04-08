import { Button } from "@/components/ui/button";
import { Musics } from "./types";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { MusicsCarousel } from "./MusicsCarousel";

export default function MusicsDrawer({
  musics,
  userName,
}: {
  musics: Musics[] | undefined;
  userName: string | undefined;
}) {
  return (
    <DrawerContent>
      <div className="mx-auto w-full max-w-sm flex items-center justify-center flex-col">
        <DrawerHeader>
          <DrawerTitle>{userName} aqui estão algumas músicas que talvez você goste</DrawerTitle>
          <DrawerDescription>
            Espero que aproveite e curta essas somzeira.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 pb-0">
          <MusicsCarousel musics={musics} />
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  );
}
