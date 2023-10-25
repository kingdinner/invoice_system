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
        if (link) {
            link.addEventListener('click', () => {
                sidebarLinks.forEach(link => link.classList.remove('active'));
                link.classList.add('active');
            });
        }
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
    const unitCells = document.querySelectorAll('.unit');
    const quantityCells = document.querySelectorAll('.quantity');
    const taxCells = document.querySelectorAll('.tax');
    const subtotalCell = document.querySelector('.subtotal');
    const totalTaxableCell = document.querySelector('.totalTaxable');
    const saleTaxCell = document.querySelector('.saleTax');
    const totalAmountCell = document.querySelector('.totalAmount');
    const displayTotalCell = document.querySelector('.displayTotal');

    // Initialize total cells with the price for each row
    priceCells.forEach((priceCell, index) => {
        updateTotalForRow(index);
    });

    // Add an input event listener for each price cell to update the total dynamically
    unitCells.forEach((unitCell, index) => {
        unitCell.addEventListener('input', function() {
            updateTotalForRow(index);
        });
    });

    priceCells.forEach((priceCell, index) => {
        priceCell.addEventListener('input', function() {
            updateTotalForRow(index);
        });
    });
    taxCells.forEach((taxCell, index) => {
        taxCell.addEventListener('input', function() {
            calculateTotalTaxable();
            calculateSaleTax();
            calculateTotalAmount();
        });
    });

    // Function to update the total for a specific row
    function updateTotalForRow(index) {
        const unitCell = unitCells[index];
        const priceCell = priceCells[index];
        const totalCell = totalCells[index];

        const unit = parseFloat(unitCell.innerText);
        const price = parseFloat(priceCell.innerText);

        if (!isNaN(unit) && !isNaN(price)) {
            const total = unit * price;
            totalCell.innerText = '¥' + total.toFixed(2);
        } else {
            totalCell.innerText = ''; // Clear the total cell if inputs are invalid
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
        taxCells.forEach((taxCell, index) => {
            const totalCell = totalCells[index];
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
            displayTotalCell.innerText = totalAmount.toFixed(2);
        }
    }
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
        var selectedTemplate = $("#messageType").val();
        var bodyMessage = $("#body").val();
        var attachment = $("#attachmentSelect").val();
        var title = $("#titleInput").val();
        var clientAddress = "client@example.com"; // Replace with the actual client address
        $("#loadingIndicator").show();
        var formData = {
            selectedTemplate: selectedTemplate,
            bodyMessage: bodyMessage,
            attachment: attachment,
            clientAddress: clientAddress,
            title
        };
        $.ajax({
            type: "POST",
            url: "/sendEmail",
            data: formData,
            success: function(response) {
                // Handle the response if needed
                $("#loadingIndicator").hide();

                console.log(response);
            },
            error: function(error) {
                // Handle errors if the request fails
                $("#loadingIndicator").hide();
                console.error('Error:', error);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const bankingDetailsContainer = document.getElementById('bankingDetailsContainer');
    const addFormButton = document.getElementById('addForm');

    let currentIndex = 0;
    if (addFormButton) {
        addFormButton.addEventListener('click', function () {
            const clonedForm = document.querySelector('.banking-form').cloneNode(true);

            // Increment the index and update IDs
            currentIndex++;
            clonedForm.querySelectorAll('input').forEach(input => {
                const id = input.getAttribute('id');
                if (id) {
                    input.setAttribute('id', id + currentIndex);
                    input.value = ''; // Clear input values in the cloned form
                }
            });

            bankingDetailsContainer.appendChild(clonedForm);
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {

    const saveForm = document.getElementById('addForm');
    if (saveForm) {
        saveForm.addEventListener('click', function () {
            event.preventDefault();
            // Collect form data
            const formData = {
                companyName: document.getElementById("companyName").value,
                address: document.getElementById("address").value,
                emailAddress: document.getElementById("emailAddress").value,
                bankingDetails: []
            };

            // Determine the number of banking details forms
            const bankingForms = document.querySelectorAll(".banking-form");

            const bankingDetails = [];

            bankingForms.forEach(function (form) {
                const bankingDetail = {
                    bankName: form.querySelector('input[id^="bankName"]').value || '',
                    companyName: form.querySelector('input[id^="companyName"]').value || '',
                    branchNo: form.querySelector('input[id^="branchNo"]').value || '',
                    branchName: form.querySelector('input[id^="branchName"]').value || '',
                    type: form.querySelector('input[id^="type"]').value || '',
                    accountNo: form.querySelector('input[id^="accountNo"]').value || ''
                };
            
                bankingDetails.push(bankingDetail);
            });
            
            formData.bankingDetails = bankingDetails;

            formData.taxRegisteredNumber = document.getElementById("taxRegisteredNumber").value;
            // Send the form data to the server using a POST request
            fetch('/update/companyInformation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                // Handle the response (e.g., display success or error message)
                console.log(response);
            })
            .catch(error => {
                // Handle errors
                console.error(error);
            });
        })
    }
});

$(document).ready(function() {
    $(".edit-button").on("click", function() {
        var index = $(this).data("index");
        $("#labelText" + index).hide();
        $("#editInput" + index).show();
        $("#editButton" + index).hide();
        $("#saveButton" + index).show();
    });

    $(".save-button").on("click", function() {
        var index = $(this).data("index");
        var editedText = $("#editInput" + index).val();
        $("#labelText" + index).text(editedText);
        $("#editInput" + index).hide();
        $("#labelText" + index).show();
        $("#editButton" + index).show();
        $("#saveButton" + index).hide();

        $.ajax({
            type: "POST",
            url: "/updateEmailTemplate",
            data: {
                index: index,
                editedText: editedText
            },
            success: function(response) {
                // Handle the response if needed
            },
            error: function(error) {
                // Handle errors if the request fails
            }
        });
    });
});
function decodeHTMLEntities(str) {
    return str.replace(/&#(\d+);/g, function(match, dec) {
      return String.fromCharCode(dec);
    });
}
  
const selectionBankDetail = document.getElementById('selectionBankDetail');
const bankName = document.getElementById('bankName');
const bankNameDetails = document.getElementById('bankNameDetails');
const branchNo = document.getElementById('branchNo');
const branchName = document.getElementById('branchName');
const type = document.getElementById('type');
const accountNo = document.getElementById('accountNo');

const decodedJSON = JSON.parse(decodeHTMLEntities(bankDetails));
console.log(decodedJSON)
selectionBankDetail.addEventListener('change', function() {
    const selectedBank = selectionBankDetail.value;

    const matchingDetails = decodedJSON.filter(detail => detail.companyName === selectedBank);
    console.log(matchingDetails[0])
    console.log(matchingDetails[0].bankName)
    if (selectedBank in matchingDetails) {
        bankName.textContent = matchingDetails.bankName;
        bankNameDetails.textContent = matchingDetails.bankNameDetails;
        branchNo.textContent = matchingDetails.branchNo;
        branchName.textContent = matchingDetails.branchName;
        type.textContent = matchingDetails.type;
        accountNo.textContent = matchingDetails.accountNo;
    } else {
        bankName.textContent = '';
        bankNameDetails.textContent = '';
        branchNo.textContent = '';
        branchName.textContent = '';
        type.textContent = '';
        accountNo.textContent = '';
    }
  

});