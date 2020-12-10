/*
Credits
Sorting JSON Array:
https://medium.com/@asadise/sorting-a-json-array-according-one-property-in-javascript-18b1d22cd9e9

For..of loops:
https://stackoverflow.com/questions/1078118/how-do-i-iterate-over-a-json-structure

Appending rows to table:
https://stackoverflow.com/questions/6473111/add-delete-table-rows-dynamically-using-javascript

Parsing Chrome Storage JSON:
https://stackoverflow.com/questions/27879835/adding-new-objects-to-chrome-local-storage
-Marco Bonelli

Get all keys from Chrome Storage:
https://stackoverflow.com/questions/18150774/get-all-keys-from-chrome-storage

Deleting rows from a table:
https://www.viralpatel.net/dynamically-add-remove-rows-in-html-table-using-javascript/#:~:text=First%20check%20the%20user%20interface,the%20row%20will%20be%20removed.

Detect if checkbox is checked:
https://www.w3schools.com/jsref/prop_checkbox_checked.asp
var cb = x.rows.item(2).lastChild.previousSibling.firstChild;


Google Calendar API Reference:
https://developers.google.com/calendar/quickstart/js



  Set up Google Calendar API

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

//  On load, called to load the auth2 library and API client library.
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

// Initializes the API client library and sets up sign-in state
// listeners.
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    appendPre(JSON.stringify(error, null, 2));
  });
}


function appendPre(message) {
  var pre = document.getElementById('todayTABLE');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

// Print the summary and start datetime/date of the next ten events in
// the authorized user's calendar. If no events are found an
// appropriate message is printed.

function listUpcomingEvents() {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items;
    appendPre('Upcoming events:');

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        appendPre(event.summary + ' (' + when + ')')
      }
    } else {
      appendPre('No upcoming events found.');
    }
  });
}

function calendarEvents(){
    handleClientLoad();
    listUpcomingEvents();  
}


// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";



function handleClientLoad() {
  gapi.client.setApiKey(API_KEY);
  window.setTimeout(checkAuth,3);
  checkAuth();
}

function checkAuth() {
  gapi.auth.authorize({client_id: CLIENT_ID, scope: SCOPES, immediate: true},
      handleAuthResult);
}

function handleAuthResult(authResult) {
  var authorizeButton = document.getElementById('authorize-button');
  if (authResult) {
    authorizeButton.style.visibility = 'hidden';
    makeApiCall();
  } else {
    authorizeButton.style.visibility = '';
    authorizeButton.onclick = handleAuthClick;
   }
}

  function handleAuthClick(event) {
    gapi.auth.authorize(
      {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
      handleAuthResult);
  return false;
}

function makeApiCall() {
  gapi.client.load('calendar', 'v3', function() {
    var request = gapi.client.calendar.events.list({
      'calendarId': 'primary'
    });
          
    request.execute(function(resp) {
      for (var i = 0; i < resp.items.length; i++) {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(resp.items[i].summary));
        document.getElementById('events').appendChild(li);
      }
    });
  });
}


function gapiLogin(){
    handleClientLoad();
    handleAuthResult();
}

function calendarEvents(){
    execute();
}


///////////////////////////////////////////////////////////////////////////

/*******************************************
Main Functions
*******************************************/

function moveRowToTable(rownum,fromtable,totable){
    //console.log("DEBUG: Object is: " + rownum);
    var fromtab = document.getElementById(fromtable);    
    var totab = document.getElementById(totable);
    document.getElementById(totable).append(fromtab.rows[rownum]);
}

function getSelectedTasks(table,columnTypeId){
    //var selectedTasks = [];
    var fromRows = [];
    var tab = document.getElementById(table);
    var qselector = "#" + columnTypeId;
    for(r = 2; r < tab.rows.length; r++){
        //console.log("DEBUG: index " + r + ", query selector is: " + qselector);
        var checked = tab.rows.item(r).querySelector(qselector).checked;
        if(checked){
            fromRows.push(r);
        }
    }
    //.checked = true;
    return fromRows;
}


