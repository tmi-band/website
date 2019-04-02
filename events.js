function addEvents(tableId, events) {
  let tableRef = document.getElementById(tableId);

  // Add each of the events to the table.
  let index = 0;
  for (const e of events) {
    index += 1;

    // Insert a new row.
    row = tableRef.insertRow(-1);
    row.className = (index % 2 == 0) ? "event-table-even" : "event-table-odd";

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

const venues = {
  "macaroni_grill": {
    "name": "Macaroni Grill",
    "address": "5100 E Broadway Blvd, Tucson, AZ"
  },
  "hacienda_del_lago": {
    "name": "Hacienda del Lago Golf Course",
    "address": "14155 Via Rancho del Lago, Vail, AZ"
  },
  "house_of_bards": {
    "name": "House of Bards",
    "address": "4915 E Speedway Blvd, Tucson, AZ"
  }
}

const events = [
  {
    "date": "Apr 4",
    "time": "5:30 - 8:30",
    "cost": "Free",
    "venue": venues.macaroni_grill
  },
  {
    "date": "Jun 6",
    "time": "5:30 - 8:30",
    "cost": "Free",
    "venue": venues.macaroni_grill
  },
  {
    "date": "Jun 8",
    "time": "7:00 - 9:00",
    "cost": "Free",
    "venue": venues.hacienda_del_lago
  },
  {
    "date": "Jul 20",
    "time": "7:00 - 9:00",
    "cost": "Free",
    "venue": venues.hacienda_del_lago
  },
  {
    "date": "Aug 10",
    "time": "7:00 - 9:00",
    "cost": "Free",
    "venue": venues.hacienda_del_lago
  },
  {
    "date": "Sep 21",
    "time": "7:00 - 9:00",
    "cost": "Free",
    "venue": venues.hacienda_del_lago
  }
];
addEvents("event-table", events);
