
let quill = new Quill('#editor-container', {
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['image', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ]
  },
  placeholder: 'Team Pergament är cool',
  theme: 'snow'  // or 'bubble'
});


const addNewNote = document.getElementById("newNoteBtn");
const noteList = []; //tom array för samtliga notes


addNewNote.onclick = function () {
  addNote();
}

function addNote() {
  let notes = {    //objekt som skapas. Innehåller ID , data (texten), och andra properties vi behöver senare. ett objekt = en anteckning.
    id: Date.now(),
    title: "",
    data: "", //{(quill delta)}, // "<html>",
    favourite: false,
    deleted: false
  };
  let allNotes = document.getElementById("innerSideBar");
  let child = allNotes.firstChild;
  let note = document.createElement("div");
  note.className = "note";
  allNotes.insertBefore(note, child);

  notes.data = quill.root.innerHTML;
  quill.deleteText(0, quill.getLength()); //tömmer canvas från symboler

  //newNote.setAttribute('id', noteNumberX); //ger div(newnote) det skapade ID:t 
  //newNote.setAttribute("onclick", "focusElement(" + noteNumberX + ")"); //byter valt element vid klick

  note.addEventListener('click', function (event) {   //click funktion- när man klickar på en anteckningen syns det man skrivit i quillen
    console.log(event.target)
    quill.root.innerHTML = note.innerHTML; // eller istället för notes.data använd note.innerhtml (samma sak)
  });

  noteList.push(notes);

  /* let deleteButton = document.createElement("button");   //skapa raderaknapp
  deleteButton.className = "delete-button"; // ger knapp en klass för att kunna styla det 
  deleteButton.setAttribute("onclick", "removeElement(" + notes.id + ")"); //ger knapp specifikt ID och kör funktion vid klick 
  let textdeleteButton = document.createTextNode("X");  //ger radera knapp ett innehåll 
  deleteButton.appendChild(textdeleteButton);   //slår ihop knappen med innehållet 
  note.appendChild(deleteButton);   //lägger knappen i div (newnote)  */
  renderNotes();
};

function renderNotes() {  // loopar igenom notes och ser till så att rätt anteckning är kopplad till rätt notes objekt.
  let note = document.querySelector(".note");
  noteList.forEach(function (notes) {
    note.innerHTML = notes.data;
    console.log(notes)
  })
};

// Fabian
//Visa/göm SettingsElementet (SideNav) med hjälp av en knapp
var showBtn = document.getElementById("showHideBtn");
showBtn.onclick = function () { showHideFunction() };

function showHideFunction() {
  var sideNav = document.querySelector("#sideNav");

  if (sideNav.style.display === "inline-block") {
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
btn.onclick = function () {  // When the user clicks the button, open the modal 
  modal.style.display = "block";
}
span.onclick = function () { // When the user clicks on <span> (x), close the modal
  modal.style.display = "none";
}
window.onclick = function (event) { // When the user clicks anywhere outside of the modal, close it
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Print-knapp - Malin 
printDiv = function (divName) {
  let printContents = quill.root.innerHTML;
  let originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  //  document.body.innerHTML = originalContents;
  location.reload();
}
