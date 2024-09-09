// ==UserScript==
// @name        Inventory history to CSV
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Get Full Inventory History CSV by click
// @author       @esreyesj / Esteban Reyes
// @inject-into  auto
// @include      *://fcresearch-na.aka.amazon.com/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    //global varibles
    let getSpanList = document.getElementsByClassName("a-button a-button-base");

    // Function to download the table as CSV
    const downloadTableAsCSV = () => {
        const table = document.querySelector("#table-inventory-history_wrapper > div.dataTables_scroll > div.dataTables_scrollBody");
        const tableHead = document.querySelector("#table-inventory-history_wrapper > div.dataTables_scroll > div.dataTables_scrollHead > div > table > thead > tr");
    
        let csvContent = [];
    
        // Add table headers to CSV
        const headers = Array.from(tableHead.querySelectorAll('th')).map(header => header.innerText);
        csvContent.push(headers.join(','));
    
        // Add table rows to CSV
        const rows = Array.from(table.querySelectorAll('tbody tr.even, tbody tr.odd')).map(row => {
            const rowData = Array.from(row.querySelectorAll('td')).map(cell => cell.innerText);
            return rowData.join(',');
        });
    
        csvContent = csvContent.concat(rows);
        const csvString = csvContent.join('\n');
    
        // Create a timestamp as an integer
        const timestamp = Date.now();
    
        // Create a temporary link element for download
        const link = document.createElement('a');
        link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString));
        link.setAttribute('download', `inventory_history_${timestamp}.csv`);  // Filename with timestamp
    
        // Append link to the body and trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up the link
    };
    

    function render(){
        // Create a button element
        let myButton = document.createElement("button");
        // Add a class to the button
        myButton.classList.add("a-button-text");
        // Set button text
        myButton.innerHTML = "CSV";
        myButton.addEventListener("click", function(e) {
            e.preventDefault();
            downloadTableAsCSV();
        });
        let container = document.createElement("span");
        container.classList.add("a-button");
        container.classList.add("a-button-base");
        container.style.marginLeft = "5px";
        container.appendChild(myButton);
        console.log(getSpanList[0].parentElement.parentElement.parentElement);
        console.log(myButton)
        getSpanList[0].parentElement
            .parentElement.parentElement
            .appendChild(container);
    }
     // Callback function to handle mutations
     function handleMutations(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if(node.id === "table-inventory-history_filter"){
                    console.log('Child added:', node);
                    render();
                    // You can perform actions here upon child addition
                }
            });

//            mutation.removedNodes.forEach(function(node) {
 //               console.log('Child removed:', node);
                // You can perform actions here upon child removal
      //      });
       });
    }

    // Create a Mutation Observer with the callback function
    let observer = new MutationObserver(handleMutations);

    // Configuration for the observer (track childList and subtree)
    var config = {
        childList: true, // Observe changes to child elements
        subtree: true    // Include all descendant elements
    };

    // Start observing the target node (document.body) with the specified configuration
    observer.observe(document.body, config);

})();