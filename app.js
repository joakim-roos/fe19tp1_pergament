

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


const addNewNote = document.getElementById("newNoteBtn");
const noteList=[]; //tom array för samtliga notes


// testfunktion, används ej just nu
let notes = [{
  id: Date.now(),
  data: "", //{(quill delta)}, // "<html>",
  favourite: false,
  deleted: false
}];

let quillDelta = notes[0].data
 //


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
  let date = Date.now();
  let noteNumberX = Math.floor(date / 1000);
  newNote.setAttribute('id', noteNumberX); //ger div(newnote) det skapade ID:t 

  newNote.setAttribute("onclick", "focusElement("+noteNumberX+")"); //byter valt element vid klick
  noteList.push(newNote);

  let deleteButton = document.createElement("button");   //skapa raderaknapp
  deleteButton.className="delete-button"; // ger knapp en klass för att kunna styla det 
  deleteButton.setAttribute("onclick", "removeElement("+noteNumberX+")"); //ger knapp specifikt ID och kör funktion vid klick 
  let textdeleteButton = document.createTextNode("X");  //ger radera knapp ett innehåll 
  deleteButton.appendChild(textdeleteButton);   //slår ihop knappen med innehållet 
  newNote.appendChild(deleteButton);   //lägger knappen i div (newnote) 
};


function focusElement(noteNumberX){  //när man klickar på en note kallas den här funktionen. 
  var selectedNote = Id2Note(noteNumberX);
  quill.root.innerHTML = selectedNote.innerHTML;
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
  console.log(noteList[i]);
}



//Malin
//klickfunktionen
function removeElement(noteNumberX) {
  
  let deleteItem = document.getElementById(noteNumberX); // spar anteckningen i en varabel 
  deleteItem.parentNode.removeChild(deleteItem); //raderar anteckningen


  var i;    //går igenom globala listan och tar bort noten ur listan
  var index;
  for (i = 0; i < noteList.length; i++){
    if (noteList[i].noteNumberX === noteNumberX){
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


// Hjälp knapp - Malin
let modal = document.getElementById("myModal"); // första diven 
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
  let printContents = quill.root.innerHTML;
  let originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
//  document.body.innerHTML = originalContents;
location.reload();
}


addElement(); //so the list won't start empty