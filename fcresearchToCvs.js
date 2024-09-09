// ==UserScript==
// @name         Time Travel + Download Aggregated Inventory History
// @namespace    https://www.linkedin.com/in/djwsoftdev/
// @version      0.1
// @description  Adds a download button above the inventory history and receive history on fcresearch and downloads aggregated data, includes time travel back 180 days.
// @author       wiljdaws, saihutd
// @match        *://fcresearch-eu.aka.amazon.com/*/results?s=*
// @match        *://fcresearch-na.aka.amazon.com/*/results?s=*
// @downloadURL https://axzile.corp.amazon.com/-/carthamus/download_script/time-travel-+-download-aggregated-inventory-history.user.js
// @updateURL https://axzile.corp.amazon.com/-/carthamus/download_script/time-travel-+-download-aggregated-inventory-history.user.js
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @icon         https://cdn.wikirby.com/thumb/5/51/KF2_Beam_2.png/240px-KF2_Beam_2.png
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==
/*eslint-env jquery*/

// Wait for the table to finish loading
//waitForKeyElements("#table-inventory-history", function() {
 // var table = document.getElementById('table-inventory-history');
  // Scroll down to the bottom of the table
 // var rowpos = $('#table-inventory-history tr:last').position();
  //  document.querySelector("#table-inventory-history_wrapper").scrollTo(0,document.querySelector("#table-inventory-history_wrapper").scrollHeight);
  /// Scroll back up to the top of the table
  //table.scrollTop = 0;
