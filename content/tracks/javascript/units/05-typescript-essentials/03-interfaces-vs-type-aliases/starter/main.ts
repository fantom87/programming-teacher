// 1. interface Song — title: string, artist: string, seconds: number.
//    Then: type Playlist = Song[];  ...and annotate setlist below.

const setlist = [
  { title: "Neon Tide", artist: "The Halogens", seconds: 214 },
  { title: "Paper Planets", artist: "Orbit Club", seconds: 203 },
];

// 2. describe(song: Song): string -> `${title} - ${artist} (${seconds}s)`

// 3. totalTime(songs: Playlist): number — sum the seconds with reduce.

// 4. interface LiveSong extends Song { venue: string }
//    const encore: LiveSong = Static Bloom / The Halogens / 251s / The Roxy.

// 5. Print each setlist song described, then
//    `${setlist.length} songs, ${totalTime(setlist)} seconds`,
//    then `${encore.title} live at ${encore.venue}`.
