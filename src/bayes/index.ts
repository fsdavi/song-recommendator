import { songsDataset } from '../data/musics';

interface Song {
  title: string;
  artists: string[];
  genres: string[];
  listenMetrics: number;
  link: string;
}

export default function calculateSongProbability(songHistory: Song[]): Song[] {
  // Filtrar as músicas que o usuário ainda não ouviu
  const unlistenedSongs = songsDataset.filter(
    song => !songHistory.some(s => s.title === song.title)
  );

  // Contar a ocorrência de cada artista no histórico de músicas
  const artistCounts = songHistory.reduce((acc, curr) => {
    curr.artists.forEach(artist => {
      acc[artist] = (acc[artist] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Contar a ocorrência de cada gênero no histórico de músicas
  const genreCounts = songHistory.reduce((acc, curr) => {
    curr.genres.forEach(genre => {
      acc[genre] = (acc[genre] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // soma total de listenMetrics no histórico de músicas pra uma probabilidade entre 0 e 1
  const totalListenMetrics = songHistory.reduce(
    (acc, curr) => acc + curr.listenMetrics,
    0
  );

  const songProbabilities = unlistenedSongs.map(song => {
    // prior de uma música ser de interesse para o usuário
    const priorProbability = 1 / unlistenedSongs.length;

    // determinar se o artista provavelmente é recomendavel
    const artistProb = song.artists.reduce(
      (acc, artist) => acc * ((artistCounts[artist] || 0) + 1),
      1
    );

    // agora com genero
    const genreProb = song.genres.reduce(
      (acc, genre) => acc * ((genreCounts[genre] || 0) + 1),
      1
    );

    // probabilidade do listenMetrics da música
    const listenMetricsProb = song.listenMetrics / totalListenMetrics;

    // probabilidade total (evidência p(b))
    const evidence =
      Object.values(artistCounts).reduce((acc, count) => acc + count, 0) +
      Object.values(genreCounts).reduce((acc, count) => acc + count, 0) +
      totalListenMetrics;

    // teorema de Bayes para calcular a probabilidade final
    //p(a|b) = (p(b|a) * p(a))/p(b)
    const finalProbability =
      (priorProbability * artistProb * genreProb * listenMetricsProb) /
      evidence;

    return {
      ...song,
      probability: finalProbability,
    };
  });
  // probabilidade em ordem decrescente
  songProbabilities.sort((a, b) => b.probability - a.probability);

  return songProbabilities;
}

// console.log(JSON.stringify(songProbabilities));
