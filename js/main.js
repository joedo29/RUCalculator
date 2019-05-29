var row0 = document.getElementById("row0");
var row1 = document.getElementById("row1");
var row2 = document.getElementById("row2");
var row3 = document.getElementById("row3");
var row4 = document.getElementById("row4");
var row5 = document.getElementById("row5");
var row6 = document.getElementById("row6");

var addFormButton = document.getElementById("addButton");
var calculateButton = document.getElementById("calculate");
var maindDiv = document.querySelector("#mainDiv");
var resultsTable = document.getElementById("resultsTable");
var results = document.getElementById("results");

addFormButton.addEventListener("click", addAForm, false);
calculate.addEventListener("click", CalculateMethod , false);

var idCounter = 0;
var parentElement = "";
var childElement = "";

function getCreate(basePrice, form, print){
  basePrice = Math.round(basePrice);
  var createField =  form.elements["Create"];
  if(!print)
    return parseInt(createField.value) * basePrice;
  else
    return parseInt(createField.value * basePrice) + " = " + createField.value + " * " + basePrice + " RU/s";
}

function getRead(basePrice, form, print){
  basePrice = Math.round(basePrice);
  var readField =  form.elements["Read"];
  if(!print)
    return parseInt(readField.value) * basePrice;
  else
    return parseInt(readField.value * basePrice) + " = " + readField.value + " * " + basePrice + " RU/s";
}

function getUpdate(basePrice, form, print){
  basePrice = Math.round(basePrice);
  var updateField =  form.elements["Update"];
  if(!print)
    return parseInt(updateField.value) * basePrice;
  else
    return parseInt(updateField.value * basePrice) + " = " + updateField.value + " * " + basePrice + " RU/s";
}

function getDelete(basePrice, form, print){
  basePrice = Math.round(basePrice);
  var deleteField =  form.elements["Delete"];
  if(!print)
    return parseInt(deleteField.value) * basePrice;
  else
  return parseInt(deleteField.value * basePrice) + " = " + deleteField.value + " * " + basePrice + " RU/s";
}

function getTotal(arr, form){
  return getCreate(arr.create, form) + getRead(arr.read, form) + getUpdate(arr.update, form) + getDelete(arr.delete, form);
}

function getSize(size, form, print){
  size = Math.round(size);
  var numberField =  form.elements["documentNumber"];
  if(!print)
    return parseInt(numberField.value * size);
  else
    return parseInt(numberField.value * size) + " = " + numberField.value + " * " + size + " KB";
}

