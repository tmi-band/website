function addSongs(tableId, songs) {
  let tableRef = document.getElementById(tableId);

  // Add each of the songs to the table.
  let index = 0;
  for (const song of songs) {
    index += 1;

    // Insert a new row.
    row = tableRef.insertRow(-1);
    row.className = index % 2 == 0 ? "song-table-even" : "song-table-odd";

    // Add the song title cell to the row.
    titleCell = row.insertCell(0);
    titleCell.className = "song-title";
    titleCell.appendChild(document.createTextNode(song.title));

    // Add the artist cell to the row.
    artistCell = row.insertCell(1);
    artistCell.className = "song-artist";
    artistCell.appendChild(document.createTextNode(song.artist));
  }
}

const songs = [
  {
    title: "Any Way You Want It",
    artist: "Journey"
  },
  {
    title: "Summer of 69",
    artist: "Bryan Adams"
  },
  {
    title: "Wanted Dead or Alive",
    artist: "Bon Jovi"
  },
  {
    title: "Sweet Child O' Mine",
    artist: "Guns N Roses"
  },
  {
    title: "Pride and Joy",
    artist: "Stevie Ray Vaughan"
  },
  {
    title: "Breakdown",
    artist: "Tom Petty"
  },
  {
    title: "Forever Man",
    artist: "Eric Clapton"
  },
  {
    title: "Two Tickets to Paradise",
    artist: "Eddie Money"
  },
  {
    title: "Purple Rain",
    artist: "Prince"
  }
];
addSongs("song-table", songs);
