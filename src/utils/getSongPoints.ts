import { Song } from "@/types";

const getSongPoints = ({
  song,
  genresSelected,
  selectedArtists,
}: {
  song: Song;
  genresSelected: string[];
  selectedArtists: string[];
}): number => {
  let points: number = 1;

  for (const genre of song.genres) {
    if (genresSelected.includes(genre.toLowerCase())) points =+ 100;
  }

  for (const artist of song.artists) {
    if (selectedArtists.includes(artist.toLowerCase())) points += 1000;
  }

  return points;
};

export default getSongPoints;