function reactivate(){
    var tasks = getSelectedTasks("completedtasksTABLE","checkboxCompleteCHECKBOX");
    var movedTasks = 0;
    var activeTable = document.getElementById("taskdataTABLE");

    for(i = 0; i < tasks.length; i++){
        moveRowToTable(tasks[i]-movedTasks,"completedtasksTABLE","taskdataTABLE");
        movedTasks += 1;
        activeTable.rows.item(activeTable.rows.length-1).querySelector("#checkboxCompleteCHECKBOX").checked = false;
    }
    /*
    for(i = 0; i < tasks.length; i++){
        // since we are copying the task, we need to clear the checkbox out
        //   because we are appending, the item we're clearing should always be the last row
        activeTable.rows.item(activeTable.rows.length-1-i).querySelector("#checkboxCompleteCHECKBOX").checked = false;
    }
    */

    //// get all JSON info for syncing to Chrome storage
    var todaytasks = getTasksFromTable("todayTABLE");
    var activetasks = getTasksFromTable("taskdataTABLE");
    var completedtasks = getTasksFromTable("completedtasksTABLE");
    var combinedtasks = todaytasks.concat(activetasks,completedtasks);
    
    var combinedjson = convertArrayToJSON(combinedtasks);

    console.log("Saving JSON: " + JSON.stringify(combinedjson));

    syncChrome(combinedjson);
}


function moveBack(){
    var tasks = getSelectedTasks("todayTABLE","todayCHECKBOX");
    var movedTasks = 0;
    var activeTable = document.getElementById("taskdataTABLE");

    for(i = 0; i < tasks.length; i++){
        moveRowToTable(tasks[i]-movedTasks,"todayTABLE","taskdataTABLE");
        movedTasks += 1;
        activeTable.rows.item(activeTable.rows.length-1).querySelector("#todayCHECKBOX").checked = false;
    }

    //// get all JSON info for syncing to Chrome storage
    var todaytasks = getTasksFromTable("todayTABLE");
    var activetasks = getTasksFromTable("taskdataTABLE");
    var completedtasks = getTasksFromTable("completedtasksTABLE");
    var combinedtasks = todaytasks.concat(activetasks,completedtasks);
    
    var combinedjson = convertArrayToJSON(combinedtasks);

    console.log("Saving JSON: " + JSON.stringify(combinedjson));

    syncChrome(combinedjson);
}

function moveToToday(){
    //// get tasks from Today column of main Active Tasks table, then move to Today table
    var tasks = getSelectedTasks("taskdataTABLE","todayCHECKBOX");
    var movedTasks = 0;
    var todaytable = document.getElementById("todayTABLE");
    for(i = 0; i < tasks.length; i++){
        moveRowToTable(tasks[i]-movedTasks,"taskdataTABLE","todayTABLE");
        movedTasks += 1;
    }

    //// get all JSON info for syncing to Chrome storage
    var todaytasks = getTasksFromTable("todayTABLE");
    var activetasks = getTasksFromTable("taskdataTABLE");
    var completedtasks = getTasksFromTable("completedtasksTABLE");
    var combinedtasks = todaytasks.concat(activetasks,completedtasks);
    
    var combinedjson = convertArrayToJSON(combinedtasks);

    console.log("Saving JSON: " + JSON.stringify(combinedjson));

    syncChrome(combinedjson);

    for(i = 0; i < tasks.length; i++){
        // since we are copying the task, we need to clear the checkbox out
        //   because we are appending, the item we're clearing should always be the last row
        todaytable.rows.item(todaytable.rows.length-1-i).querySelector("#todayCHECKBOX").checked = false;
    }    
}



function getTasksFromTable(tbl){
    console.log("Running getTasksFromTable/////////");
    var rows = document.getElementById(tbl).children;
    var taskarray = [];

    // need to start with number of rows - skipping header, tbody and button row (start at 3)
    for(i = 3; i < rows.length; i++){
        rowarray = [];
        console.log("Index is: " + i);
        //rowarray.push("row" + i);
        for(j = 0; j < rows[0].firstElementChild.cells.length; j++){
            console.log("Cur row is: " + i + ", and cur col is: " + j);
            var cell = rows[i].cells[j];
            // normal cells do not have children
            if(cell.children.length < 1){
                console.log("Current cell info is: " + cell.id);
                console.log("Current value is: " + cell.innerHTML);
                rowarray.push(cell.id,cell.innerHTML);
            }
            // last 3 elements are checkboxes nested in td
            else{
                if(cell.id === "todayTD"){
                    var today = rows[i].querySelector("#todayCHECKBOX").checked;
                    console.log("today is: " + today);
                    rowarray.push("today",today);
                }

                else if(cell.id === "checkboxCompleteTD"){
                    // have to run a check because reactivating tasks requires the inverse
                    if(tbl === "completedtasksTABLE"){
                        rowarray.push("completed",true);
                    } else {
                        var cmpl = rows[i].querySelector("#checkboxCompleteCHECKBOX").checked;
                        console.log("completed is: " + cmpl);
                        rowarray.push("completed",cmpl);
                    }
                } 

                else if (cell.id === "checkboxDeleteTD"){
                    var del = rows[i].querySelector("#checkboxDeleteCHECKBOX").checked;
                    console.log("delete is: " + del);
                    rowarray.push("delete",del);
                }
            }

            if(j == (rows[0].firstElementChild.cells.length-1)){
                console.log(rowarray);
                taskarray.push(rowarray);
            }
        }
    }
    return taskarray;
}

