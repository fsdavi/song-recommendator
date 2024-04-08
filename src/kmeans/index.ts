interface Song {
  title: string;
  artists: string[];
  genres: string[];
  points: number;

class KMeans {
  private k: number;
  private maxIterations: number;
  private data: Song[];

  constructor(k: number, maxIterations = 100, data: Song[]) {
    this.k = k;
    this.maxIterations = maxIterations;
    this.data = data;
  }

  private encodeGenres(genres: string[]): number[] {
    const genreSet = new Set<string>();
    for (const song of this.data) {
      for (const genre of song.genres) {
        genreSet.add(genre);
      }
    }

    const genreArray = Array.from(genreSet);

    const oneHotEncoding: any = Array.from(genreSet).fill('0');

    for (let i = 0; i < genres.length; i++) {
      const genreIndex = genreArray.indexOf(genres[i]);
      if (genreIndex !== -1) {
        oneHotEncoding[genreIndex] = 1;
      } else {
        console.warn(`Genre "${genres[i]}" not found in dataset.`);
      }
    }

    return oneHotEncoding;
  }

  private distance(song1: Song, song2: Song): number {
    const encodedGenre1 = this.encodeGenres(song1.genres);
    const encodedGenre2 = this.encodeGenres(song2.genres);

    let sum = 0;
    for (let i = 0; i < encodedGenre1.length; i++) {
      const diff = encodedGenre1[i] - encodedGenre2[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }

  // Assign each song to the nearest centroid
  private assignClusters(): number[][] {
    const clusters: number[][] = [];
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
      clusters[closestCentroid].push(this.data.indexOf(song));
    }
    return clusters;
  }

  private updateCentroids(clusters: number[][]): Song[] {
    const newCentroids: Song[] = [];
    for (const cluster of clusters) {
      const newCentroid: Song = {
        title: "",
        artists: [],
        genres: [],
        points: 0,
      };

      if (cluster.length === 0) {
        console.warn(
          "Empty cluster detected. Consider re-initializing centroids or merging clusters."
        );
        continue;
      }

      for (const dataIndex of cluster) {
        const song = this.data[dataIndex];
        for (const genre of song.genres) {
          if (!newCentroid.genres.includes(genre)) {
            newCentroid.genres.push(genre);
          }
        }
        newCentroid.points += song.points;
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

export const kmeans = (clustersNumbers: number) => {
  const data: Song[] = [
    {
      title: "Song",
      artists: ["Artist"],
      genres: ["Metal"],
      points: 0,
    },
    {
      title: "Song 2",
      artists: ["Artist"],
      genres: ["Pop"],
      points: 0,
    },
    {
      title: "Song 3",
      artists: ["Artist"],
      genres: ["Rock"],
      points: 0,
    },
    {
      title: "Song 4",
      artists: ["Artist"],
      genres: ["Rock"],
      points: 0,
    },
    {
      title: "Song 5",
      artists: ["Artist"],
      genres: ["Pop"],
      points: 0,
    },
    {
      title: "Song 6",
      artists: ["Artist"],
      genres: ["Pop"],
      points: 0,
    }
  ];

  const kmeans = new KMeans(clustersNumbers, 100, data);
  return kmeans.cluster();
}