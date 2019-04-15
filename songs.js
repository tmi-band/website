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
  },
  {
    title: "Corazon Espinado",
    artist: "Santana"
  },
  {
    title: "Take it on the Run",
    artist: "REO Speedwagon"
  },
  {
    title: "Ain't no Sunshine",
    artist: "Bill Withers"
  },
  {
    title: "Brown Eyed Girl",
    artist: "Van Morrison"
  },
  {
    title: "Mustang Sally",
    artist: "Buddy Guy"
  },
  {
    title: "Black Horse and a Cherry Tree",
    artist: "KT Tunstall"
  },
  {
    title: "The Heart of You",
    artist: "TMI Original"
  },
  {
    title: "Stray Cat Strut",
    artist: "The Stray Cats"
  },
  {
    title: "Hit Me with Your Best Shot",
    artist: "Pat Benatar"
  },
  {
    title: "Can't Get Enough",
    artist: "Bad Company"
  },
  {
    title: "Play that Funky Music",
    artist: "Wild Cherry"
  },
  {
    title: "Green River",
    artist: "Creedence Clearwater Revival"
  },
  {
    title: "Shakin'",
    artist: "Eddie Money"
  },
  {
    title: "Cold Shot",
    artist: "Stevie Ray Vaughan"
  },
  {
    title: "Mary Jane's Last Dance",
    artist: "Tom Petty"
  },
  {
    title: "Refugee",
    artist: "Tom Petty"
  },
  {
    title: "Traveling Band",
    artist: "Creedence Clearwater Revival"
  },
  {
    title: "Born on the Bayou",
    artist: "Creedence Clearwater Revival"
  },
  {
    title: "Old Time Rock and Roll",
    artist: "Bob Seger"
  },
  {
    title: "Your Mama Don't Dance",
    artist: "Loggins and Messina"
  },
  {
    title: "Back on the Chain Gang",
    artist: "The Pretenders"
  },
  {
    title: "Black Magic Woman",
    artist: "Santana"
  },
  {
    title: "Evil Ways",
    artist: "Santana"
  },
  {
    title: "Hard to Handle",
    artist: "The Black Crowes"
  },
  {
    title: "Under the Boardwalk",
    artist: "The Drifters"
  },
  {
    title: "You May be Right",
    artist: "Billy Joel"
  },
  {
    title: "La Bamba",
    artist: "Ritchie Valens"
  },
  {
    title: "Roadhouse Blues",
    artist: "The Doors"
  },
  {
    title: "Drift Away",
    artist: "Dobie Gray"
  },
  {
    title: "Wonderful Tonight",
    artist: "Eric Clapton"
  },
  {
    title: "Save the Last Dance",
    artist: "The Drifters"
  },
  {
    title: "Keep Your Hands to Yourself",
    artist: "Georgia Satellites"
  },
  {
    title: "Drive",
    artist: "Incubus"
  },
  {
    title: "Open Invitation",
    artist: "Santana"
  },
  {
    title: "Knockin' on Heaven's Door",
    artist: "Bob Dylan"
  },
  {
    title: "Rock and Roll all Nite",
    artist: "Kiss"
  },
  {
    title: "China Grove",
    artist: "The Doobie Brothers"
  },
  {
    title: "Lights",
    artist: "Journey"
  },
  {
    title: "Your Love",
    artist: "The Outfield"
  }
];
addSongs("song-table", songs);
