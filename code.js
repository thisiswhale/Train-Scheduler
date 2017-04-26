// Initialize Firebase
var config = {
    apiKey: "AIzaSyCCzXiPkssAue-rIOrjBySG9VqOGjwv4Dk",
    authDomain: "train-scheduler-51d5a.firebaseapp.com",
    databaseURL: "https://train-scheduler-51d5a.firebaseio.com",
    projectId: "train-scheduler-51d5a",
    storageBucket: "train-scheduler-51d5a.appspot.com",
    messagingSenderId: "168560126909"
};
firebase.initializeApp(config);



//Create variable to reference the database
var database = firebase.database();


//initialize real time
clock();
function clock(){
    var liveClock = moment().format('MMMM Do YYYY, h:mm:ss a');
    $("#current-time").html(liveClock);
    setTimeout(clock,500);
    realTime();
}

$("#submitTrain").on("click", function(event) {

    event.preventDefault();

    //grabs inbut and assigns variables after button click
    var name = $("#inputName").val().trim();
    var destination = $("#inputDestination").val().trim();
    //Format hh:mm - military time, need to convert military time, ex: first train at 06:20
    var firstTrain = $("#inputFirstTrain").val().trim();
    var frequency = $("#inputFrequency").val().trim();

    //calls database and stores them
    database.ref().push({
        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    });
});

//adds every row from firebase
database.ref().on("child_added", function(childSnapshot) {

    var train = childSnapshot.val();

    //calculate the thing
    var time = moment(train.firstTrain, "hh:mm").subtract(7,"days");
    //gives minutes between now and var time
    var difference = moment().diff(moment(time), "minutes");
    //calculate the remainder of minutes in how frequent train arrive 
    var remaining = difference % train.frequency;
    //calculate the how many minutes left
    var minutesAway = train.frequency - remaining;
    console.log("minutesAway: " +minutesAway);
    //adds minutesAway to current time for next arrival
    var nextArrival = moment().add(minutesAway,"minutes").format("hh:mm");
    console.log(nextArrival);


    //Create new Row
    var newRow = $("<tr>");
    newRow.append("<td>" + train.name + "</td>");
    newRow.append("<td>" + train.destination + "</td>");
    newRow.append("<td>" + train.frequency + "</td>");
    newRow.append("<td>" + nextArrival + "</td>");
    newRow.append("<td>" + minutesAway + "</td>");

    $("tbody").append(newRow);

    // Create Error Handling
}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

function realTime(){
$("tbody").empty();
database.ref().on("child_added", function(childSnapshot) {

    var train = childSnapshot.val();

    //calculate the thing
    var time = moment(train.firstTrain, "hh:mm").subtract(7,"days");
    //gives minutes between now and var time
    var difference = moment().diff(moment(time), "minutes");
    //calculate the remainder of minutes in how frequent train arrive 
    var remaining = difference % train.frequency;
    //calculate the how many minutes left
    var minutesAway = train.frequency - remaining;

    //adds minutesAway to current time for next arrival
    var nextArrival = moment().add(minutesAway,"minutes").format("hh:mm");


    //Create new Row
    var newRow = $("<tr>");
    newRow.append("<td>" + train.name + "</td>");
    newRow.append("<td>" + train.destination + "</td>");
    newRow.append("<td>" + train.frequency + "</td>");
    newRow.append("<td>" + nextArrival + "</td>");
    newRow.append("<td>" + minutesAway + "</td>");

    $("tbody").append(newRow);

    // Create Error Handling
}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

    setTimeout(realTime, 1000*10);
}
