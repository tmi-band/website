function addEvents(tableId, events) {
  let tableRef = document.getElementById(tableId);

  // Add each of the events to the table.
  let index = 0;
  for (const e of events) {
    index += 1;

    // Insert a new row.
    row = tableRef.insertRow(-1);
    row.className = index % 2 == 0 ? "event-table-even" : "event-table-odd";

    // Add the event date cell to the row.
    dateCell = row.insertCell(0);
    dateCell.className = "event-date";
    dateCell.appendChild(document.createTextNode(e.date));

    // Add the event location cell to the row.
    locationCell = row.insertCell(1);
    locationCell.className = "event-location";

    // Add the venue name to the event location cell.
    venueName = document.createElement("p");
    venueName.className = "venue-name";
    venueName.appendChild(document.createTextNode(e.venue.name));
    locationCell.appendChild(venueName);

    // Add the venue address to the event location cell.
    venueAddress = document.createElement("p");
    venueAddress.className = "venue-address";
    venueAddress.appendChild(document.createTextNode(e.venue.address));
    locationCell.appendChild(venueAddress);

    // Add the cost and time cell to the row.
    costAndTimeCell = row.insertCell(2);

    // Add the cost to the cost and time cell.
    eventCost = document.createElement("p");
    eventCost.className = "event-cost";
    eventCost.appendChild(document.createTextNode(e.cost));
    costAndTimeCell.appendChild(eventCost);

    // Add the time to the cost and time cell.
    eventTime = document.createElement("p");
    eventTime.className = "event-time";
    eventTime.appendChild(document.createTextNode(e.time));
    costAndTimeCell.appendChild(eventTime);
  }
}

const url = "https://cpsb1m4cnk.execute-api.us-west-2.amazonaws.com/production/events"
$.ajax({
    type: "GET",
    url: url,
    accepts: {
      "text json": "application/json"
    },
    cache: false,
    crossDomain: "true",

    success: function(data) {
      currentTime = Date.now();
      events = JSON.parse(data.body).events;

      function isPastEvent(event) {
        eventTime = Date.parse(event["start"]);
        return eventTime < currentTime;
      }

      upcomingEvents = events.filter(event => !isPastEvent(event));
      pastEvents = events.filter(event => isPastEvent(event)).reverse();

      addEvents("event-table", upcomingEvents);
      addEvents("past-event-table", pastEvents);
    },
    error: function() {
      alert("An error occurred while trying to retrieve the list of events. "
            + "If this problem persists, please use the contact form to let "
            + "us know.");
    }
  });
