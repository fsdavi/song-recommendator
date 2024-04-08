import { useState, useEffect } from "react";
import UserForm from "./UserForm";
import { z } from "zod";
import { formSchema } from "./formSchema";
import MusicsDrawer from "./MusicsDrawer";
import { Musics } from "./types";
import {
  Drawer
} from "@/components/ui/drawer"

import { kmeans } from './kmeans/index'

function App() {
  const [recommendedMusics, setRecommendedMusics] = useState<Musics[]>();
  const [userName, setUserName] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    setUserName(data.username)
    setRecommendedMusics([
      {
        title: "Song",
        artists: ["Artist"],
        genres: ["Metal"],
        points: undefined,
      },
      {
        title: "Song 2",
        artists: ["Artist"],
        genres: ["Pop"],
        points: undefined,
      },
      {
        title: "Song 3",
        artists: ["Artist"],
        genres: ["Rock"],
        points: undefined,
      },
    ]);
    setDrawerOpen(true)
  };

  useEffect(() => {
    const { clusters, centroids } = kmeans(3);

    console.log(clusters, centroids)
  }, []);

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <div className="container flex justify-center align-center h-screen">
        <UserForm
          onSubmit={(data: z.infer<typeof formSchema>) => handleSubmit(data)}
        />

        <MusicsDrawer musics={recommendedMusics} userName={userName}/>
      </div>
    </Drawer>
  );
}

export default App;
