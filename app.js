// let how =  document.getElementById("how").textContent;
// window.alert(how);

// Joakim - 'Skapa en anteckning' - Submit-knappen funkar och lägger till en anteckning på innersidebar. Dock går det inte att klicka på den än.
const addNewNote = document.getElementById("newNoteBtn");


const noteList=[]; //tom array för samtliga notes
var Count=-1; //global variable för notes
   //global variable för att markera vald note


//var tänkt att få lägsta öppna id, rätt dålig funktion men fick inte Lambda att fungera i JS.
//istället returnerar funktionen n efter n calls
/* function getOpenId(){
  Count++;
  return Count;
  console.log(Count);
} */

addNewNote.onclick = function () {
  addElement();
}

function addElement () { 
  let currentNote = document.getElementById("innerSideBar"); 
  let child = currentNote.firstChild;
  let newNote = document.createElement("div"); 
  newNote.className = "newNote";
  newNote.innerHTML = quill.root.innerHTML;
  quill.deleteText(0,quill.getLength()); //tömmer canvas från symboler
  currentNote.insertBefore(newNote, child);

  // Skapar ett ID och spar i variabel 
  let datumet = Date.now();
  let skapatID = Math.floor(datumet / 1000);
  newNote.setAttribute('id', skapatID); //ger div(newnote) det skapade ID:t 


                //ger div-noten ett nytt, "mer säkert", id
                //let newId=getOpenId();
                //newNote.setAttribute("testId",newId);
                //lägger till den i globala listan
  newNote.setAttribute("onclick", "focusElement("+skapatID+")"); //byter valt element vid klick
  noteList.push(newNote);
// det här ovanför ska tas bort. 


  let raderaKnapp = document.createElement("button");   //skapa raderaknapp
  raderaKnapp.className="ta-bort-knappen"; // ger knapp en klass för att kunna styla det 
  raderaKnapp.setAttribute("onclick", "removeElement("+skapatID+")"); //ger knapp specifikt ID och kör funktion vid klick 
  let textRaderaKnapp = document.createTextNode("X");  //ger radera knapp ett innehåll 
  raderaKnapp.appendChild(textRaderaKnapp);   //slår ihop knappen med innehållet 
  newNote.appendChild(raderaKnapp);   //lägger knappen i div (newnote) 
};


 
function focusElement(skapatID){  //när man klickar på en note kallas den här funktionen. 
  var selectedNote;
  selectedNote = Id2Note(skapatID);
  if (quill.root.innerHTML = selectedNote.innerHTML) {
      selectedNote.innerHTML = quill.root.innerHTML;
  }
}


function Id2Note(int){ // Loopar igenom notelist array genom Malins ID
  var i;
  var t;
  for(i = 0; i < noteList.length; i++){
    t = noteList[i].getAttribute("id");
      if(int==t){
      return noteList[i]
      }
  }
}

//Malin
//klickfunktionen
function removeElement(skapatID) {
  
  let attRadera = document.getElementById(skapatID); // spar anteckningen i en varabel 
  attRadera.parentNode.removeChild(attRadera); //raderar anteckningen


  var i;    //går igenom globala listan och tar bort noten ur listan
  var index;
  for (i = 0; i < noteList.length; i++){
    if (noteList[i].skapatID === skapatID){
      index=i;
    }
  }
  noteList.splice(index,1);
}


// Fabian
//Visa/göm SettingsElementet (SideNav) med hjälp av en knapp
var showBtn = document.getElementById("showHideBtn");
showBtn.onclick = function() {showHideFunction()};

function showHideFunction(){
  var sideNav = document.querySelector("#sideNav");

     if(sideNav.style.display === "inline-block"){
      sideNav.style.display = "none";
     }
      else {
        sideNav.style.display = "inline-block";
     }
}

  let quill = new Quill('#editor-container', {
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block'],
        [{ 'list': 'ordered'}, {'list': 'bullet' }],
      ]
    },
    placeholder: 'Team Pergament är cool',
    theme: 'snow'  // or 'bubble'
  });



// Hjälp knapp - Malin
let modal = document.getElementById("myModal"); // Get the modal hela första diven 
let btn = document.getElementById("helpBtn"); // Get the button that opens the modal
let span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal

btn.onclick = function() {  // When the user clicks the button, open the modal 
  modal.style.display = "block";
}

span.onclick = function() { // When the user clicks on <span> (x), close the modal
  modal.style.display = "none";
}

window.onclick = function(event) { // When the user clicks anywhere outside of the modal, close it
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


// Print-knapp - Malin 
printDiv = function(divName) {
  let printContents = document.querySelector(".ql-editor").innerHTML;
  let originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
//  document.body.innerHTML = originalContents;
location.reload();
}


addElement(); //so the list won't start empty