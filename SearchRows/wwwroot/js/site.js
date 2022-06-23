// Scripts used in pharmacylist/index
SearchRows = {

    // Debounces the given function for the given time
    debounce: function(func, timeout = 300){
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    },


    // Counts the filtered addresses and the total addresses, displays them in a label
    countFilteredAddresses: function () {
        
        // Get all the neighborhoods
        let neighborhoodRows = document.querySelectorAll("[data-row-type='secondary']");
        // Get the info label
        let infoLabel = document.getElementById("filter-info");

        // Count the neighborhoods in display
        let count = 0;
        neighborhoodRows.forEach((neighborhood) => {
            if (neighborhood.hidden == false) {
                count++;
            }
        })


        let noResultTextBox = document.getElementById("no-result");
        if (count == 0) {

            noResultTextBox.hidden = false;
        }
        else {
            noResultTextBox.hidden = true;
        }

        // Display the search result
        infoLabel.innerHTML = count.toString() + " / " + neighborhoodRows.length.toString() + " Kayıt."
    },


    // Filters the addresses such that, if a primary row matches the filter it is displayed completely; if some secondary rows from a primary row match, only displays them; if a primary row has no matching secondary rows and is not a hit it displays nothing
    filterAddresses: function () {
        // Get the search Input
        input = document.getElementById("search-input");
        // Get the input to uppercase
        let filter = input.value.toUpperCase();
        // Get all the primary rows
        let primaryRows = document.querySelectorAll("[data-row-type='primary']");

        primaryRows.forEach((primaryRow) => {
            // Get its name
            let primaryName = primaryRow.dataset.name.toUpperCase();
            primaryName = primaryName.replaceAll("\u0130", "I");

            // Get its id
            let primaryId = primaryRow.dataset.id;

            // Get all the secondary rows of this primary row
            let secondaryRows = document.querySelectorAll("[data-primary-row-id='" + primaryId + "'][data-row-type='secondary']");

            // Create a boolean that will store wether the primary row has any child elements displayed
            let allSecondaryHidden = true;

            // If the primary row matches the filter
            if (primaryName.indexOf(filter) > -1) {
                // First, un-hide the primary row
                primaryRow.hidden = false;
                // Then, un-hide all its child secondary rows
                secondaryRows.forEach((secondaryRow) => {
                    secondaryRow.hidden = false;
                    // Store the info that the secondary rows are a filter result
                    secondaryRow.dataset.filterHit = true;
                })
            }

            // If the primary row does not match the filter
            else {
                // For each secondary row, eveluate it against the filter
                secondaryRows.forEach((secondaryRow) => {
                    // Get its name
                    let secondaryName = secondaryRow.dataset.name.toUpperCase();
                    secondaryName = secondaryName.replaceAll("\u0130", "I");

                    // Evaluate it against the filter
                    if (secondaryName.indexOf(filter) > -1) {
                        // If there is a match un-hide it
                        secondaryRow.hidden = false;
                        // If there is a match, store this info
                        secondaryRow.dataset.filterHit = true;
                        // Since there is a secondary row in that primary row, store this info
                        allSecondaryHidden = false;
                    } else {
                        // If there is no match hide it
                        secondaryRow.hidden = true;
                        // And store this info
                        secondaryRow.dataset.filterHit = false;
                    }
                })

                // Then hide the primary row if there is no match inside it
                if (allSecondaryHidden == true) {
                    primaryRow.hidden = true;
                }
                // And un-hide it if there is a match of a secondary row
                else if (allSecondaryHidden == false) {
                    primaryRow.hidden = false;
                }
            }
        })
    },

    // All the secondary rows that should be displayed under the primary row are unhidden
    expandPrimaryRow: function () {
        // Get all the primary rows expand buttons
        let primaryRowExpandButtons = document.querySelectorAll("[data-button-type='primary-row-expand-button']");
        primaryRowExpandButtons.forEach((button) => {
            button.addEventListener("click", function () {
                // Hides this button and un-hides the collapse button when the expand button is clicked
                let primaryRowId = button.dataset.primaryRowId;
                let collapseButton = document.querySelector("[data-button-type='primary-row-collapse-button'][data-primary-row-id='" + primaryRowId + "']");
                button.hidden = true;
                collapseButton.hidden = false;

                // Un-hides the secondary rows under this primary row that should be displayed
                let secondaryRows = document.querySelectorAll("[data-primary-row-id='" + primaryRowId + "'][data-filter-hit='true']");
                secondaryRows.forEach((row) => {
                    row.hidden = false;
                })
                button.removeEventListener("click", function () { });
            })
        })
    },

    // All the secondary rows that should be displayed under the primary row are hidden
    collapsePrimaryRow: function () {
        // Get all the primary rows collapse buttons
        let primaryRowCollapseButtons = document.querySelectorAll("[data-button-type='primary-row-collapse-button']");
        // Hides this button and un-hides the expand button when the collapse button is clicked
        primaryRowCollapseButtons.forEach((button) => {
            button.addEventListener("click", function () {
                let primaryRowId = button.dataset.primaryRowId;
                let expandButton = document.querySelector("[data-button-type='primary-row-expand-button'][data-primary-row-id='" + primaryRowId + "']");
                button.hidden = true;
                expandButton.hidden = false;

                // Hides the secondary rows under this primary row that should be displayed
                let secondaryRows = document.querySelectorAll("[data-primary-row-id='" + primaryRowId + "'][data-filter-hit='true']");
                secondaryRows.forEach((row) => {
                    row.hidden = true;
                })

                button.removeEventListener("click", function () { });
            })
        })
    },

    // Creates all rows given the data
    createAllRows: async function (row1Data, row2Data) {
        let table = document.getElementById("search-table").getElementsByTagName('tbody')[0];
        // For each primary row
        row1Data.forEach((primaryRow) => {
            // Create header cell
            let headerCell = document.createElement("th");
            // Text for th
            let name = document.createTextNode(primaryRow.NAME);

            // Expand button
            let expandButton = document.createElement("button");
            expandButton.type = "button";
            expandButton.dataset.buttonType = "primary-row-expand-button";
            expandButton.dataset.primaryRowId = primaryRow.ID;
            expandButton.hidden = true;
            expandButton.append(document.createTextNode("Expand"));

            // Collapse button
            let collapseButton = document.createElement("button");
            collapseButton.type = "button";
            collapseButton.dataset.buttonType = "primary-row-collapse-button";
            collapseButton.dataset.primaryRowId = primaryRow.ID;
            collapseButton.hidden = false;
            collapseButton.append(document.createTextNode("Collapse"));

            // Add text and buttons to header cell
            headerCell.append(name, expandButton, collapseButton);

            // Insert row into table
            let pRow = table.insertRow(-1);
            // Row's specs
            pRow.className = "table-dark primary-row";
            pRow.dataset.rowType = "primary";
            pRow.dataset.id = primaryRow.ID;
            pRow.dataset.name = primaryRow.NAME;

            // Add th to cell
            pRow.append(headerCell);

            // For each secondary row
            row2Data.forEach((secondaryRow) => {
                // IF the secondary row belongs to this primary row
                if (secondaryRow.PRIMARY_ID == primaryRow.ID) {

                    // Create header cell
                    let headerCell2 = document.createElement("th");
                    // Text for th
                    let name = document.createTextNode(secondaryRow.NAME);
                    // Add text to header cell
                    headerCell2.append(name);

                    // Insert row into table
                    let sRow = table.insertRow(-1);
                    // Row's specs
                    sRow.className = "table-light";
                    sRow.dataset.rowType = "secondary";
                    sRow.dataset.id = secondaryRow.ID;
                    sRow.dataset.name = secondaryRow.NAME;
                    sRow.dataset.primaryRowId = secondaryRow.PRIMARY_ID;
                    sRow.dataset.filterHit = true;
                    // Add th to cell
                    sRow.append(headerCell2);
                }
            })
        })

    },

    getData: async function () {
        // Get primary row data
        let data1;
        await fetch("Data/Row1Data.json")
            .then(res => res.json())
            .then(data => data1 = data);

        // Get secondary row data
        let data2;
        await fetch("Data/Row2Data.json")
            .then(res => res.json())
            .then(data => data2 = data);

        // Give data to create function
        this.createAllRows(data1, data2);

        // Create expand-collapse buttons
        this.expandPrimaryRow();
        this.collapsePrimaryRow();
    },

    loadPageAndAddEvents: function () {
        // Get the search Input
        input = document.getElementById("search-input");

        // When a filter is entered by user, debounce the filter function
        input.addEventListener("input", this.debounce(() => this.filterAddresses()));

        // Get the data, create rows and add expand-collapse events
        this.getData();
    },
};