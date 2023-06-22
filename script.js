// Get the elements from the HTML document
var inputText = document.getElementById("input-text");
var submitButton = document.getElementById("submit-button");
var inputForm = document.getElementById("input-form");
var cardContainer = document.getElementById("card-container");
var resultContainer = document.getElementById("result-container");
var cardText = document.getElementById("card-text");
var leftButton = document.getElementById("left-button");
var rightButton = document.getElementById("right-button");
var resultsList = document.getElementById("results-list");
var resultContainer = document.getElementById("result-container");
var resultsButton = document.getElementById("results-button");
var backButton = document.getElementById("back-button");
var backButton2 = document.getElementById("back-button-2");
var resetButton = document.getElementById("reset-button");

// Create a variable to store an array of lines from the text input
var lines = [];

// Create a variable to store an array of objects that represent each line and its status (accepted or declined)
var lineObjects = [];

// Create a variable to store an index that indicates the current line being displayed on the card
var currentIndex = 0;

// Create a function that will split the text input into lines and store them in the array of lines
function splitInput() {
    // Get the value of the text input
    var text = inputText.value;
    // Split the text by newline characters and assign it to the lines array
    lines = text.split("\n");
    // Loop through the lines array
    for (var i = 0; i < lines.length; i++) {
        // Create an object with two properties: text and status
        var lineObject = {
            text: lines[i], // Assign the text from the lines array
            status: null // Assign null as the default status
        };
        // Push the object to the lineObjects array
        lineObjects.push(lineObject);
    }

}

// Create a function that will hide the input form and show the card container
function showCard() {
    // Set the display style of the other containers to none
    inputForm.style.display = "none";
    resultContainer.style.display = "none";
    // Set the display style of the card container to block
    cardContainer.style.display = "block";
}

// Create a function that will show the input form and hide the card container
function showForm() {
    // Set the display style of the input form to block
    inputForm.style.display = "block";
    // Set the display style of the other containers to none
    cardContainer.style.display = "none";
    resultContainer.style.display = "none";
}

// Add an event listener to the submit button that will trigger the functions when clicked
submitButton.addEventListener("click", function(event) {
    // Prevent the default behavior of the button (submitting the form)
    event.preventDefault();
    // Call the function to split the text input into lines
    splitInput();
    // Call the function to hide the input form and show the card container
    showCard();
    // Call the function to display the first line on startup
    displayLine();
    saveProgress();
});

// Create a function that will display the current line on the card
function displayLine() {
    // Get the current line object from the lineObjects array
    var currentLineObject = lineObjects[currentIndex];
    // Get the text from the current line object
    var currentText = currentLineObject.text;
    // Set the text content of the cardText element to the current text
    cardText.textContent = currentText;
}

// Create a function that will update the status of the current line based on the user's swipe action
function updateStatus(swipe) {
    // Get the current line object from the lineObjects array
    var currentLineObject = lineObjects[currentIndex];
    // If the swipe is left, set the status to accepted
    if (swipe === "left") {
        currentLineObject.status = "accepted";
    }
    // If the swipe is right, set the status to declined
    if (swipe === "right") {
        currentLineObject.status = "declined";
    }
    saveProgress();
}

// Create a function that will move to the next line or show a message if there are no more lines
function nextLine() {
    // Increment the currentIndex by one
    currentIndex++;
    // If the currentIndex is less than the length of the lineObjects array, display the next line
    if (currentIndex < lineObjects.length) {
        displayLine();
    }
    // If the currentIndex is equal to or greater than the length of the lineObjects array, show a message that there are no more lines
    else {
        displayResults();
    }
    saveProgress();
}

function previousLine() {
    // Decrement the currentIndex by one
    currentIndex--;
    // If the currentIndex is greater than or equal to zero, display the previous line
    if (currentIndex >= 0) {
        displayLine();
    }
    // If the currentIndex is less than zero, show a message that there are no previous lines and reset the currentIndex to zero
    else {
        currentIndex = 0;
    }
    saveProgress();
}


// Create a function that will generate and display the list of accepted lines
function displayResults() {
    // Clear the previous content of the results list
    resultsList.innerHTML = "";
    // Loop through the lineObjects array
    for (var i = 0; i < lineObjects.length; i++) {
        // Get the current line object from the array
        var lineObject = lineObjects[i];
        // If the status of the line object is accepted, create a list item element and append it to the results list
        if (lineObject.status === "accepted") {
            // Create a list item element
            var listItem = document.createElement("li");
            // Set the text content of the list item to the text of the line object
            listItem.textContent = lineObject.text;
            // Append the list item to the results list
            resultsList.appendChild(listItem);
        }
    }
    // Set the display style of the result container to block
    resultContainer.style.display = "block";
    cardContainer.style.display = "none";
}

// Add event listeners to both buttons that will trigger their corresponding functions when clicked
leftButton.addEventListener("click", function() {
    // Call the function to update the status of the current line with left swipe
    updateStatus("left");
    // Call the function to move to the next line
    nextLine();
});

rightButton.addEventListener("click", function() {
    // Call the function to update the status of the current line with right swipe
    updateStatus("right");
    // Call the function to move to the next line
    nextLine();
});
// Add an event listener to the results button that will trigger the displayResults function when clicked
resultsButton.addEventListener("click", function() {
    // Call the displayResults function
    displayResults();
});
// Add an event listener to the back button that will trigger the previousLine function when clicked
backButton.addEventListener("click", function() {
    // Call the previousLine function
    previousLine();
});

function saveProgress() {
    // Convert the lineObjects array to a JSON string
    var lineObjectsJSON = JSON.stringify(lineObjects);
    // Set the lineObjectsJSON as a value for the key "lineObjects" in the local storage
    localStorage.setItem("lineObjects", lineObjectsJSON);
    // Set the currentIndex as a value for the key "currentIndex" in the local storage
    localStorage.setItem("currentIndex", currentIndex);
}

// Create a function that will load the lineObjects array and the currentIndex from the local storage
function loadProgress() {
    // Get the value for the key "lineObjects" from the local storage
    var lineObjectsJSON = localStorage.getItem("lineObjects");
    // If the value is not null, parse it to an array and assign it to the lineObjects variable
    if (lineObjectsJSON) {
        lineObjects = JSON.parse(lineObjectsJSON);
    }

    var currentIndexString = localStorage.getItem("currentIndex");
    // If the value is not null, parse it to a number and assign it to the currentIndex variable
    if (currentIndexString) {
        currentIndex = parseInt(currentIndexString);
    }

    if (lineObjects.length == 0) {
        showForm();
    } else {
        showCard();
        displayLine();
    }
}

// Create a function that will reset all variables and elements to their initial state
function resetProgress() {
    // Clear the local storage
    localStorage.clear();
    // Reset the lineObjects array to an empty array
    lineObjects = [];
    // Reset the currentIndex to zero
    currentIndex = 0;
    lines = [];
    saveProgress();
    showForm();
}

resetButton.addEventListener("click", function() {
    // Call the resetProgress function
    resetProgress();
});

backButton2.addEventListener("click", function() {
    showCard();
});

// Call the function to show the input form and hide the card container on startup
loadProgress();
