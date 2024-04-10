import { songsDataset } from '../data/musics';

interface Song {
  title: string;
  artists: string[];
  genres: string[];
  listenMetrics: number;
}

export default function calculateSongProbability(songHistory: Song[]): Song[] {
  const unlistenedSongs = songsDataset.filter(
    song => !songHistory.some(s => s.title === song.title)
  );
  const songProbabilities = unlistenedSongs.map(song => {
    let probability = 0;

    // verificar se o artista está no songHistory
    if (
      songHistory.some(s =>
        s.artists.some(artist => song.artists.includes(artist))
      )
    ) {
      probability += 1000;
    }

    // agora com genero
    song.genres.forEach(genre => {
      if (songHistory.some(s => s.genres.includes(genre))) {
        probability += 400;
      }
    });

    // diferencial do listenMetrics
    probability += song.listenMetrics / 10;

    return {
      ...song,
      probability,
    };
  });

  // ordenar as músicas por probabilidade
  songProbabilities.sort((a, b) => b.probability - a.probability);
  return songProbabilities.slice(0, 10);
}

// console.log(JSON.stringify(songProbabilities));
