document.addEventListener("DOMContentLoaded", function () {
    const detailsButtons = document.querySelectorAll(".details-button");
    const modalTitle = document.getElementById("clientDetailsModalLabel");

    detailsButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const title = button.getAttribute("data-client"); // Default title
            // Update the modal title
            modalTitle.textContent = title + " Details";
            document.getElementById("hiddenClientDetailsContent").value = title;
            // Show the modal
            $("#" + title.replace(/ /g, '_') + "Modal").modal("show");
        });
    });


    const emailDetailsButton = document.querySelectorAll(".email-button");
    const emailModalTitle = document.getElementById("emailModalLabel");

    emailDetailsButton.forEach((button) => {
        button.addEventListener("click", function () {
            const title = button.getAttribute("data-client"); // Default title
            document.getElementById("hiddenClientDetailsContent").value = title;
            // Show the modal
            $("#" + title.replace(/ /g, '_') + "emailModal").modal("show");
        });
    });

    const clientdetailsButtons = document.querySelectorAll(".client-button");

    clientdetailsButtons.forEach((button) => {
        button.addEventListener("click", function () {
            $("#newClientModal").modal("show");
        });
    });

    
    const sidebarLinks = document.querySelectorAll('.nav-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            sidebarLinks.forEach(link => link.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // const table = document.getElementById('invoicetable');

    // if (table) {
    //     // Add click event listeners to all table cells
    //     table.addEventListener('input', function (event) {
    //         const targetCell = event.target;

    //         if (targetCell.tagName === 'TD' && targetCell.parentNode === table.tBodies[0].lastElementChild) {
    //             // Create a new row (tr) and a new cell (td) with contenteditable attribute
    //             const newRow = document.createElement('tr');
    //             const newCell = document.createElement('td');
    //             newCell.setAttribute('contenteditable', 'true');
        
    //             // Append the new cell to the new row
    //             newRow.appendChild(newCell);

    //             // Append the new row to the table body
    //             table.tBodies[0].appendChild(newRow);
    //         }
    //     });
    // }
    const menutable = document.getElementById('menutable');

    if (menutable) {
        menutable.addEventListener('input', function (event) {
            const targetCell = event.target;

            if (
                targetCell.tagName === 'TD' &&
                targetCell.parentNode === menutable.tBodies[0].lastElementChild
            ) {
                // Create a new row (tr)
                const newRow = document.createElement('tr');

                // Create new cells (td) with content-editable attribute
                for (let i = 0; i < 5; i++) {
                    const newCell = document.createElement('td');
                    newCell.setAttribute('contenteditable', 'true');
                    newRow.appendChild(newCell);
                }

                // Append the new row to the table body
                menutable.tBodies[0].appendChild(newRow);
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    $('#invoicetable').on('input', '.lastFreeColumn .name', function () {
        // Get the last row with the class 'lastFreeColumn'
        const lastRow = $('#invoicetable tr.lastFreeColumn');

        // Clone the last row with its content and classes
        const newRow = lastRow.clone();

        // Remove the 'lastFreeColumn' class from the new row
        newRow.removeClass('lastFreeColumn');

        // Clear the input in the 'name' cell of the new row
        newRow.find('.name').text('');

        // Append the new row to the table
        $('#invoicetable').append(newRow);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const priceCells = document.querySelectorAll('.price');
    const totalCells = document.querySelectorAll('.total');
    const subtotalCell = document.querySelector('.subtotal');
    const totalTaxableCell = document.querySelector('.totalTaxable');
    const taxCells = document.querySelectorAll('.tax');
    const saleTaxCell = document.querySelector('.saleTax');
    const totalAmountCell = document.querySelector('.totalAmount');

    // Initialize total cells with the price for each row
    priceCells.forEach((priceCell, index) => {
        updateTotalForRow(index);
    });

    // Function to update the total for a specific row
    function updateTotalForRow(index) {
        const priceCell = priceCells[index];
        const totalCell = totalCells[index];

        const price = parseFloat(priceCell.innerText);
        if (!isNaN(price)) {
            totalCell.innerText = '¥' + price.toFixed(2);
        }
        calculateSubtotal();
        calculateTotalTaxable();
        calculateSaleTax();
        calculateTotalAmount();
    }

    // Function to calculate the subtotal
    function calculateSubtotal() {
        let subtotal = 0;
        totalCells.forEach(totalCell => {
            const total = parseFloat(totalCell.innerText.replace('¥', ''));
            if (!isNaN(total)) {
                subtotal += total;
            }
        });

        // Update the subtotal cell
        subtotalCell.innerText = '¥' + subtotal.toFixed(2);
    }

    // Function to calculate the total taxable
    function calculateTotalTaxable() {
        let totalTaxable = 0;
        totalCells.forEach((totalCell, index) => {
            const taxCell = taxCells[index];
            const total = parseFloat(totalCell.innerText.replace('¥', ''));
            const tax = parseFloat(taxCell.innerText);

            if (!isNaN(total) && !isNaN(tax) && tax > 0) {
                totalTaxable += total;
            }
        });

        // Update the totalTaxable cell
        totalTaxableCell.innerText = '¥' + totalTaxable.toFixed(2);
    }

    // Function to calculate the total sale tax
    function calculateSaleTax() {
        let saleTax = 0;
        taxCells.forEach(taxCell => {
            const tax = parseFloat(taxCell.innerText.replace('¥', ''));
            if (!isNaN(tax)) {
                saleTax += tax;
            }
        });

        // Update the saleTax cell
        saleTaxCell.innerText = '¥' + saleTax.toFixed(2);
    }

    // Function to calculate the total amount
    function calculateTotalAmount() {
        const subtotal = parseFloat(subtotalCell.innerText.replace('¥', ''));
        const saleTax = parseFloat(saleTaxCell.innerText.replace('¥', ''));

        if (!isNaN(subtotal) && !isNaN(saleTax)) {
            const totalAmount = subtotal + saleTax;
            totalAmountCell.innerText = '¥' + totalAmount.toFixed(2);
        }
    }

    // Add an input event listener for each price cell to update the total dynamically
    priceCells.forEach((priceCell, index) => {
        priceCell.addEventListener('input', function() {
            updateTotalForRow(index);
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const saveAndSubmitButton = document.getElementById('saveAndSubmitButton');
    const invoiceContent = document.querySelector('.content'); // Get the HTML content you want to send

    if (saveAndSubmitButton) {
        saveAndSubmitButton.addEventListener('click', function() {
            // Convert the HTML content to a string
            const htmlContent = invoiceContent.outerHTML;
            const labelElement = document.querySelector('label[for="clientDetailsContent"]');
            const clientName = labelElement.textContent;
            
            // Send the HTML content to the server
            fetch('/savePDF', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: htmlContent, clientName }),
            })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the server, if needed
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }
});




document.addEventListener("DOMContentLoaded", function () {
    const menuForm = document.getElementById("menuForm");

    if (menuForm) {
        menuForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        const table = document.getElementById("menutable");
        const rows = table.getElementsByTagName("tr");
        const tableData = [];
        
        for (let i = 1; i < rows.length; i++) { // Start at 1 to skip the header row
            const cells = rows[i].getElementsByTagName("td");
            const name = cells[1].textContent.trim();
            
            // Check if the 'name' is empty, and only add non-empty rows to tableData
            if (name !== '') {
                const rowData = {
                    name: name,
                    details: cells[2].textContent.trim(),
                    price: cells[3].textContent.trim(),
                    tax: cells[4].textContent.trim(),
                };
                tableData.push(rowData);
            }
        }
        
        // Send the data to the server using a fetch request
        fetch("/saveMenu", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tableData),
        })
            .then(response => {
                if (response.ok) {
                    // Data sent successfully
                    console.log("Data sent successfully");
                } else {
                    // Handle errors
                    console.error("Error sending data");
                }
            })
            .catch(error => {
                // Handle network errors
                console.error("Network error", error);
            });
        });
    }
});

$(document).ready(function() {
    $("#sendEmailButton").on("click", function() {
        var selectedTemplate = $("#templateSelect").val();
        var bodyMessage = $("#body").val();
        var attachment = $("#attachmentSelect").val();
        var clientAddress = "client@example.com"; // Replace with the actual client address

        var formData = {
            selectedTemplate: selectedTemplate,
            bodyMessage: bodyMessage,
            attachment: attachment,
            clientAddress: clientAddress,
        };
        
        $.ajax({
            type: "POST",
            url: "/sendEmail",
            data: formData,
            success: function(response) {
                // Handle the response if needed
                console.log(response);
            },
            error: function(error) {
                // Handle errors if the request fails
                console.error('Error:', error);
            }
        });
    });
});
