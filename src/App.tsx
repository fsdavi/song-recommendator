import { useState } from 'react';
import UserForm from '@/components/UserForm';
import { z } from 'zod';
import { formSchema } from './formSchema';
import MusicsDrawer from '@/components/MusicsDrawer';
import { Song } from './types';
import { songsDataset } from '@/data/musics';
import { Drawer } from '@/components/ui/drawer';
import { kmeans } from './kmeans/index';
import Recommend from './components/Reccomend';
import calculateSongProbability from './bayes';
import { songHistory } from './bayes/songHistory';

function App() {
  const [recommendedMusics, setRecommendedMusics] = useState<Song[]>();
  const [userName, setUserName] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    setUserName(data.username);
    const artists = data.artists
      .split(',')
      .map(artist => artist.trim().toLowerCase());
    const { clusters, centroids } = kmeans(
      songsDataset,
      data.musicalGenres,
      artists
    );
    console.log(clusters, centroids);
    setRecommendedMusics(centroids);
    setDrawerOpen(true);
  };

  const newSongs = () => {
    const recomendacoes = calculateSongProbability(songHistory); // Calcula as recomendações
    setRecommendedMusics(recomendacoes);
    setDrawerOpen(true);
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <div className="container flex flex-col justify-center align-center h-screen">
        <Recommend onClick={newSongs} />
        <UserForm
          onSubmit={(data: z.infer<typeof formSchema>) => handleSubmit(data)}
        />
        <MusicsDrawer songs={recommendedMusics} userName={userName} />
      </div>
    </Drawer>
  );
}

export default App;