function convertArrayToJSON(obj){
    // use taskarray to populate JSON object
    // *** Use this loop to move items with complete checked *** //
    jsonitems = { "data": [{}]};

    for(k = 0; k < obj.length; k++){
        if(typeof obj[k][1] !== "undefined"){
            var jsObj = {
                task : obj[k][1], // task info
                duedate : obj[k][3], // due date info
                priority : obj[k][5], // priority info
                dependencies : obj[k][7], // dependencies info
                today : obj[k][9], // today info
                completed : obj[k][11], // complete checkbox info
                delete : obj[k][13] // delete checkbox info
            }
            jsonitems.data.push(jsObj);
        }
        else {
            // skipping items that are undefined because deleting them just changes their data to undefined
            //   if we just skip these, then Chrome will sync and on next load they will be gone
        }
    }
    return jsonitems;
}

function addTaskToTable(task,due,pri,dep,cmpl,tbl){
    var x = document.getElementById(tbl);

    if(x.rows.length > 0){
        //create a row here
        var new_row = x.rows[0].cloneNode(true); //clone initial row
        
        // add TD elements to row
        new_row.cells[0].innerHTML = task;
        new_row.cells[0].id = "task";
        new_row.cells[0].className = "task";
        new_row.cells[1].innerHTML = due;
        new_row.cells[1].id = "due";
        new_row.cells[1].className = "due";
        new_row.cells[2].innerHTML = pri;
        new_row.cells[2].id = "pri";
        new_row.cells[2].className = "pri";
        new_row.cells[3].innerHTML = dep;
        new_row.cells[3].id = "dep";
        new_row.cells[3].className = "dep";

        // add checkbox elements to row
        new_row.cells[4].id = "todayTD";
        new_row.cells[4].className = "today";
        new_row.cells[5].id = "checkboxCompleteTD";
        new_row.cells[5].className = "checkboxComplete";
        new_row.cells[6].id = "checkboxDeleteTD";
        new_row.cells[6].className = "checkboxDelete";

        today = document.createElement("input");
        today.type = "checkbox";
        today.id = "todayCHECKBOX";
        today.className = "todayCHECKBOX";
        new_row.cells[4].appendChild(today);

        // create and add checkboxes, then attach to TD elements
        checkBoxComplete = document.createElement("input");
        checkBoxComplete.type = "checkbox";
        checkBoxComplete.id = "checkboxCompleteCHECKBOX";
        checkBoxComplete.className = "checkboxCompleteCHECKBOX";
        new_row.cells[5].appendChild(checkBoxComplete);

        checkBoxDelete = document.createElement("input");
        checkBoxDelete.type = "checkbox";
        checkBoxDelete.id = "checkboxDeleteCHECKBOX";
        checkBoxDelete.className = "checkboxDeleteCHECKBOX";
        new_row.cells[6].appendChild(checkBoxDelete);
        
        x.appendChild(new_row);
        // we need to delete the cloned header checkboxes, except for the first one in the row
        //var headercbs = document.getElementsByClassName("headerCHECKBOX"); // NOTE this doesn't work every time so I used the jQuery method
        var todayheadercbs = $('table#todayTABLE .headerCHECKBOX');
        for(i = 3; i < todayheadercbs.length; i++){
            todayheadercbs[i].remove();
        }
        var topheadercbs = $('table#taskdataTABLE .headerCHECKBOX');
        for(i = 3; i < topheadercbs.length; i++){
            topheadercbs[i].remove();
        }
        var bottomheadercbs = $('table#completedtasksTABLE .headerCHECKBOX');
        for(i = 2; i < bottomheadercbs.length; i++){
            bottomheadercbs[i].remove();
        }
    }
}

