import { useState } from "react";
import UserForm from "@/components/UserForm";
import { z } from "zod";
import { formSchema } from "./formSchema";
import MusicsDrawer from "@/components/MusicsDrawer";
import { Song } from "./types";
import { songsDataset } from "@/data/musics";
import {
  Drawer
} from "@/components/ui/drawer"
import { kmeans } from './kmeans/index'

function App() {
  const [recommendedMusics, setRecommendedMusics] = useState<Song[]>();
  const [userName, setUserName] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    setUserName(data.username)
    const artists = data.artists.split(",").map((artist) => artist.trim().toLowerCase());
    const { clusters, centroids } = kmeans(songsDataset, data.musicalGenres, artists);
    console.log(clusters, centroids)
    setRecommendedMusics(centroids)
    setDrawerOpen(true)
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <div className="container flex justify-center align-center h-screen">
        <UserForm
          onSubmit={(data: z.infer<typeof formSchema>) => handleSubmit(data)}
        />

        <MusicsDrawer songs={recommendedMusics} userName={userName}/>
      </div>
    </Drawer>
  );
}

export default App;