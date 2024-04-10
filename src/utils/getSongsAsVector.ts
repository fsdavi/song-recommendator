import { songsDataset } from "@/data/musics";
import { getSongPoints } from "@/utils/index";

const getSongsAsVector = (
  genresSelected: string[],
  artists: string[]
): number[][] => {
  return songsDataset.map((song) => {
    const songPoints = getSongPoints({ song, genresSelected, selectedArtists: artists });

    return [
      song.listenMetrics * songPoints,
      songPoints
    ];
  });
};

export default getSongsAsVector;
