var addFormButton = document.getElementById("addButton");
var calculateButton = document.getElementById("calculate");
var maindDiv = document.querySelector("#mainDiv");
var resultsDiv = document.getElementById("results");

//var getTotal = 0;


addFormButton.addEventListener("click", addAForm, false );
calculate.addEventListener("click", CalculateMethod , false);


var idCounter = 0;

var parentElement = "";
var childElement = ""


function getCreate(basePrice, form){
  var createField =  form.elements["Create"];

  return parseInt(createField.value) * basePrice;
}

function getRead(basePrice, form){
  var readField =  form.elements["Read"];

  return parseInt(readField.value) * basePrice;
}

function getUpdate(basePrice, form){
  var updateField =  form.elements["Update"];

  return parseInt(updateField.value) * basePrice;
}

function getDelete(basePrice, form){
  var deleteField =  form.elements["Delete"];

  return parseInt(deleteField.value) * basePrice;
}

function getTotal(arr, form){
  return Math.round(getCreate(arr.create, form) + getRead(arr.read, form) + getUpdate(arr.update, form) + getDelete(arr.delete, form));

  // document.getElementById('showme').innerHTML = "The total RU is: " + total;
}

function getSize(size, form){
  var numberField =  form.elements["documentNumber"];

  return parseInt(numberField.value * size);
}

function calculate2(sourceJSON, updateJSON)
{
  return new Promise((resolve, reject) => {
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    var theUrl = "http://localhost:8080/";
    var theUrl2 = "https://vast-caverns-24352.herokuapp.com/";
    xmlhttp.responseType = '';
    xmlhttp.open("POST", theUrl2, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xmlhttp.onload = function(){
      //output is a string of a json
      resolve(xmlhttp.responseText);
    };

    //Tests with either send
    //xmlhttp.send(JSON.stringify({"source": { "name": "Tester" } }));
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
      if(!validDocumentField(i.elements["documentNumber"].value) || !validField(i.elements["Create"].value) || !validField(i.elements["Delete"].value) || !validField(i.elements["Update"].value) || !validField(i.elements["Read"].value)){
        return false;
      }
    }
    return true;
  };



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

    var forms = document.getElementsByTagName('form');
    for(count = 0; count < forms.length; count++){
      var fileInput2 = forms[count].elements["fUploadUpdate"];
      var fileInput = forms[count].elements["fUpload"];
      if(fileInput.files.length == 1){
        var sourceJSON = await checkJSON(fileInput);
        if(sourceJSON != null){
          if(fileInput2.files.length != 1){
            var arr = await calculate2(sourceJSON, null);
            arr = JSON.parse(arr);
            //TODO: change information destinatino later
            // alert("Create: " + arr.create + " Read: " + arr.read + " Update: " + arr.update + " Delete: " + arr.delete);
            document.getElementById('create').innerHTML = "Create: " + getCreate(arr.create, forms[count]) + " RU";
            document.getElementById('read').innerHTML = "Read: " + getRead(arr.read, forms[count]) + " RU";
            document.getElementById('update').innerHTML = "Update: " + getUpdate(arr.update, forms[count]) + " RU";
            document.getElementById('delete').innerHTML = "Delete: " + getDelete(arr.delete, forms[count]) + " RU";
            document.getElementById('total').innerHTML = "Total RU: " + getTotal(arr, forms[count]) + " RU";
            document.getElementById('size').innerHTML = "Total Size: " + getSize(arr.size/1024, forms[count]) + " KB";
          }else if(fileInput2.files.length == 1){
            var updateJSON = await checkJSON(fileInput2);
            if(updateJSON != null){
              var arr = await calculate2(sourceJSON, updateJSON);
              // alert(arr);
              arr = JSON.parse(arr);

              //TODO: same thing as other TODO
              //getTotal = parseInt(arr.create) + parseInt(arr.read) + parseInt(arr.update) + parseInt(arr.delete);
              // alert("Create: " + arr.create + " Read: " + arr.read + " Update: " + arr.update + " Delete: " + arr.delete + " Size: " + arr.size);
              document.getElementById('create').innerHTML = "Create: " + getCreate(arr.create, forms[count]) + " RU";
              document.getElementById('read').innerHTML = "Read: " + getRead(arr.read, forms[count]) + " RU";
              document.getElementById('update').innerHTML = "Update: " + getUpdate(arr.update, forms[count]) + " RU";
              document.getElementById('delete').innerHTML = "Delete: " + getDelete(arr.delete, forms[count]) + " RU";
              document.getElementById('total').innerHTML = "Total RU: " + getTotal(arr, forms[count]) + " RU";
              document.getElementById('size').innerHTML = "Total Size: " + getSize(arr.size/1024, forms[count]) + " KB";

            }else{
              alert("error3");
            }
          }else{
            alert("error2");
          }
        }else{
          alert("error1");
        }
      }else{
        alert("error0");
      }
    }
  }else{
    alert("Not valid. ");
  }
}

//div starts at 0 but the form elements starts at 1
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