function deleteRow(tableID) {
    try {
        var table = document.getElementById(tableID);
        var rowCount = table.rows.length;

        for(var i=1; i<rowCount; i++) {
            var row = table.rows[i];
            table.deleteRow(i);
            rowCount--;
            i--;
        }
    } catch(e) {
        alert(e);
    }
}

function sortJSON(property) {
   return function(a,b){  
      if(a[property] > b[property])  
         return 1;  
      else if(a[property] < b[property])  
         return -1;  
  
      return 0;  
   }
}

function getChromeStorageAndPopulateTable() {
    chrome.storage.sync.get(null, function(items) {
        items.data.sort(sortJSON("priority"));
        let i = 0;
        for (var item of items.data ){
            // need to ensure items are not undefined to avoid populating deleted data
            if(typeof item["task"] !== "undefined"){
                if(item["today"] === true){
                    addTaskToTable(item["task"],item["duedate"],item["priority"],item["dependencies"],item["completed"],"todayTABLE");
                    var checkboxes = $("table#todayTABLE input#todayCHECKBOX");
                    console.log("Added task to todayTABLE: " + item["task"] + " " + item["duedate"] + " " + item["priority"] + " " + item["dependencies"] + " " + item["completed"] + ", completedtasksTABLE");
                }
                else if(item["completed"] === true){
                    addTaskToTable(item["task"],item["duedate"],item["priority"],item["dependencies"],item["completed"],"completedtasksTABLE");
                    var checkboxes = $("table#completedtasksTABLE input#checkboxCompleteCHECKBOX");
                    for(var cb of checkboxes){
                        cb.checked = true;
                    }
                    console.log("Added task to completedtasksTABLE: " + item["task"] + " " + item["duedate"] + " " + item["priority"] + " " + item["dependencies"] + " " + item["completed"] + ", completedtasksTABLE");
                } 
                else {
                    addTaskToTable(item["task"],item["duedate"],item["priority"],item["dependencies"],item["completed"],"taskdataTABLE");
                    console.log("Added task to taskdataTABLE: " + item["task"] + " " + item["duedate"] + " " + item["priority"] + " " + item["dependencies"] + " " + item["completed"] + ", completedtasksTABLE");
                }
            }
        }
    });
}

function clearChromeStorage(){
    chrome.storage.sync.clear(function (){
        console.log('Cleared Chrome storage!');
    });
    deleteRow("taskdata");
}

function getTaskAndSyncChrome(){
    var taskinfo = document.getElementById("taskINPUT").value;
    var dueinfo = document.getElementById("dueINPUT").value;
    var priinfo = document.getElementById("priINPUT").value;
    var depinfo = document.getElementById("depINPUT").value;

    // Get all the items stored in the storage
    addTaskToTable(taskinfo,dueinfo,priinfo,depinfo,false,"taskdataTABLE");
    chrome.storage.sync.get(function(items) {
        if (Object.keys(items).length > 0 && items.data) {
            // The data array already exists, add to it the new server and nickname
            items.data.push({task: taskinfo, duedate: dueinfo, priority: priinfo, dependencies: depinfo, completed: false});
        } else {
            // The data array doesn't exist yet, create it
            items.data = [{task: taskinfo, duedate: dueinfo, priority: priinfo, dependencies: depinfo, completed: false}];
        }

        // Now save the updated items using set
        chrome.storage.sync.set(items, function() {
            console.log('Data successfully saved to the storage!');
        });
    });
}

function getChromeStorageAll(){
    chrome.storage.sync.get(null, function(items) {
        var allKeys = Object.keys(items);
    });
}

