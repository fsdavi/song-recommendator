import { songsDataset } from '../data/musics';

interface Song {
  title: string;
  artists: string[];
  genres: string[];
  listenMetrics: number;
}

export default function calculateSongProbability(songHistory: Song[]): Song[] {
  // filtrar as músicas que o usuário ainda não ouviu
  const unlistenedSongs = songsDataset.filter(
    song => !songHistory.some(s => s.title === song.title)
  );

  // calcular a probabilidade 0-1 de cada música não ouvida
  const songProbabilities = unlistenedSongs.map(song => {
    // probabilidade inicial (prior) de uma música ser de interesse para o usuário
    const priorProbability = 1 / songHistory.length;

    // probabilidade do gênero da música dado que a música é de interesse para o usuário
    const genreCounts = songHistory.reduce((acc, curr) => {
      curr.genres.forEach(genre => {
        acc[genre] = (acc[genre] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    const genreProbabilities = Object.fromEntries(
      Object.entries(genreCounts).map(([genre, count]) => [
        genre,
        count / songHistory.length,
      ])
    );
    const likelihood = song.genres.reduce(
      (acc, genre) => acc * (genreProbabilities[genre] || 0),
      1
    );
    // probabilidade do gênero da música (evidência)
    const evidence = Object.values(genreProbabilities).reduce(
      (acc, prob) => acc + prob,
      0
    );

    // teorema de Bayes
    const finalProbability = (priorProbability * likelihood) / evidence;

    return {
      ...song,
      probability: finalProbability,
    };
  });

  // exclui musicas com probabilidade 0
  const filteredSongs = songProbabilities.filter(song => song.probability > 0);

  // ordenar as músicas por probabilidade
  filteredSongs.sort((a, b) => b.probability - a.probability);

  // retornar as músicas ordenadas
  return filteredSongs;
}
