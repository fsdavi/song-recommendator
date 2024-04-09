interface Song {
  title: string;
  artists: string[];
  genres: string[];
  listenMetrics: number;
}

class KMeans {
  private k: number;
  private maxIterations: number;
  private data: Song[];
  private genresSelected: string[];
  private selectedArtists: string[];

  constructor(
    k: number,
    maxIterations = 100,
    data: Song[],
    genresSelected: string[],
    selectedArtists: string[]
  ) {
    this.k = k;
    this.maxIterations = maxIterations;
    this.data = data;
    this.genresSelected = genresSelected;
    this.selectedArtists = selectedArtists;
  }

  private getSongPoints(song: Song): number {
    let points: number = 0;

    for (const genre of song.genres) {
      if (this.genresSelected.includes(genre.toLowerCase())) points = +2;
    }

    for (const artist of song.artists) {
      this.selectedArtists.includes(artist.toLowerCase()) && points++;
    }

    return points;
  }

  private distance(song1: Song, song2: Song): number {
    const song1Points = this.getSongPoints(song1);
    const song2Points = this.getSongPoints(song2);

    return Math.abs(song1Points - song2Points);
  }

  private cleanClusters(clusters: Song[][]): Song[][] {
    const cleanedClusters: Song[][] = [];
    for (const cluster of clusters) {
      const cleanedCluster: Song[] = [];
      for (const song of cluster) {
        const hasMatchingGenre = song.genres.some((genre) =>
          this.genresSelected.includes(genre.toLowerCase())
        );
        const hasMatchingArtist = song.artists.some((artist) =>
          this.selectedArtists.includes(artist.toLowerCase())
        );
        if (hasMatchingGenre || hasMatchingArtist) {
          cleanedCluster.push(song);
        }
      }
      cleanedClusters.push(cleanedCluster);
    }
    return this.separateClustersByGenres(cleanedClusters);
  }

  private separateClustersByGenres(clusters: Song[][]): Song[][] {
    const genres = new Set();
    const musicByGenre = [];

    for (const music of clusters.flat()) {
      // Adicionar cada gênero ao conjunto
      for (const genre of music.genres) {
        genres.add(genre);
      }
    }

    const originalArrayLength = clusters.length;

    for (const genre of genres) {
      musicByGenre.push([]);

      if (musicByGenre.length <= originalArrayLength) {
        for (const music of clusters.flat()) {
          if (music.genres.includes(genre)) {
            musicByGenre[musicByGenre.length - 1].push(music);
          }
        }
      }
    }

    return musicByGenre.filter((music) => music.length > 0);
  }

  private assignClusters(): Song[][] {
    debugger;
    const clusters: Song[][] = [];
    for (let i = 0; i < this.k; i++) {
      clusters.push([]);
    }

    for (const song of this.data) {
      let minDistance = Infinity;
      let closestCentroid = 0;

      for (let centroid = 0; centroid < this.k; centroid++) {
        const dist = this.distance(song, this.data[centroid]);
        if (dist < minDistance) {
          minDistance = dist;
          closestCentroid = centroid;
        }
      }
      clusters[closestCentroid].push(song);
    }
    return this.cleanClusters(clusters);
  }

  private updateCentroids(clusters: Song[][]): Song[] {
    const newCentroids: Song[] = [];
    for (const cluster of clusters) {
      let newCentroid: Song = {
        title: "",
        artists: [],
        genres: [],
        listenMetrics: 0,
      };

      if (cluster.length === 0) {
        continue;
      }

      for (const song of cluster) {
        if(!newCentroid.title) newCentroid = song;
        else {
          const newCentroidPoints = this.getSongPoints(newCentroid);
          const songPoints = this.getSongPoints(song);

          if(newCentroidPoints < songPoints) newCentroid = song;
          if(newCentroidPoints === songPoints && newCentroid.listenMetrics < song.listenMetrics) newCentroid = song;
        }
      }

      newCentroids.push(newCentroid);
    }
    return newCentroids;
  }

  public cluster(): { clusters: number[][]; centroids: Song[] } {
    let centroids = this.data.slice(0, this.k);
    let clusters: any;

    let hasConverged = false;
    let iterations = 0;
    let previousClusters: number[][] | undefined;

    while (!hasConverged && iterations < this.maxIterations) {
      clusters = this.assignClusters();

      if (previousClusters) {
        hasConverged = clusters.every((cluster: any, index: number) =>
          cluster.every(
            (dataIndex: any) =>
              previousClusters && previousClusters[index].includes(dataIndex)
          )
        );
      }
      previousClusters = clusters;

      if (
        !hasConverged &&
        iterations > this.maxIterations / 2 &&
        clusters.some((c: any) => c.length === 0)
      ) {
        console.warn("Re-initializing centroids due to empty clusters.");
        centroids = this.data.slice(0, this.k);
        iterations = 0;
        previousClusters = undefined;
        continue;
      }

      centroids = this.updateCentroids(clusters);
      iterations++;
    }

    return { clusters, centroids };
  }
}

export const kmeans = (
  songs: Song[],
  genresSelected: string[],
  selectedArtists: string[]
) => {
  console.log("genres", genresSelected);
  const kmeans = new KMeans(
    genresSelected.length,
    100,
    songs,
    genresSelected,
    selectedArtists
  );
  return kmeans.cluster();
};