function loopTableRowsIntoArray(rows){
    // need to start with number of rows - skipping header and tbody (start at 2)
    for(i=3;i<rows.length;i++){
        rowarray = [];
        console.log("Index is: " + i);
        //rowarray.push("row" + i);
        for(j=0;j<rows[0].firstElementChild.cells.length;j++){
            console.log("Cur row is: " + i + ", and cur col is: " + j);
            var cell = rows[i].cells[j];
            // normal cells do not have children
            if(cell.children.length < 1){
                console.log("Current cell info is: " + cell.id);
                console.log("Current value is: " + cell.innerHTML);
                rowarray.push(cell.id,cell.innerHTML);
            }
            // last 2 elements are checkboxes nested in td
            else{
                if(cell.id == "checkboxCompleteTD"){
                    var cmpl = rows[i].lastElementChild.previousElementSibling.firstChild.checked;
                    console.log("Completed is: " + cmpl);
                    if (cmpl == false){
                        rowarray.push("completed",false);
                    } else {
                        rowarray.push("completed",true);
                    }
                } else {
                    var cb = rows[i].lastElementChild.firstChild.checked;
                    console.log("Checkbox is: " + cb);
                    if (cb == false){
                        rowarray.push("delete",false);
                    } else {
                        rowarray.push("delete",true);
                    }
                }
            }

          if(j == (rows[0].firstElementChild.cells.length-1)){
              console.log(rowarray);
              taskarray.push(rowarray);
          }
        }
    }
}

function deleteTasks(json,table){
    var deleteRowCounter = 0;
    for(k = 0; k < json.data.length; k++){
        console.log(json.data[k]);
        if(json.data[k].delete === true || json.data[k].delete === "undefined"){
            document.getElementById(table).deleteRow(k+1-deleteRowCounter);
            deleteRowCounter += 1;
        } else {
            // add to new JSON array
            activeJSONItems.data.push(json.data[k]);
        }
    }
}

function tableToJSONandDelete(tbl){ 
    //////////////////   Delete Tasks   //////////////////
    // use taskarray to populate JSON object
    // *** Use this loop to remove items with delete checked *** //
    // setting a counter so we can delete multiple rows at a time without screwing up DOM

    var todaytasks = getTasksFromTable("todayTABLE");
    var activetasks = getTasksFromTable("taskdataTABLE");
    var completedtasks = getTasksFromTable("completedtasksTABLE");

    var todayjson = convertArrayToJSON(todaytasks);
    var activejson = convertArrayToJSON(activetasks);
    var completedjson = convertArrayToJSON(completedtasks);

    //////////////////   Delete Tasks   //////////////////
    // Remove from DOM if delete is checked
    activeJSONItems = { "data": [{}]};

    var tab = document.getElementById(tbl);

    if(tbl == "todayTABLE"){
        // loop over top tasks and only keep ones without delete flagged
        deleteTasks(todayjson,tbl);
        for(var a of activejson.data){ activeJSONItems.data.push(a); }
        for(var c of completedjson.data){ activeJSONItems.data.push(c); }
    }

    else if(tbl == "taskdataTABLE"){
        // loop over top tasks and only keep ones without delete flagged
        deleteTasks(activejson,tbl);
        for(var t of todayjson.data){ activeJSONItems.data.push(t); }
        for(var c of completedjson.data){ activeJSONItems.data.push(c); }
    }

    else {
        // loop over top tasks and only keep ones without delete flagged
        deleteTasks(completedjson,tbl);
        for(var t of todayjson.data){ activeJSONItems.data.push(t); }
        for(var a of activejson.data){ activeJSONItems.data.push(a); }
    }

    console.log(JSON.stringify(activeJSONItems));
    // take jsonitems and update Chrome
    syncChrome(activeJSONItems);
}

function syncChrome(obj){
    chrome.storage.sync.set(obj, function() {
        console.log('Data successfully saved to the storage!');
    });  
}

