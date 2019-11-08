
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
var selectedNote=null;
var tempCont=document.createElement("div"); //temporär icke-existerande div för quill2HTML

function Id2Object(n){
  var i;
  for (i=0;i<noteList.length;i++){
    if (noteList[i].id==n){
      return(noteList[i]);
    }
  }
}

function quill2HTML(input) {
  (new Quill(tempCont)).setContents(input);
  return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
}

function NoteData2HTML(noteObj){
  var s=('<button class="delete-button" onclick="deleteNote('+noteObj.id+')">X'+'</button>'+
  //"<h1>DICK</h1>"+
  quill2HTML(noteObj.data));
  return s
};

function setActiveNote(targetNote){

  if(selectedNote!=null && typeof selectedNote!="undefined"){
    document.getElementById(selectedNote.id).style.backgroundColor ="whitesmoke"; //återställ styling på fd vald note
  }

  selectedNote=targetNote;
  if(typeof selectedNote!="undefined"){
    var noteDiv=document.getElementById(selectedNote.id);
    if(noteDiv!=null){
      noteDiv.style.backgroundColor ="red"; //styling så du ser vilken du valt, bör ändras
    };
  };
};


function swapNote (event) {   //click funktion- när man klickar på en anteckningen syns det man skrivit i quillen
  //console.log(document.getElementById(event.target.id).innerHTML); //de här raderna har buggar
  //console.log(Id2Object(event.target.id).data); //samma här,buggar

  var targetNote=Id2Object(event.target.id);
  if(typeof targetNote!="undefined"){
    console.log(selectedNote);
    console.log(targetNote);


    if(targetNote!=selectedNote){
      selectedNote.data=quill.getContents();
      quill.setContents(targetNote.data);

      var c=document.getElementById(selectedNote.id);
      c.innerHTML=NoteData2HTML(selectedNote);  //den här raden verkar också ge errors

      setActiveNote(targetNote);
    
    };
  }
  else{
    console.log("For some reason, event was undefined.");

  }

  //renderNotes();

  //quill.root.innerHTML = note.innerHTML; // eller istället för notes.data använd note.innerhtml (samma sak)
}

addNewNote.onclick = function () {
  addNote();
}
function addNote() {
  let notes = {    //objekt som skapas. Innehåller ID , data (texten), och andra properties vi behöver senare. ett objekt = en anteckning.
    id: Date.now(),
    title: "TEST",
    data: "", //{(quill delta)}, // "<html>",
    favourite: false,
    deleted: false
  };
  let allNotes = document.getElementById("innerSideBar");
  let child = allNotes.firstChild;
  let note = document.createElement("div");

  note.className = "note";
  //malin raderaknapp
  note.setAttribute('id', notes.id) //ger anteckningen ett ID

  var deleteButton = document.createElement("button"); //skapar en knapp
  var txtDeleteBtn = document.createTextNode("X"); // döper knappen till X
  deleteButton.appendChild(txtDeleteBtn); //lägger ihop X:et med knappen
  deleteButton.className = "delete-button"; //ger knappen en klass för styling i css
  deleteButton.setAttribute("onclick", "deleteNote(" + notes.id + ")") //säger att funktionen ska köras när knappen klickas på


     // (Fabian) TODO: Använd en egen funktion som deklareras någon annan stans. Kalla på funktionen i addNote()
     //DISPLAYA NÄR ANTECKNINGEN SKAPADES | se efter setContent och getContent
        // Skapa ett element där ID:t ska skrivas ut i diven. ex: var pDateId = document.createElement("p")
          // ge den ett classname (för styling)    pDateId.className = "pDate"
            // insert adjacent      pDateId.insertAdjacent(note, child)
              // använd getAttribute för att komma åt note.id
                // skriv ut note.id i paragrafen med hjälp av  quills getContent (  let date = new Date(setDateTime)  )
                  // pDateId.innerHTML = date (??)
                    // quill.Date (?)
  

  allNotes.insertBefore(note, child);
  //notes.data = quill.root.innerHTML;
  quill.deleteText(0, quill.getLength()); //tömmer canvas från symboler

  note.addEventListener('click', swapNote);

  noteList.push(notes);
  renderNotes();
  note.appendChild(deleteButton); //lägger in knappen i anteckningen 

  setActiveNote(notes); //ny rad för att definera senast skapad note
};

function renderNotes() {  // loopar igenom notes och ser till så att rätt anteckning är kopplad till rätt notes objekt.
  let note = document.querySelector(".note");
  noteList.forEach(function (notes) {
    note.innerHTML = notes.data;
    //console.log(notes)
  })
};
//Malin raderafunktion 
function deleteNote(xxx) {

  let note = document.querySelector(".note");//hämtar anteckning
  var toDelete = document.getElementById(xxx);//spar anteckningen i en variabel

  var i;
  var index;
  for (i=0;i<noteList.length;i++){
    if (noteList[i].id==xxx){
      index=i;
      break;
    }
  }
  noteList.splice(index,1);

  if(toDelete==document.getElementById(selectedNote.id)){
    setActiveNote(noteList[noteList.length-1]); //fixes utifall att du tar bort active note
    console.log("removed selected");
  }

  toDelete.parentNode.removeChild(toDelete);//tar bort anteckningen 
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