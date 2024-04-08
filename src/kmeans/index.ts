// Interface for song data
interface Song {
  title: string;
  artists: string[];
  genres: string[];
  points: number; // Assuming points represent some metric (e.g., popularity)
}

class KMeans {
  private k: number; // Number of clusters
  private maxIterations: number;
  private data: Song[];

  constructor(k: number, maxIterations = 100, data: Song[]) {
    this.k = k;
    this.maxIterations = maxIterations;
    this.data = data;
  }

  // Encode genres as one-hot vectors for distance calculation
  private encodeGenres(genres: string[]): number[] {
    const genreSet = new Set<string>();
    for (const song of this.data) {
      for (const genre of song.genres) {
        genreSet.add(genre);
      }
    }

    // Convert Set to an array to use indexOf
    const genreArray = Array.from(genreSet);

    const oneHotEncoding: any = Array.from(genreSet).fill('0');

    for (let i = 0; i < genres.length; i++) {
      const genreIndex = genreArray.indexOf(genres[i]); // Use indexOf on the array
      if (genreIndex !== -1) {
        oneHotEncoding[genreIndex] = 1;
      } else {
        console.warn(`Genre "${genres[i]}" not found in dataset.`);
      }
    }

    return oneHotEncoding;
  }

  // Calculate distance between two songs (using one-hot encoded genres)
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

  // Update centroids based on assigned songs
  private updateCentroids(clusters: number[][]): Song[] {
    const newCentroids: Song[] = [];
    for (const cluster of clusters) {
      const newCentroid: Song = {
        title: "", // Can potentially be set to an average title
        artists: [], // Can potentially be set to a combined artist list
        genres: [],
        points: 0, // Can potentially be set to an average points value
      };

      if (cluster.length === 0) {
        // Handle empty clusters (consider re-initializing or merging)
        console.warn(
          "Empty cluster detected. Consider re-initializing centroids or merging clusters."
        );
        continue;
      }

      for (const dataIndex of cluster) {
        const song = this.data[dataIndex];
        // Update genres by accumulating occurrences (or consider averaging)
        for (const genre of song.genres) {
          if (!newCentroid.genres.includes(genre)) {
            newCentroid.genres.push(genre);
          }
        }
        // Update points (or consider averaging)
        newCentroid.points += song.points;
      }
      newCentroids.push(newCentroid);
    }
    return newCentroids;
  }

  // K-means algorithm implementation
  public cluster(): { clusters: number[][]; centroids: Song[] } {
    // Initialize centroids randomly
    let centroids = this.data.slice(0, this.k);
    let clusters: any;

    let hasConverged = false;
    let iterations = 0;
    let previousClusters: number[][] | undefined;

    while (!hasConverged && iterations < this.maxIterations) {
      clusters = this.assignClusters();

      // Check for convergence (minimal centroid movement)
      if (previousClusters) {
        hasConverged = clusters.every((cluster: any, index: number) =>
          cluster.every(
            (dataIndex: any) =>
              previousClusters && previousClusters[index].includes(dataIndex)
          )
        );
      }
      previousClusters = clusters;

      // Re-initialize centroids if empty clusters persist
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