// attached to Complete Checked button in Active Tasks table
function tableToJSONandComplete(table) {
    // retrieve child elements from tables and place into an array
    var todaytasks = getTasksFromTable("todayTABLE");
    var activetasks = getTasksFromTable("taskdataTABLE");
    var completedtasks = getTasksFromTable("completedtasksTABLE");
    var combinedtasks = todaytasks.concat(activetasks, completedtasks);

    //var todayjson = convertArrayToJSON(todaytasks);
    //var activejson = convertArrayToJSON(activetasks);
    //var completedjson = convertArrayToJSON(completedtasks);


    //////////////////   Complete Tasks   //////////////////
    // Move DOM location if completed is checked
    var completeRowCounter = 0;
    if(table === "todayTABLE"){
        var tab = document.getElementById("todayTABLE");
        var json = convertArrayToJSON(todaytasks);
        for(k = 0; k < json.data.length; k++){
            if(json.data[k].completed === true){
                document.getElementById("completedtasksTABLE").append(tab.rows[k+1-completeRowCounter]);
                completeRowCounter += 1;
            }
        }
    }
    else if(table === "taskdataTABLE"){
        var tab = document.getElementById("taskdataTABLE");
        var json = convertArrayToJSON(activetasks);
        for(k = 0; k < json.data.length; k++){
            if(json.data[k].completed === true){
                document.getElementById("completedtasksTABLE").append(tab.rows[k+1-completeRowCounter]);
                completeRowCounter += 1;
            }
        }
    } 
    else {
        var tab = document.getElementById("completedtasksTABLE");
        var json = convertArrayToJSON(completedtasks);
        for(k = 0; k < json.data.length; k++){
            if(json.data[k].completed === false){
                tab.rows[k+1-completeRowCounter].lastChild.previousElementSibling.previousElementSibling.firstElementChild.checked = false;
                document.getElementById("taskdataTABLE").append(tab.rows[k+1-completeRowCounter]);
                completeRowCounter += 1;
            }
        }        
    }
    // take jsonitems and update Chrome
    combinedjson = convertArrayToJSON(combinedtasks);

    console.log("Saving JSON: " + JSON.stringify(combinedjson));

    syncChrome(combinedjson);
}


function checkTasks(table,headercb,cbtype){
    var checkstate = document.getElementById(headercb).checked;
    var tab = document.getElementById(table);
    
    if(cbtype === "today"){
        for(x = 1; x < tab.rows.length; x++){
            if(checkstate == true){
                tab.rows.item(x).lastChild.previousElementSibling.previousElementSibling.previousElementSibling.firstElementChild.checked = true;
            } else {
                tab.rows.item(x).lastChild.previousElementSibling.previousElementSibling.previousElementSibling.firstElementChild.checked = false;
            }
        }      
    }
    else if(cbtype === "complete"){
        for(x = 1; x < tab.rows.length; x++){
            if(checkstate == true){
                tab.rows.item(x).lastChild.previousElementSibling.previousElementSibling.firstElementChild.checked = true;
            } else {
                tab.rows.item(x).lastChild.previousElementSibling.previousElementSibling.firstElementChild.checked = false;
            }
        }      
    }
    else if(cbtype === "delete"){
        for(x = 1; x < tab.rows.length; x++){
            if(checkstate == true){
                tab.rows.item(x).lastChild.previousElementSibling.firstElementChild.checked = true;
            } else {
                tab.rows.item(x).lastChild.previousElementSibling.firstElementChild.checked = false;
            }
        }      
    }

}

/*******************************************
Event Listener Functions
-can't pass arguments to these
*******************************************/

function clickHandler(e) {
    setTimeout(getTaskAndSyncChrome(), 1000);
}

// attached to Delete Checked button in Today Tasks table
function tableToJSONandSyncToday(){
    tableToJSONandDelete("todayTABLE");
}

// attached to Delete Checked button in Active Tasks table
function tableToJSONandSyncTop(){
    tableToJSONandDelete("taskdataTABLE");
}

// attached to Delete Checked button in Completed Tasks table
function tableToJSONandSyncBottom(){
    tableToJSONandDelete("completedtasksTABLE");
}

// attached to Complete button in Active Tasks table
function completeTasksToday(){
    tableToJSONandComplete("todayTABLE");
}

// attached to Complete button in Active Tasks table
function completeTasksActive(){
    tableToJSONandComplete("taskdataTABLE");
}

// attached to Reactivate button in Completed Tasks table
function reactivateTasks(){
    tableToJSONandComplete("completedtasksTABLE");
}



// header checkbox multi-selector functions
function checkAllToday() {
    checkTasks("todayTABLE","todayHeaderCHECKBOX","today");
}

function checkAllTodayComplete() {
    checkTasks("todayTABLE","checkallcompletetodayHeaderCHECKBOX","complete");
}

function checkAllTodayDelete() {
    checkTasks("todayTABLE","checkalldeletetodayHeaderCHECKBOX","delete");
}

function checkAllTodayActive() {
    checkTasks("taskdataTABLE","activeHeaderCHECKBOX","today");
}

