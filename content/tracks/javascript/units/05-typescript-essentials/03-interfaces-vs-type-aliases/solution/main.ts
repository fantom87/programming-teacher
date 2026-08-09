interface Song {
  title: string;
  artist: string;
  seconds: number;
}

type Playlist = Song[];

const setlist: Playlist = [
  { title: "Neon Tide", artist: "The Halogens", seconds: 214 },
  { title: "Paper Planets", artist: "Orbit Club", seconds: 203 },
];

function describe(song: Song): string {
  return `${song.title} - ${song.artist} (${song.seconds}s)`;
}

function totalTime(songs: Playlist): number {
  return songs.reduce((sum, song) => sum + song.seconds, 0);
}

interface LiveSong extends Song {
  venue: string;
}

const encore: LiveSong = {
  title: "Static Bloom",
  artist: "The Halogens",
  seconds: 251,
  venue: "The Roxy",
};

for (const song of setlist) {
  console.log(describe(song));
}
console.log(`${setlist.length} songs, ${totalTime(setlist)} seconds`);
console.log(`${encore.title} live at ${encore.venue}`);