//}, true);
// Wait for the table to finish loading
waitForKeyElements("#table-inventory-history", function() {
    var table = document.querySelector("#table-inventory-history_wrapper > div.dataTables_scroll > div.dataTables_scrollBody");
    // Trigger a scroll event to simulate scrolling to the bottom of the table
    var event = new Event('scroll');
    table.dispatchEvent(event);
  }, true);
  // Function to scroll down the table to load all rows
  function scrollTable() {
    var table = document.getElementById('table-inventory-history_wrapper');
    var previousScrollHeight = -1;
    var scrollInterval = setInterval(function() {
      var currentScrollHeight = table.scrollHeight;
      if (currentScrollHeight !== previousScrollHeight) {
        table.scrollTop = currentScrollHeight;
        previousScrollHeight = currentScrollHeight;
      } else {
        clearInterval(scrollInterval);
      }
    }, 1000); // Adjust the interval if needed
  }
  function convertToCSV(table) {
    var csv = [];
    var rows = table.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols = rows[i].querySelectorAll('td, th');
      if (i == 1) { continue; }
      for (var j = 0; j < cols.length; j++) {
        row.push(cols[j].innerText);
      }
      csv.push(row);
    }
    // Find rows with the same values in columns 2-7 and 10-14
    for (var k = 0; k < csv.length - 1; k++) {
      var currentRow = csv[k];
      var nextRow = csv[k + 1];
      var shouldSum = true;
      // Check if columns 2-7 and 10-14 have the same values
      for (var m = 1; m <= 6; m++) {
        if (currentRow[m] !== nextRow[m] || currentRow[m + 9] !== nextRow[m + 9]) {
          shouldSum = false;
          break;
        }
      }
      // Sum the quantities in column 8 for rows with the same values
      if (shouldSum) {
        currentRow[7] = parseFloat(currentRow[7]) + parseFloat(nextRow[7]);
        csv.splice(k + 1, 1); // Remove the next row from the CSV array
        k--; // Decrement the index to recheck the current row with the updated next row
      }
    }
    // Convert the modified CSV array back to a CSV string
    var csvString = csv.map(row => row.join(',')).join('\n');
    return csvString;
  }
  function convertToTable(table) {
    var csv = [];
    var rows = table.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols = rows[i].querySelectorAll('td, th');
      if (i == 1) { continue; }
      for (var j = 0; j < cols.length; j++) {
        row.push(cols[j].innerText);
      }
      csv.push(row);
    }
    // Find rows with the same values in columns 2-7 and 10-14
    for (var k = 0; k < csv.length - 1; k++) {
      var currentRow = csv[k];
      var nextRow = csv[k + 1];
      var shouldSum = true;
      // Check if columns 2-7 and 10-14 have the same values
      for (var m = 1; m <= 6; m++) {
        if (currentRow[m] !== nextRow[m] || currentRow[m + 9] !== nextRow[m + 9]) {
          shouldSum = false;
          break;
        }
      }
      // Sum the quantities in column 8 for rows with the same values
      if (shouldSum) {
        currentRow[7] = parseFloat(currentRow[7]) + parseFloat(nextRow[7]);
        csv.splice(k + 1, 1); // Remove the next row from the CSV array
        k--; // Decrement the index to recheck the current row with the updated next row
      }
    }
    // Convert the modified CSV array back to a CSV string
    var csvString = csv.map(row => row.join('\t')).join('\n');
    return csvString;
  }
  function convertToCSVReceive(table) {
    var csv = [];
    var rows = table.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols = rows[i].querySelectorAll('td, th');
      if (i == 1) { continue; }
      for (var j = 0; j < cols.length; j++) {
        row.push(cols[j].innerText);
      }
      csv.push(row);
    }
    // Find rows with the same values in columns 2-7 and 10-14
    for (var k = 0; k < csv.length - 1; k++) {
      var currentRow = csv[k];
      var nextRow = csv[k + 1];
      var shouldSum = true;
      // Check if columns 2-7 and 10-14 have the same values
      for (var m = 1; m <= 4; m++) {
        if (currentRow[m] !== nextRow[m] || currentRow[m + 6] !== nextRow[m + 6]) {
          shouldSum = false;
          break;
        }
      }
      // Sum the quantities in column 8 for rows with the same values
      if (shouldSum) {
        currentRow[5] = parseFloat(currentRow[5]) + parseFloat(nextRow[5]);
        csv.splice(k + 1, 1); // Remove the next row from the CSV array
        k--; // Decrement the index to recheck the current row with the updated next row
      }
    }
    // Convert the modified CSV array back to a CSV string
    var csvString = csv.map(row => row.join(',')).join('\n');
    return csvString;
  }
  // Function to download table as a CSV file
  function downloadTableAsCSV(filename) {
    var table = document.getElementById('table-inventory-history_wrapper');
    var csv = convertToCSV(table);
    // Create a temporary link element
    var link = document.createElement('a');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    link.setAttribute('download', filename);
    // Trigger the download
    document.body.appendChild(link); // Append the link to the DOM
    link.click();
    document.body.removeChild(link); // Clean up by removing the link from the DOM
  }
  // Function to copy table as a CSV file
  function copyTableAsCSV() {
    var table = document.getElementById('table-inventory-history_wrapper');
    var tablehead = document.querySelector("#table-inventory-history_wrapper > div.dataTables_scroll > div.dataTables_scrollHead > div > table > thead > tr")
    var visiblehead = Array.from(tablehead.querySelectorAll('th'));
    const visibleheadData = visiblehead.map(row => {
      const headcells = Array.from(row.querySelectorAll('div'));
      const headrowData = headcells.map(cell => cell.innerText + ', \t');
      return headrowData;
    });
    const visibleRows = Array.from(table.querySelectorAll('tbody tr.even, tbody tr.odd'));
    const visibleData = visibleRows.map(row => {
      const cells = Array.from(row.querySelectorAll('th, td'));
      const rowData = cells.map(cell => cell.innerText + '\t');
      return rowData;
    });
    var csvContent = visibleheadData.map(row => row).join('\t') + '\n';
    csvContent = csvContent + visibleData.map(row => row).join('\n');
    console.log(csvContent)
    GM_setClipboard(csvContent)
  }
  // Extract the last 12 characters of the URL after 'http://fcresearch-na.aka.amazon.com/FTW5/results?s='
  var url = window.location.href;
  var match = url.match(/\.com\/(.*?)\/results\?s/);
  var extractedValue = match && match[1];
  var regionMatch = url.match(/fcresearch-(.*?)\.aka\.amazon\.com/);
  var region = regionMatch && regionMatch[1];
  if (extractedValue && region) {
      var identifier = 'https://fcresearch-' + region + '.aka.amazon.com/' + match[1] + '/results?s=';
      var identifierInURL = url.split(identifier)[1];
      var filename = 'Inventory_History_' + identifierInURL.substr(0, 12);
      console.log("Region:", region);
  } else {
      console.log("Sike, nothing found, check code");
  }
  // Find the location to insert the button
  var tableParent = document.querySelector('#inventory-history-nav').parentNode;
  // Add a button to download the table as CSV
  var button = document.createElement('button');
  button.innerHTML = 'Download Inventory History';
  button.addEventListener('click', function () {
    downloadTableAsCSV(filename);
  });
  // Insert the button before the desired location
  tableParent.insertBefore(button, document.querySelector('#inventory-history-nav'));
  // Function to download table as a CSV file
  function downloadTableAsCSV2(filename) {
    var table = document.getElementById('table-receive-history_wrapper');
    var csv = convertToCSVReceive(table);
    // Create a temporary link element
    var link = document.createElement('a');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    link.setAttribute('download', filename);
    // Trigger the download
    document.body.appendChild(link); // Append the link to the DOM
    link.click();
    document.body.removeChild(link); // Clean up by removing the link from the DOM
  }
  // Extract the last 12 characters of the URL after 'http://fcresearch-na.aka.amazon.com/FTW5/results?s='
  var url2 = window.location.href;
  var match2 = url.match(/\.com\/(.*?)\/results\?s/);
  var extractedValue2 = match && match[1];
  var regionMatch2 = url.match(/fcresearch-(.*?)\.aka\.amazon\.com/);
  var region2 = regionMatch && regionMatch[1];
  if (extractedValue2 && region) {
      var identifier2 = 'https://fcresearch-' + region2 + '.aka.amazon.com/' + match2[1] + '/results?s=';
      var identifierInURL2 = url.split(identifier)[1];
      var filename2 = 'Receive_History_' + identifier2.substr(0, 12);
      console.log("Region:", region2);
  } else {
      console.log("Sike, nothing found, check code");
  }
  // Find the location to insert the button
  var tableParent2 = document.querySelector('#inventory-history-nav').parentNode;
  // Add a button to download the table as CSV
  var button2 = document.createElement('button');
  button2.innerHTML = 'Download Receive History';
  button2.addEventListener('click', function () {
    downloadTableAsCSV2(filename2);
  });
  // Add a button to download the table as CSV
  const copyButton = document.createElement('button');
  copyButton.textContent = 'Copy Table';
  copyButton.addEventListener('click', copyTableAsCSV);
  // Insert the button before the desired location
  tableParent2.insertBefore(button2, document.querySelector('#receive-history-nav'));
  tableParent.insertBefore(copyButton, document.querySelector('#inventory-history-nav'));
  // Add custom styles
  GM_addStyle(`
          button {
              padding: 5px 10px;
              margin: 5px 5px 5px 5px;
              font-size: 14px;
              background-color: #007bff;
              color: #fff;
              border: none;
              border-radius: 4px;
              cursor: pointer;
          }
      `);
  