// Get the elements from the HTML document
var inputText = document.getElementById("input-text");
var submitButton = document.getElementById("submit-button");
var inputForm = document.getElementById("input-form");
var cardContainer = document.getElementById("card-container");
var card = document.getElementById("card");
var resultContainer = document.getElementById("result-container");
var cardText = document.getElementById("card-text");
var leftButton = document.getElementById("left-button");
var rightButton = document.getElementById("right-button");
var resultsList = document.getElementById("results-list");
var resultsButton = document.getElementById("results-button");
var backButton = document.getElementById("back-button");
var backButton2 = document.getElementById("back-button-2");
var resetButton = document.getElementById("reset-button");

// A variable to store an array of objects that represent each line and its status (accepted or declined)
var lineObjects = [];

// A variable to store an index that indicates the current line being displayed on the card
var currentIndex = 0;

var touchstartX = 0;
var gestureStarted = false;
const touchDelta = 20;

// Split the text input into lines and store them in the array of lines
function splitInput() {
    var text = inputText.value;
    var lines = text.split("\n");

    for (var i = 0; i < lines.length; i++) {
        var trimmedLine = lines[i].trim();

        if (trimmedLine.length > 0) {
            var lineObject = {
                text: trimmedLine,
                status: null
            };
            lineObjects.push(lineObject);
        }
    }

}

// Show the card container
function showCard() {
    inputForm.style.display = "none";
    resultContainer.style.display = "none";
    cardContainer.style.display = "block";
}

// Show the input form
function showForm() {
    inputForm.style.display = "block";
    cardContainer.style.display = "none";
    resultContainer.style.display = "none";
}

// Add an event listener to the submit button that will trigger the functions when clicked
submitButton.addEventListener("click", function (event) {
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

// Display the current line on the card
function displayLine() {
    var currentLineObject = lineObjects[currentIndex];
    cardText.textContent = currentLineObject.text;
}

// Update the status of the current line based on the user's swipe action
function updateStatus(swipe) {
    var currentLineObject = lineObjects[currentIndex];
    if (swipe === "left") {
        currentLineObject.status = "accepted";
    }
    if (swipe === "right") {
        currentLineObject.status = "declined";
    }
    saveProgress();
}

// Move to the next line or show result if there are no more lines
function nextLine() {
    currentIndex++;
    if (currentIndex < lineObjects.length) {
        displayLine();
    } else {
        displayResults();
    }
    saveProgress();
}

// Move to the previous line
function previousLine() {
    currentIndex--;
    if (currentIndex >= 0) {
        displayLine();
    } else {
        currentIndex = 0;
    }
    saveProgress();
}


// Generate and display the list of accepted lines
function displayResults() {
    resultsList.innerHTML = "";

    for (var i = 0; i < lineObjects.length; i++) {
        var lineObject = lineObjects[i];
        if (lineObject.status === "accepted") {
            var listItem = document.createElement("li");
            listItem.textContent = lineObject.text;
            listItem.dataset.index = i
            resultsList.appendChild(listItem);
        }
    }

    resultContainer.style.display = "block";
    cardContainer.style.display = "none";
}

resultsList.addEventListener("click", function(event) {
    if (event.target.dataset.index !== undefined) {
        currentIndex = event.target.dataset.index;
        showCard();
        displayLine();
    }
});

// Add event listeners to both buttons that will trigger their corresponding functions when clicked
leftButton.addEventListener("click", function () {
    updateStatus("left");
    nextLine();
});

rightButton.addEventListener("click", function () {
    updateStatus("right");
    nextLine();
});

// Add an event listener to the results button that will trigger the displayResults function when clicked
resultsButton.addEventListener("click", function () {
    displayResults();
});
// Add an event listener to the back button that will trigger the previousLine function when clicked
backButton.addEventListener("click", function () {
    previousLine();
});

// Save the lineObjects array and the currentIndex to the local storage
function saveProgress() {
    var lineObjectsJSON = JSON.stringify(lineObjects);

    localStorage.setItem("lineObjects", lineObjectsJSON);
    localStorage.setItem("currentIndex", currentIndex);
}

// Load the lineObjects array and the currentIndex from the local storage
function loadProgress() {
    var lineObjectsJSON = localStorage.getItem("lineObjects");

    if (lineObjectsJSON) {
        lineObjects = JSON.parse(lineObjectsJSON);
    }

    var currentIndexString = localStorage.getItem("currentIndex");

    if (currentIndexString) {
        currentIndex = parseInt(currentIndexString);
    }

    if (lineObjects.length == 0) {
        showForm();
    } else {
        if (currentIndex === undefined) {
            currentIndex = lineObjects.length - 1;
        }
        if (currentIndex < lineObjects.length) {
            showCard();
            displayLine();
        } else {
            displayResults();
        }
    }
}

// Reset all variables and elements to their initial state
function resetProgress() {
    localStorage.clear();

    lineObjects = [];
    currentIndex = 0;

    saveProgress();
    showForm();
}

resetButton.addEventListener("click", function () {
    resetProgress();
});
backButton2.addEventListener("click", function () {
    showCard();
});

function swipeStart(event) {
    touchstartX = getTouchX(event);
    gestureStarted = true;
}

function getTouchX(event) {
    if (event.screenX === undefined) {
        return event.changedTouches[0].screenX;
    } else {
        return event.screenX;
    }
}

function swipeEnd(event) {
    if (!gestureStarted) {
        return
    }

    var delta = getTouchX(event) - touchstartX;

    gestureStarted = false;

    if (delta < -touchDelta) {
        updateSwipeStatus("left");
    } else if (delta > touchDelta) {
        updateSwipeStatus("right");
    }
}


function swipeFollow(event) {
    if (!gestureStarted) {
        return
    }

    event.preventDefault();
    var delta = getTouchX(event) - touchstartX;
    card.style.transform = "translateX(" + delta + "px)";
}

function updateSwipeStatus(status) {
    updateStatus(status);
    var animation = card.animate(
        [
            { transform: "translateY(0) " + card.style.transform },
            { transform: "translateY(300px) " + card.style.transform, opacity: 0 },
        ], 500
    );

    animation.onfinish = (event) => {
        animation.cancel()
        nextLine();
        card.style.transform = "";
        card.style.opacity = 1;
    };
}

card.addEventListener('touchstart', swipeStart);
card.addEventListener('mousedown', swipeStart);
card.addEventListener('touchend', swipeEnd);
card.addEventListener('mouseup', swipeEnd);
card.addEventListener('mouseleave', swipeEnd);
card.addEventListener('touchmove', swipeFollow);
card.addEventListener('mousemove', swipeFollow);

// Call the function to load the state and show related widgets
loadProgress();