function calculate2(sourceJSON, updateJSON)
{
  return new Promise((resolve, reject) => {
    var xmlhttp = new XMLHttpRequest();
    var theUrl = "http://localhost:8080/";
    var theUrl2 = "https://vast-caverns-24352.herokuapp.com/api";
    xmlhttp.responseType = '';
    xmlhttp.open("POST", theUrl2, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xmlhttp.onload = function(){
      //output is a string of a json
      resolve(xmlhttp.responseText);
    };

    xmlhttp.send(JSON.stringify({"source": sourceJSON , "update": updateJSON }));
  });
};

async function CalculateMethod(){
  function validDocumentField(value){
      value = Number(value);
      return Number.isInteger(value) && value > 0;
  };

  function validField(value){
      value = Number(value);
      return Number.isInteger(value) && value > -1;
  };

  function checkFields(){
      var forms = document.getElementsByTagName('form');
      for(count = 0; count < forms.length; count++){
        var i = forms[count];

        if(i.elements["documentNumber"].value == ''){
          i.elements["documentNumber"].value = 0;
        }
        if(i.elements["Create"].value == ''){
          i.elements["Create"].value = 0;
        }
        if(i.elements["Read"].value == ''){
          i.elements["Read"].value = 0;
        }
        if(i.elements["Update"].value == ''){
          i.elements["Update"].value = 0;
        }
        if(i.elements["Delete"].value == ''){
          i.elements["Delete"].value = 0;
        }
      }
      for(count = 0; count < forms.length; count++){
        if(!validDocumentField(i.elements["documentNumber"].value) || !validField(i.elements["Create"].value) || !validField(i.elements["Delete"].value) || !validField(i.elements["Update"].value) || !validField(i.elements["Read"].value)){
            return false;
        }
      }
      return true;
    };

  function deleteExistingRows(){
    var existingRows = document.getElementsByClassName("resultCol");
    while(existingRows.length > 0){
      existingRows[0].parentNode.removeChild(existingRows[0]);
    }
  }

  function addARow(d, c, r, u, de, t, s){
      var col0 = document.createElement("td");
      col0.innerHTML = d;
      col0.setAttribute("id", "firstRow");
      var col1 = document.createElement("td");
      col1.innerHTML = c;
      var col2 = document.createElement("td");
      col2.innerHTML = r;
      var col3 = document.createElement("td");
      col3.innerHTML = u;
      var col4 = document.createElement("td");
      col4.innerHTML = de;
      var col5 = document.createElement("td");
      col5.innerHTML = t;
      var col6 = document.createElement("td");
      col6.innerHTML = s;

      col0.setAttribute("class", "resultCol");
      col1.setAttribute("class", "resultCol");
      col2.setAttribute("class", "resultCol");
      col3.setAttribute("class", "resultCol");
      col4.setAttribute("class", "resultCol");
      col5.setAttribute("class", "resultCol");
      col6.setAttribute("class", "resultCol");
      row0.append(col0);
      row1.append(col1);
      row2.append(col2);
      row3.append(col3);
      row4.append(col4);
      row5.append(col5);
      row6.append(col6);
    }
    function displayTotal(totalCreate, totalRead, totalUpdate, totalDelete, totalTotal, totalSizes){
        /*
        <th>Document #</th>
          <th>Create</th>
          <th>Read</th>
          <th>Update</th>
          <th>Delete</th>
          <th>Total</th>
          <th>Size</th>
        */
      var col0 = document.createElement("th");
      col0.innerHTML = "Total";
      col0.setAttribute("id", "firstRow");
      var col1 = document.createElement("th");
      col1.innerHTML = Math.round(totalCreate) + " RU/s";
      var col2 = document.createElement("th");
      col2.innerHTML = Math.round(totalRead) + " RU/s";
      var col3 = document.createElement("th");
      col3.innerHTML = Math.round(totalUpdate) + " RU/s";
      var col4 = document.createElement("th");
      col4.innerHTML = Math.round(totalDelete) + " RU/s";
      var col5 = document.createElement("th");
      col5.innerHTML = Math.round(totalTotal) + " RU/s";
      var col6 = document.createElement("th");
      col6.innerHTML = Math.round(totalSizes) + " KB";

      col0.setAttribute("class", "resultCol");
      col1.setAttribute("class", "resultCol");
      col2.setAttribute("class", "resultCol");
      col3.setAttribute("class", "resultCol");
      col4.setAttribute("class", "resultCol");
      col5.setAttribute("class", "resultCol");
      col6.setAttribute("class", "resultCol");

      row0.append(col0);
      row1.append(col1);
      row2.append(col2);
      row3.append(col3);
      row4.append(col4);
      row5.append(col5);
      row6.append(col6);
    }

  if(checkFields()){
    //Kevin's method
    function checkJSON(fileInput) {
      return new Promise((resolve, reject) => {
        var json = new FileReader();
        json.onload = function(event) {
          var contents = event.target.result;
          //If valid JSON format
          if(contents != null){
            //Go to Joe's method
            //findSize();
            resolve(contents);
          }else{
            //output error
            alert("JSON file is not written in valid JSON format. ");
            reject('error');
          }
        }
        json.onerror = function(errors) {
          //display error(s)
          alert("Error: " + errors);
        }
        json.readAsText(fileInput.files[0]);
      });
    }
    var totalCreate = 0, totalRead = 0, totalUpdate = 0, totalDelete = 0, totalTotal = 0, totalSizes = 0;
    var temp = {create:0, read:0, update:0, delete:0, total:0, sizes:0};
    var forms = document.getElementsByTagName('form');
    deleteExistingRows();
    for(count = 0; count < forms.length; count++){
      var fileInput2 = forms[count].elements["fUploadUpdate"];
      var fileInput = forms[count].elements["fUpload"];
      if(fileInput.files.length == 1){
        var sourceJSON = await checkJSON(fileInput);
        if(sourceJSON != null){
          if(fileInput2.files.length == 0){
            if(forms[count].elements["Update"].value == 0){
              var arr = await calculate2(sourceJSON, null);
              arr = JSON.parse(arr);
              //TODO: change information destination later
              temp.create = getCreate(arr.create, forms[count], false);
              temp.read = getRead(arr.read, forms[count], false);
              temp.update = getUpdate(arr.update, forms[count], false);
              temp.delete = getDelete(arr.delete, forms[count], false);
              temp.total = getTotal(arr, forms[count], false);
              temp.sizes = getSize(arr.size/1024, forms[count], false);
              totalCreate += temp.create;
              totalRead += temp.read;
              totalUpdate += temp.update;
              totalDelete += temp.delete;
              totalTotal += temp.total;
              totalSizes += temp.sizes;
              /*
              alert("Create: " + arr.create + " Read: " + arr.read + " Update: " + arr.update + " Delete: " + arr.delete);
              document.getElementById('create').innerHTML = "Create: " + temp.create + " RU";
              document.getElementById('read').innerHTML = "Read: " + temp.read + " RU";
              document.getElementById('update').innerHTML = "Update: " + temp.update + " RU";
              document.getElementById('delete').innerHTML = "Delete: " + temp.delete + " RU";
              document.getElementById('total').innerHTML = "Total RU: " + temp.total + " RU";
              document.getElementById('size').innerHTML = "Total Size: " + temp.sizes + " KB";
              */
              addARow(count + 1, getCreate(arr.create, forms[count], true), getRead(arr.read, forms[count], true), getUpdate(arr.update, forms[count], true), getDelete(arr.delete, forms[count], true), getTotal(arr, forms[count]) + " RU/s", getSize(arr.size/1024, forms[count], true));
            }else{
              alert('There is no update file selected. ');
            }
          }else if(fileInput2.files.length == 1){
            var updateJSON = await checkJSON(fileInput2);
            if(updateJSON != null){
              var arr = await calculate2(sourceJSON, updateJSON);
              arr = JSON.parse(arr);
              temp.create = getCreate(arr.create, forms[count], false);
              temp.read = getRead(arr.read, forms[count], false);
              temp.update = getUpdate(arr.update, forms[count], false);
              temp.delete = getDelete(arr.delete, forms[count], false);
              temp.total = getTotal(arr, forms[count], false);
              temp.sizes = getSize(arr.size/1024, forms[count], false);
              totalCreate += temp.create;
              totalRead += temp.read;
              totalUpdate += temp.update;
              totalDelete += temp.delete;
              totalTotal += temp.total;
              totalSizes += temp.sizes;
              /*
              alert("Create: " + arr.create + " Read: " + arr.read + " Update: " + arr.update + " Delete: " + arr.delete + " Size: " + arr.size);
              document.getElementById('create').innerHTML = "Create: " + temp.create + " RU";
              document.getElementById('read').innerHTML = "Read: " + temp.read + " RU";
              document.getElementById('update').innerHTML = "Update: " + temp.update + " RU";
              document.getElementById('delete').innerHTML = "Delete: " + temp.delete + " RU";
              document.getElementById('total').innerHTML = "Total RU: " + temp.total + " RU";
              document.getElementById('size').innerHTML = "Total Size: " + temp.sizes + " KB";
              */
              addARow(count + 1, getCreate(arr.create, forms[count], true), getRead(arr.read, forms[count], true), getUpdate(arr.update, forms[count], true), getDelete(arr.delete, forms[count], true), getTotal(arr, forms[count]) + " RU/s", getSize(arr.size/1024, forms[count], true));
            }else{
              alert("No valid update file or too many selected. ");
            }
          }else{
            alert("No update file selected. ");
          }
        }else{
          alert("No valid source file or too many selected. ");
        }
      }else{
        alert("No source file selected. ");
      }
    }
    displayTotal(totalCreate, totalRead, totalUpdate, totalDelete,totalTotal, totalSizes);
    results.style.display = "block";
  }else{
    alert("Some fields are not valid. Ensure no value is negative. ");
  }
}


function addAForm(){
  parentElement = document.createElement("div");
  parentElement.setAttribute("id", ++idCounter);
  parentElement.innerHTML = document.getElementById('blockOfStuff').innerHTML;
  maindDiv.appendChild(parentElement);
}

function removeForm(elementId){
  childElement = document.getElementById(elementId);
  childElement.parentNode.parentNode.remove();
  idCounter--;
}

//Joe's method
function findSize() {
  var fileInput =  document.getElementById("fUpload");
  try{
    alert("Your rough estimation is: " + (fileInput.files[0].size / 1024 )+ " RU"); // Size returned in bytes.
  }catch(e){
    var objFSO = new ActiveXObject("Scripting.FileSystemObject");
    var e = objFSO.getFile( fileInput.value);
    var fileSize = e.size;
    alert(fileSize);
  }
}