function checkAllDeleteTop() {
    checkTasks("taskdataTABLE","checkalldeletetopHeaderCHECKBOX","delete");
}

function checkAllDeleteBottom() {
    checkTasks("completedtasksTABLE","checkalldeletebottomHeaderCHECKBOX","delete");
}

function checkAllCompleteTop() {
    checkTasks("taskdataTABLE","checkallcompletetopHeaderCHECKBOX","complete");
}

function checkAllCompleteBottom() {
    checkTasks("completedtasksTABLE","checkallcompletebottomHeaderCHECKBOX","complete");
}

function main() {
    // Start out by populating table with Chrome data
    getChromeStorageAndPopulateTable();
    //handleClientLoad();
    //gapi.auth2.getAuthInstance().signIn();
}

document.addEventListener('DOMContentLoaded', function () { 
    // testing
    /*
    window.onGoogleScriptLoad = () => {
      authenticate().then(loadClient());
      //gapi.load("client:auth2", function() {
      //    gapi.auth2.init({client_id: CLIENT_ID});
      //});
      console.log('The google script has really loaded, cool!');
    }
    window.onLoadCallback = function(){
      authenticate().then(loadClient());
    }

    document.getElementById('getCalendar').addEventListener('click', calendarEvents);
    document.getElementById('authorize-button').addEventListener('click', handleAuthClick());
    */

    // today table
    document.getElementById("deletetaskstodayBUTTON").addEventListener('click', tableToJSONandSyncToday);
    document.getElementById("completetaskstodayBUTTON").addEventListener('click', completeTasksToday);
    document.getElementById("movetoactivetasksBUTTON").addEventListener('click', moveBack);

    // top table
    document.getElementById("addtaskBUTTON").addEventListener('click', clickHandler);
    document.getElementById("movetotodaytopBUTTON").addEventListener('click', moveToToday);
    document.getElementById("completetasksBUTTON").addEventListener('click', completeTasksActive);
    document.getElementById("deletetasksBUTTON").addEventListener('click', tableToJSONandSyncTop);
    // bottom table
    document.getElementById("deletetasksbottomBUTTON").addEventListener('click', tableToJSONandSyncBottom);
    //document.getElementById("reactivatetasksbottomBUTTON").addEventListener('click', reactivateTasks);
    document.getElementById("reactivatetasksbottomBUTTON").addEventListener('click', reactivate);

    /* NOTE: all below event handlers MUST be done twice, otherwise it won't work on second click  */

    // today table
    document.getElementById("todayTH").addEventListener('click', checkAllToday);
    document.getElementById("todayHeaderCHECKBOX").addEventListener('click', checkAllToday);

    document.getElementById("completecoltoptodayTH").addEventListener('click', checkAllTodayComplete);
    document.getElementById("checkallcompletetodayHeaderCHECKBOX").addEventListener('click', checkAllTodayComplete);

    document.getElementById("deletecoltoptodayTH").addEventListener('click', checkAllTodayDelete);
    document.getElementById("checkalldeletetodayHeaderCHECKBOX").addEventListener('click', checkAllTodayDelete);


    // top table
    //$('#todayTH').on('click', checkAllToday());
    //$('#todayHeaderCHECKBOX').on('click', checkAllToday());
    document.getElementById("activeTH").addEventListener('click', checkAllTodayActive);
    document.getElementById("activeHeaderCHECKBOX").addEventListener('click', checkAllTodayActive);

    document.getElementById("deletecoltopTH").addEventListener('click', checkAllDeleteTop);
    document.getElementById("checkalldeletetopHeaderCHECKBOX").addEventListener('click', checkAllDeleteTop);

    document.getElementById("completecoltopTH").addEventListener('click', checkAllCompleteTop);
    document.getElementById("checkallcompletetopHeaderCHECKBOX").addEventListener('click', checkAllCompleteTop);

    // bottom table
    document.getElementById("deletecolbottomTH").addEventListener('click', checkAllDeleteBottom);
    document.getElementById("checkalldeletebottomHeaderCHECKBOX").addEventListener('click', checkAllDeleteBottom);

    document.getElementById("completecolbottomTH").addEventListener('click', checkAllCompleteBottom);
    document.getElementById("checkallcompletebottomHeaderCHECKBOX").addEventListener('click', checkAllCompleteBottom);

    main();
});
