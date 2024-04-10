import { Song } from "@/types";
import { songsDataset } from "@/data/musics";
import euclidianDistance from "./euclidianDistance";

const getSongNearestToCentroid = (
  centroid: number[],
  songsAsVectors: number[][]
): Song => {
  let min = Infinity;
  let songIndex = 0;

  songsAsVectors.forEach((song, index) => {
    const distance = euclidianDistance(song, centroid);
    if (distance < min) {
      min = distance;
      songIndex = index;
    }
  });

  return songsDataset[songIndex];
};

export default getSongNearestToCentroid;