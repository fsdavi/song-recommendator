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
      if (this.genresSelected.includes(genre.toLowerCase())) points++;
    }

    for (const artist of song.artists) {
      if(this.selectedArtists.includes(artist.toLowerCase())) points+=2;
    }

    return points;
  }

  private assignClusters(): Song[][] {
    const clusters: Song[][] = [];
    for (let i = 0; i < this.k; i++) {
      clusters.push([]);
    }

    for (const song of this.data) {
      const points = this.getSongPoints(song);

      if(!clusters[points]) clusters[clusters.length - 1];
      else clusters[points].push(song);
    }

    return clusters;
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
        if (!newCentroid.title) newCentroid = song;
        else {
          const newCentroidPoints = this.getSongPoints(newCentroid);
          const songPoints = this.getSongPoints(song);

          if (newCentroidPoints < songPoints) newCentroid = song;
          if (
            newCentroidPoints === songPoints &&
            newCentroid.listenMetrics < song.listenMetrics
          )
            newCentroid = song;
        }
      }

      newCentroids.push(newCentroid);
    }
    return newCentroids;
  }

  public getSongsByArtists(): Song[][] {
    const songsByArtists = [];
    for (const artist of this.selectedArtists) {
      const songs = this.data.filter((song) =>
        {
          const artists = song.artists.map((artist) => artist.toLowerCase());
          return artists.includes(artist.toLowerCase());
        }
      );
      songsByArtists.push(songs);
    }
    return songsByArtists;
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
  const clustersSize = genresSelected.length + selectedArtists.length > 4 ? genresSelected.length + selectedArtists.length : 4;

  const kmeans = new KMeans(
    clustersSize,
    100,
    songs,
    genresSelected,
    selectedArtists
  );
  return kmeans.cluster();
};
