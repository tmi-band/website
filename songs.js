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

const url = "https://cpsb1m4cnk.execute-api.us-west-2.amazonaws.com/production/songs"
$.ajax({
    type: "GET",
    url: url,
    accepts: {
      "text json": "application/json"
    },
    cache: false,
    crossDomain: "true",

    success: function(data) {
      addSongs("song-table", JSON.parse(data.body).songs);
    },
    error: function() {
      alert("An error occurred while trying to retrieve the list of songs. "
            + "If this problem persists, please use the contact form to let "
            + "us know.");
    }
  });
