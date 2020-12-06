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


function tableToJSONandSync() {
    // retrieve child elements from table
    var rows = document.getElementById("taskdata").children;
    var taskarray = [];

    // need to start with number of rows - skipping header and tbody (start at 2)
    for(i=2;i<rows.length;i++){
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
        // last element is checkbox nested in td
        else{
          var cb = rows[i].lastElementChild.firstChild.checked;
          console.log("Checkbox is: " + cb);
          if (cb == false){
            rowarray.push("Checkbox","notChecked");
          } else {
            rowarray.push("Checkbox","Checked");
          }
        }
        if(j == (rows[0].firstElementChild.cells.length-1)){
          console.log(rowarray);
          taskarray.push(rowarray);
        }
      }
    }
    console.log(taskarray);
    // use taskarray to populate JSON object
    // *** Use this loop to remove items with delete checked *** //
    jsonitems = { "data": [{}]};
    // setting a counter so we can delete multiple rows at a time without screwing up DOM
    var deleteRowCounter = 0;
    for(k = 0; k < taskarray.length; k++){
        if (taskarray[k][9] == "notChecked"){
            if(typeof taskarray[k][1] !== "undefined"){
                var jsObj = {
                    task : taskarray[k][1], // task info
                    duedate : taskarray[k][3], // due date info
                    priority : taskarray[k][5], // priority info
                    dependencies : taskarray[k][7], // dependencies info
                    checkbox : taskarray[k][9], // checkbox info
                }
                jsonitems.data.push(jsObj);
            }
            else {
                // skipping items that are undefined because deleting them just changes their data to undefined
            }
        }
        else { 
            // not adding to array effectively means we delete it
            // still need to delete from DOM
            document.getElementById("taskdata").deleteRow(k+1-deleteRowCounter);
            deleteRowCounter += 1;
        }
    }

    // take jsonitems and update Chrome
    chrome.storage.sync.set(jsonitems, function() {
        console.log('Data successfully saved to the storage!');
    });
}

function addTaskToTable(task,due,pri,dep){
    var x = document.getElementById("taskdata");

    if(x.rows.length > 0){
        //create a row here
        var new_row = x.rows[0].cloneNode(true); //clone initial row
        var len = x.rows.length; //get total number of rows
        new_row.cells[0].innerHTML = task;
        new_row.cells[0].id = "task";
        new_row.cells[0].class = "task";
        new_row.cells[1].innerHTML = due;
        new_row.cells[1].id = "due";
        new_row.cells[1].class = "due";
        new_row.cells[2].innerHTML = pri;
        new_row.cells[2].id = "pri";
        new_row.cells[2].class = "pri";
        new_row.cells[3].innerHTML = dep;
        new_row.cells[3].id = "dep";
        new_row.cells[3].class = "dep";
        new_row.cells[4].innerHTML = "";
        new_row.cells[4].id = "checkboxCell";
        new_row.cells[4].class = "checkboxCell";

        checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.id = "checkbox";
        checkBox.class = "checkbox";
        new_row.cells[4].appendChild(checkBox);

        x.appendChild(new_row);
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

function clickHandler(e) {
    setTimeout(getTaskAndSyncChrome(), 1000);
}

function getChromeStorageAndPopulateTable() {
    chrome.storage.sync.get(null, function(items) {
        items.data.sort(sortJSON("priority"));
        for (var item of items.data ){
            // need to ensure items are not undefined to avoid populating deleted data
            if(typeof item["task"] !== "undefined"){
                addTaskToTable(item["task"],item["duedate"],item["priority"],item["dependencies"]);
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
    var taskinfo = document.getElementById("task").value;
    var dueinfo = document.getElementById("due").value;
    var priinfo = document.getElementById("pri").value;
    var depinfo = document.getElementById("dep").value;

    // Get all the items stored in the storage
    addTaskToTable(taskinfo,dueinfo,priinfo,depinfo);
    chrome.storage.sync.get(function(items) {
        if (Object.keys(items).length > 0 && items.data) {
            // The data array already exists, add to it the new server and nickname
            items.data.push({task: taskinfo, duedate: dueinfo, priority: priinfo, dependencies: depinfo});
        } else {
            // The data array doesn't exist yet, create it
            items.data = [{task: taskinfo, duedate: dueinfo, priority: priinfo, dependencies: depinfo}];
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

function checkAll() {
    var tab = document.getElementById("taskdata");
    for(x = 0; x < tab.rows.length; x++){
        tab.rows.item(x).lastChild.previousSibling.firstChild.checked = true;
    }
}

function main() {
    // Start out by populating table with Chrome data
    getChromeStorageAndPopulateTable();
}

document.addEventListener('DOMContentLoaded', function () { 
    document.getElementById("addtask").addEventListener('click', clickHandler);
    document.getElementById("cleartasks").addEventListener('click', clearChromeStorage);
    document.getElementById("deletetasks").addEventListener('click', tableToJSONandSync);
    document.getElementById("checkall").addEventListener('click', checkAll);
    main();
});