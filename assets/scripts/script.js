// ------------- Assignment Code -------------
let plannerDateTime;

// Using a 24 hour clock (0-23), define the default range for the planner
let plannerStartTime = 7;
let plannerEndTime = 18;

// ---------------- Functions ----------------
// Run on web page load
function init() {

    plannerDateTime = setInterval( function() {
        updateDateTime();
    }, 1000)

    renderPlanner();
}

// Add the current date/time information to the web page
function updateDateTime() {
    $("#currentDay").text(moment().format("MMMM Do YYYY, h:mm:ss a"));

    localStorage.setItem("dailyPersonalPlanner_currentHour", moment().format("H"));

    renderPlannerBackground();
}

// Render the planner on the screen
function renderPlanner() {
    // Build the planner
    for (let i = plannerStartTime; i < plannerEndTime; i++) {
        // Build each planner row
        let $plannerRowDiv = $("<div>");
        $plannerRowDiv.attr("id", `row${i}`);
        $plannerRowDiv.addClass("row");

        // Build the time column of the planner row
        let $plannerRowTimeDiv = $("<div>");
        $plannerRowTimeDiv.attr("id", `rowHour-${i}`);
        $plannerRowTimeDiv.addClass("col-sm-2 col-md-2 col-lg-1");
        $plannerRowTimeDiv.text(moment(`T${i}`, "hh").format("h A"));

        $plannerRowDiv.append($plannerRowTimeDiv);

        // Build the input column of the planner row
        let $plannerRowInputDiv = $("<input>");
        $plannerRowInputDiv.attr("id", `rowInput-${i}`);
        $plannerRowInputDiv.attr("type", "text");
        $plannerRowInputDiv.addClass("col-xs-10 col-sm-8 col-md-9 col-lg-10 textarea");

        $plannerRowDiv.append($plannerRowInputDiv);

        // Build the save button of the planner row
        let saveIcon = $("<i class='far fa-save fa-lg'></i>");
        let $plannerRowSaveDiv = $("<button>");
        $plannerRowSaveDiv.attr("id", `rowSave-${i}`);
        $plannerRowSaveDiv.addClass("col-xs-2 col-sm-2 col-md-1 col-lg-1 saveBtn");
        
        $plannerRowSaveDiv.append(saveIcon);

        $plannerRowDiv.append($plannerRowSaveDiv);

        // Append the row to the main container
        $(".container").append($plannerRowDiv);
    }

    // Get planner content
    renderPlannerContent();
}

// Render the background for each row in the planner
function renderPlannerBackground() {
    let currentHour = Number(localStorage.getItem("dailyPersonalPlanner_currentHour"));
    let plannerRows = document.querySelectorAll("input");

    // Rotate through each row in the planner and set the background color
    plannerRows.forEach(element => {
        let idHour = Number(element.id.substring(element.id.indexOf("-") + 1));

        if (idHour < currentHour) {
            element.style.background = "#d3d3d3";
        } else if (idHour === currentHour) {
            element.style.background = "#ff6961";
        } else {
            element.style.background = "#77dd77";
        }
    });
}

// Render on screen planner data from local storage
function renderPlannerContent() {
    // Get the list of planner items from local storage
    let plannerItems = JSON.parse(localStorage.getItem("dailyPersonalPlanner_plannerItems-" + moment().format("YYYY-MM-DD")));
    if (plannerItems === null) {
        plannerItems = [];
    }

    for (let i = 0; i < plannerItems.length; i++) {
        inputEl = document.getElementById(`rowInput-${plannerItems[i].itemHour}`);
        inputEl.value = plannerItems[i].itemInput;
    }

}

// Calls init to retrieve data and render it to the page on load
init();

// ------------- Event Listeners -------------
document.querySelector(".container").addEventListener("click", function(event) {
    if (event.target.matches("button") === true || event.target.parentNode.matches("button") === true) {
        const id = event.target.id || event.target.parentNode.id;
        // Get planner items from local storage
        let plannerItems = JSON.parse(localStorage.getItem("dailyPersonalPlanner_plannerItems-" + moment().format("YYYY-MM-DD")));
        if (plannerItems === null) {
            plannerItems = [];
        }

        // Set the new entry for the array
        inputEl = "rowInput-" + id.substring(id.indexOf("-") + 1);
        let itemHour = id.substring(id.indexOf("-") + 1);
        let itemInput = document.getElementById(inputEl).value;
        let newEntry = {
            "itemHour": itemHour,
            "itemInput": itemInput
        }

        // Check if an item already exists in the array and either add new or delete and add
        let validateItem = plannerItems.filter(item =>(item.itemHour === itemHour));
        let itemIndex = plannerItems.findIndex(item => item.itemHour === itemHour);
        if (validateItem.length === 0 && newEntry.itemInput.length > 0) {
            // Does not exist in array so add
            plannerItems.push(newEntry);
        } else if (newEntry.itemInput.length > 0 && itemIndex != -1) {
            // Does exist in the array so delete and add
            plannerItems.splice(itemIndex, 1);
            plannerItems.push(newEntry);
        } else if (itemIndex != -1){
            // Delete entry in the array
            plannerItems.splice(itemIndex, 1);
        }
        
        // Store changes back to local storage
        localStorage.setItem("dailyPersonalPlanner_plannerItems-" + moment().format("YYYY-MM-DD"), JSON.stringify(plannerItems));
    }
})

document.querySelector("#helpDialogOpen").addEventListener("click", function(event) {
    // Build the help dialog box
    let $helpDialogDiv = $("<div>");
    $helpDialogDiv.attr("id", "helpDialogBox");
    $helpDialogDiv.attr("title", "How to Use the App");

    // Build the help dialog overview
    let $helpOverviewP = $("<p>");
    $helpOverviewP.text("Below you will find a few details on how to use the app:");
    $helpDialogDiv.append($helpOverviewP);

    // Build the Add Content
    let $helpAddP = $("<p>");
    $helpAddP.html("<span class=\"helpTitle\">Add Content</span> - Type the details on the line and click the save button.");
    $helpDialogDiv.append($helpAddP);

    // Build the Change Content
    let $helpChangeP = $("<p>");
    $helpChangeP.html("<span class=\"helpTitle\">Change Content</span> - Update the details on the line and click the save button.");
    $helpDialogDiv.append($helpChangeP);

    // Build the Delete Content
    let $helpDeleteP = $("<p>");
    $helpDeleteP.html("<span class=\"helpTitle\">Delete Content</span> - Delete all the details on the line and click the save button.");
    $helpDialogDiv.append($helpDeleteP);

    // Append the row to the main container
    $(".container").append($helpDialogDiv);

    $("#helpDialogBox").dialog({
        modal: true,
        minWidth: 450
    });
})