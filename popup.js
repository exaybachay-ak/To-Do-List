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

*/


/*******************************************
Main Functions
*******************************************/

/*************
** Pausing this function, since rest is broken :(

function toDoToday(){

}
*/

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
                        rowarray.push("completed",false);
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
            //if(j == (rows[0].firstElementChild.cells.length)){
            //    console.log(rowarray);
            //    taskarray.push(rowarray);
            //}
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
                today : obj[k][9],
                completed : obj[k][11], // complete checkbox info
                delete : obj[k][13] // delete checkbox info
            }
            jsonitems.data.push(jsObj);
        }
        else {
            // skipping items that are undefined because deleting them just changes their data to undefined
        }
    }
    //return jsonitems;
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
        // NOTE: We need to check table because one has more columns than the other
        /*
        if(tbl == "completedtasksTABLE"){
            new_row.cells[4].id = "checkboxCompleteTD";
            new_row.cells[4].className = "checkboxComplete";
            new_row.cells[5].id = "checkboxDeleteTD";
            new_row.cells[5].className = "checkboxDelete";
          
            // create and add checkboxes, then attach to TD elements
            checkBoxComplete = document.createElement("input");
            checkBoxComplete.type = "checkbox";
            checkBoxComplete.id = "checkboxCompleteCHECKBOX";
            checkBoxComplete.className = "checkboxCompleteCHECKBOX";
            new_row.cells[4].appendChild(checkBoxComplete);

            checkBoxDelete = document.createElement("input");
            checkBoxDelete.type = "checkbox";
            checkBoxDelete.id = "checkboxDeleteCHECKBOX";
            checkBoxDelete.className = "checkboxDeleteCHECKBOX";
            new_row.cells[5].appendChild(checkBoxDelete);
        } 
        else if(tbl == "taskdataTABLE"){
        */
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
                if(item["completed"] === true){
                    addTaskToTable(item["task"],item["duedate"],item["priority"],item["dependencies"],item["completed"],"completedtasksTABLE");
                    var checkboxes = $("table#completedtasksTABLE input#checkboxCompleteCHECKBOX")
                    for(var cb of checkboxes){
                        cb.checked = true;
                    }
                    console.log("Added task to completedtasksTABLE: " + item["task"] + " " + item["duedate"] + " " + item["priority"] + " " + item["dependencies"] + " " + item["completed"] + ", completedtasksTABLE");
                } else {
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
function tableToJSONandSync(tbl){ 
    //////////////////   Delete Tasks   //////////////////
    // use taskarray to populate JSON object
    // *** Use this loop to remove items with delete checked *** //
    // setting a counter so we can delete multiple rows at a time without screwing up DOM
    var toptasks = getTasksFromTable("taskdataTABLE");
    var bottomtasks = getTasksFromTable("completedtasksTABLE");

    console.log(toptasks.length);
    console.log(bottomtasks.length);

    var topjson = convertArrayToJSON(toptasks);
    var bottomjson = convertArrayToJSON(bottomtasks);

    //////////////////   Delete Tasks   //////////////////
    // Remove from DOM if delete is checked
    activeJSONItems = { "data": [{}]};

    var tab = document.getElementById(tbl);
    var deleteRowCounter = 0;

    if(tbl == "taskdataTABLE"){
        // loop over top tasks and only keep ones without delete flagged
        for(k = 0; k < topjson.data.length; k++){
            console.log(topjson.data[k]);
            if(topjson.data[k].delete === true || topjson.data[k].delete === "undefined"){
                document.getElementById(tbl).deleteRow(k+1-deleteRowCounter);
                deleteRowCounter += 1;
            } else {
                // add to new JSON array
                activeJSONItems.data.push(topjson.data[k]);
            }
        }

        // loop over bottom tasks and add to new JSON object
        for(l = 0; l < bottomjson.data.length; l++){
            activeJSONItems.data.push(bottomjson.data[l]);
        }
    }

    else {
        // loop over top tasks and only keep ones without delete flagged
        for(l = 0; l < bottomjson.data.length; l++){
            console.log(bottomjson.data[l]);
            if(bottomjson.data[l].delete === true || bottomjson.data[l].delete === "undefined"){
                document.getElementById(tbl).deleteRow(l+1-deleteRowCounter);
                deleteRowCounter += 1;
            } else {
                // add to new JSON array
                activeJSONItems.data.push(bottomjson.data[l]);
            }
        }

        // loop over bottom tasks and add to new JSON object
        for(m = 0; m < topjson.data.length; m++){
            activeJSONItems.data.push(topjson.data[m]);
        }        
    }

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
    var toptasks = getTasksFromTable("taskdataTABLE");
    var bottomtasks = getTasksFromTable("completedtasksTABLE");
    var combinedtasks = toptasks.concat(bottomtasks);

    //////////////////   Complete Tasks   //////////////////
    // Move DOM location if completed is checked
    var completeRowCounter = 0;
    if(table === "taskdataTABLE"){
        var tab = document.getElementById("taskdataTABLE");
        var json = convertArrayToJSON(toptasks);
        for(k = 0; k < json.data.length; k++){
            if(json.data[k].completed === true){
                document.getElementById("completedtasksTABLE").append(tab.rows[k+1-completeRowCounter]);
                completeRowCounter += 1;
            }
        }
    } else {
        var tab = document.getElementById("completedtasksTABLE");
        var json = convertArrayToJSON(bottomtasks);
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


/*******************************************
Event Listener Functions
-can't pass arguments to these
*******************************************/

function clickHandler(e) {
    setTimeout(getTaskAndSyncChrome(), 1000);
}

// attached to Delete Checked button in Active Tasks table
function tableToJSONandSyncTop(){
    tableToJSONandSync("taskdataTABLE");
}

function tableToJSONandSyncBottom(){
    tableToJSONandSync("completedtasksTABLE");
}

// attached to Complete button in Active Tasks table
function completeTasks(){
    tableToJSONandComplete("taskdataTABLE");
}

// attached to Reactivate button in Completed Tasks table
function reactivateTasks(){
    tableToJSONandComplete("completedtasksTABLE");
}

function checkAllTodayTop() {
    var checkstate = document.getElementById("todayHeaderCHECKBOX").checked;
    var tab = document.getElementById("taskdataTABLE");
    //tab.getElementsByClassName("checkboxDeleteCHECKBOX").checked = false;
    
    for(x = 1; x < tab.rows.length; x++){
        if(checkstate == true){
            tab.rows.item(x).lastChild.previousElementSibling.previousElementSibling.previousElementSibling.firstElementChild.checked = true;
        } else {
            tab.rows.item(x).lastChild.previousElementSibling.previousElementSibling.previousElementSibling.firstElementChild.checked = false;
        }
    }
}

function checkAllDeleteTop() {
    var checkstate = document.getElementById("checkalldeletetopHeaderCHECKBOX").checked;
    var tab = document.getElementById("taskdataTABLE");
    //tab.getElementsByClassName("checkboxDeleteCHECKBOX").checked = false;
    
    for(x = 1; x < tab.rows.length; x++){
        if(checkstate == true){
            tab.rows.item(x).lastChild.previousElementSibling.firstElementChild.checked = true;
        } else {
            tab.rows.item(x).lastChild.previousElementSibling.firstElementChild.checked = false;
        }
    }
}

function checkAllDeleteBottom() {
    var checkstate = document.getElementById("checkalldeletebottomHeaderCHECKBOX").checked;
    var tab = document.getElementById("completedtasksTABLE");
    //tab.getElementsByClassName("checkboxDeleteCHECKBOX").checked = !checkstate;

    for(x = 0; x < tab.rows.length; x++){
        if(checkstate == true){
            tab.rows.item(x).lastChild.previousElementSibling.firstElementChild.checked = true;
        } else {
            tab.rows.item(x).lastChild.previousElementSibling.firstElementChild.checked = false;
        }
    }
}

function checkAllCompleteTop() {
    var checkstate = document.getElementById("checkallcompletetopHeaderCHECKBOX").checked;
    var tab = document.getElementById("taskdataTABLE");
    //tab.getElementsByClassName("checkboxCompleteCHECKBOX").checked = !checkstate;

    for(x = 0; x < tab.rows.length; x++){
        if(checkstate == true){
            tab.rows.item(x).lastChild.previousElementSibling.previousElementSibling.firstElementChild.checked = true;
        } else {
            tab.rows.item(x).lastChild.previousElementSibling.previousElementSibling.firstElementChild.checked = false;
        }
    }
}

function checkAllCompleteBottom() {
    var checkstate = document.getElementById("checkallcompletebottomHeaderCHECKBOX").checked;
    var tab = document.getElementById("completedtasksTABLE");
    //tab.getElementsByClassName("checkboxCompleteCHECKBOX").checked = !checkstate;

    for(x = 0; x < tab.rows.length; x++){
        if(checkstate == true){
            tab.rows.item(x).lastChild.previousElementSibling.previousElementSibling.firstElementChild.checked = true;
        } else {
            tab.rows.item(x).lastChild.previousElementSibling.previousElementSibling.firstElementChild.checked = false;
        }
    }
}

function main() {
    // Start out by populating table with Chrome data
    getChromeStorageAndPopulateTable();
}

document.addEventListener('DOMContentLoaded', function () { 
    // top table
    document.getElementById("addtaskBUTTON").addEventListener('click', clickHandler);
    document.getElementById("deletetasksBUTTON").addEventListener('click', tableToJSONandSyncTop);
    document.getElementById("completetasksBUTTON").addEventListener('click', completeTasks);
    // bottom table
    document.getElementById("deletetasksbottomBUTTON").addEventListener('click', tableToJSONandSyncBottom);
    document.getElementById("reactivatetasksbottomBUTTON").addEventListener('click', reactivateTasks);

    /* NOTE: all below event handlers MUST be done twice, otherwise it won't work on second click  */
    // top table
    document.getElementById("todayTH").addEventListener('click', checkAllTodayTop);
    document.getElementById("todayHeaderCHECKBOX").addEventListener('click', checkAllTodayTop);

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
