let quill = new Quill('#editor-container', {
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['image', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
    ]
  },
  placeholder: 'Write your note here..',
  theme: 'snow'  // or 'bubble'
});


const addNewNote = document.getElementById("newNoteBtn");
let noteList = []; //tom array för samtliga notes
var selectedNote = null;
let searchString = "";
var tempCont = document.createElement("div"); //temporär icke-existerande div för quill2HTML
/* sideBar = document.addEventListener('click', (event.target) => {
  //if statements for each button in innersidebar, event.target.contains('knappis')
}); */

window.addEventListener('DOMContentLoaded', () => {
  loadNotes();
  if (noteList.length > 0) {
    //console.log(noteList);
    noteList.forEach(renderNote);
    setActiveNote(noteList[noteList.length - 1]);
    console.log('DOM fully loaded');
    createQuillTemplate();

    // läs senast laddade ID fårn localstorage, använd array.find på notelist, hitta id som matchar, sätt actrivenote utifrån detta
  };
});

function renderNote(notes) { // obs notes är singular: ett noteobjekt //laddar en anteckning. 
  let allNotes = document.getElementById("innerSideBar");
  let note = document.createElement("div");
  let deleteButton = document.createElement("button");
  let txtDeleteBtn = document.createTextNode("X");
  note.className = "note";
  note.setAttribute('id', notes.id) //ger elementet ett ID
  let topOfList = allNotes.children[1]; ///////den här buggar när man klickar på toggle favourite

  deleteButton.appendChild(txtDeleteBtn); //lägger ihop X:et med knappen
  deleteButton.className = "delete-button"; //ger knappen en klass för styling i css
  deleteButton.setAttribute("onclick", "deleteNote(" + notes.id + ")") //säger att funktionen ska köras när knappen klickas på
  note.appendChild(deleteButton);

  note.addEventListener('click', swapNote);
  console.log(allNotes.children[1]);
  note.innerHTML += notes.preview;
  allNotes.insertBefore(note, topOfList); //.nextsibling
  displayDate(notes); // visar datum och tid i anteckningen
};

function loadNotes() { // laddar local storage. 
  let data = localStorage.getItem('note');
  if (data) {
    noteList = JSON.parse(data);
  } else {
    console.log("localstorage empty")
    createQuillTemplate();
    //För att pop up första gången man besöker sidan 
    /*    localStorage.setItem("note", JSON.stringify(noteList)); //borde vara en separat funktion eller något
       let modal = document.getElementById("myModal");
       modal.style.display = "block";
       body.classList.toggle("backgroundBlur"); */
  };
};

function saveNotes() { // sparar i local Storage
  localStorage.setItem('note', JSON.stringify(noteList));
};

quill.on('text-change', update);

function update() { //uppdaterar selectedNote på text-change. 
  var data = quill.getContents();
  if (selectedNote) {
    selectedNote.data = data;
    selectedNote.preview = quill.getText(0, 20);
    //note.innerHTML += selectedNote.preview;
    updatePreview();
    saveNotes();
  };
};

function updatePreview(note) { //uppdaterar objektets preview. 
  note = document.querySelector(`div[id="${selectedNote.id}"]`);
  note.childNodes[1].replaceWith(selectedNote.preview);
  //console.log("note id", selectedNote.id);
};

function Id2Object(n) {
  var i;
  for (i = 0; i < noteList.length; i++) {
    if (noteList[i].id == n) {
      return (noteList[i]);
    };
  };
};

/* function quill2HTML(input) { //används ej, men radera inte!
  (new Quill(tempCont)).setContents(input);
  return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
};

function NoteData2HTML(noteObj) { //används ej, men radera inte!
  var s = ('<button class="delete-button" onclick="deleteNote(' + noteObj.id + ')">X' + '</button>' +
    quill2HTML(noteObj.data));
  return s;
}; */

function setActiveNote(targetNote) {
  if (selectedNote != null && typeof selectedNote != "undefined") {
    document.getElementById(selectedNote.id).style.backgroundColor = "whitesmoke"; //återställ styling på fd vald note
  };
  selectedNote = targetNote;
  if (typeof selectedNote != "undefined") {
    var noteDiv = document.getElementById(selectedNote.id);
    if (noteDiv != null) {
      noteDiv.style.backgroundColor = "grey"; //styling så du ser vilken du valt, bör ändras
      quill.setContents(selectedNote.data);
    };
  };
};

function swapNote(event) {   //click funktion- när man klickar på en anteckningen syns det man skrivit i quillen
  //console.log(document.getElementById(event.target.id).innerHTML); //de här raderna har buggar
  //console.log(Id2Object(event.target.id).data); //samma här,buggar
  var targetNote = Id2Object(event.target.closest("div").id);
  if (typeof targetNote != "undefined") {
    if (targetNote != selectedNote) {
      selectedNote.data = quill.getContents();
      //quill.setContents(targetNote.data);
      //var c=document.getElementById(selectedNote.id);
      //c.innerHTML=NoteData2HTML(selectedNote);  //den här raden verkar också ge errors
      setActiveNote(targetNote);
    };
  } else console.log("For some reason, event was undefined. (Swapnote-function)");
};

let addNoteButton = document.querySelector('.addNote');
addNoteButton.onclick = function () {
  addNote();
};

function renderAllNotes() {
  let innerSideBar = document.querySelector('#innerSideBar');
  innerSideBar.innerHTML = `<div class="searchNotes">
                    <input type="search" name="searchNote" id="searchInput" placeholder="search notes..">
                    <button class="addNote">
                        <img src="img/edit-regular.svg" class="addNoteSvg" alt="Add Note">
                    </button>
                </div>`;

  let addNoteButton = document.querySelector('.addNote'); //Tas bort och fixas när vi lägger till en global eventlisterner på innersidebar??
  addNoteButton.onclick = function () {
    addNote();
  };
  textSearch = document.querySelector('#searchInput');
  textSearch.addEventListener('keydown', () => {
    searchString = textSearch.value.toLowerCase();
    console.log(searchString)
  });
  /*   loadNotes();
    if (noteList.length > 0) {
      noteList.forEach(renderNote);
      
    }; */

  for (let i = 0; i < noteList.length; i++) {
    //if (noteList[i].data.ops[0].insert.toLowerCase().includes(searchString)) {
    renderNote(noteList[i]);
    //console.log(noteList[i]);
  }
  setActiveNote(noteList[noteList.length - 1]);
};

/* function createFavourite(note) { //funktion som skapar en favorit-knapp. Kallas i renderNote.
  note = document.querySelector('.note');
  let button = document.createElement('button');
  let img = document.createElement('img');
  button.className = 'favouriteButton';
  img.className = 'heartImage';
  img.src = 'img/heart-regular.svg';
  note.appendChild(button);
  button.appendChild(img);
}; */

function addNote() {
  let notes = {    //objekt som skapas. Innehåller ID , data (texten), och andra properties vi behöver senare. ett objekt = en anteckning.
    id: Date.now(),
    title: "",
    preview: quill.getText(0, 20),
    data: quill.getContents(),
    favourite: false,
    deleted: false
  };
  renderNote(notes);
  noteList.push(notes);
  //tömmer editorn på text när man trycker på add note. 
  setActiveNote(notes); //ny rad för att definera senast skapad note
  firstNote();
  saveNotes(); //sparar i Local Storage

};

function firstNote() {
  if (noteList.length !== 1) {
    quill.deleteText(0, quill.getLength());
  };
};

function deleteNote(id) {
  var toDelete = document.getElementById(id);//spar anteckningen i en variabel
  var i;
  var index;
  for (i = 0; i < noteList.length; i++) {
    if (noteList[i].id == id) {
      index = i;
      break;
    };
  };
  noteList.splice(index, 1);
  if (toDelete == document.getElementById(selectedNote.id)) {
    setActiveNote(noteList[noteList.length - 1]); //fixes utifall att du tar bort active note
    console.log("removed selected");
  };
  toDelete.parentNode.removeChild(toDelete);//tar bort anteckningen 
  saveNotes();
};

var showBtn = document.getElementById("showHideBtn");
//showBtn.onclick = function () { showHideFunction() };
function showHideFunction() {
  var sideNav = document.querySelector("#sideNav");
  if (sideNav.style.display === "block") {
    sideNav.style.display = "none";
  } else {
    sideNav.style.display = "block";
  };
};

let modal = document.getElementById("myModal"); // första diven 
let btn = document.getElementById("helpBtn"); // Get the button that opens the modal
let span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal
let body = document.body;
btn.onclick = function () {  // When the user clicks the button, open the modal 
  modal.style.display = "block";
  body.classList.toggle("backgroundBlur");
};
span.onclick = function () { // When the user clicks on <span> (x), close the modal
  modal.style.display = "none";
  body.classList.toggle("backgroundBlur");
};
window.onclick = function (event) { // When the user clicks anywhere outside of the modal, close it
  if (event.target == modal) {
    modal.style.display = "none";
    body.classList.toggle("backgroundBlur");
  };
};

printDiv = function () {
  let printContents = quill.root.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  location.reload();
};

//DISPLAYA NÄR ANTECKNINGEN SKAPADES | se efter setContent och getContent
function displayDate(notes) {
  let note = document.querySelector(`div[id = "${notes.id}"]`);
  // let child = allNotes.firstChild;
  var d = new Date(notes.id);
  var date = d.toDateString();
  // Skapa ett element där ID:t ska skrivas ut i diven
  var pDateId = document.createElement("p");
  note.appendChild(pDateId);
  // ge den ett classname (för styling)
  pDateId.className = "pDate";
  //random styling
  //displayar tiden i det skapade elementet
  pDateId.innerHTML = date;
  //TODO: få datumet att displayas högst upp i diven
};


////////// FAVOURITE BUTTON ////////////

favouriteButton = document.querySelector("#favouriteBtn");
favouriteButton.addEventListener('click', toggleFavouriteButton);
//var star = document.querySelector(".fa-star");


function toggleFavouriteButton() { //funktion som endast visar anteckningar som har favourite.true. Ej klar än.
  favouriteButton.classList.toggle("favActive");
  //star.classList.toggle("starActive");
  if (favouriteButton.classList.contains('favActive')) {
    showOnlyFavourites();
  } else {
    renderAllNotes();
  }
};

const showFavourites = (note) => note.favourite === true;

function showOnlyFavourites() {
  let allNotes = document.querySelector('#innerSideBar');
  allNotes.innerHTML = `<div class="searchNotes">
                <input type="search" name="searchNote" id="searchInput" placeholder="search notes..">
                <button class="addNote">
                    <img src="img/edit-regular.svg" class="addNoteSvg" alt="Add Note">
                </button>
            </div>`;
  let addNoteButton = document.querySelector('.addNote');   //Tas bort och fixas när vi lägger till en global eventlisterner på innersidebar??
  addNoteButton.onclick = function () {
    addNote();
  };

  textSearch = document.querySelector('#searchInput');
  textSearch.addEventListener('keydown', (event) => {
    searchString = textSearch.value.toLowerCase();
    console.log(searchString)
  });

  let onlyFavs = filterNotes(showFavourites);
  onlyFavs.forEach(function (note) {
    renderNote(note);
  });

  function filterNotes(func = () => true) { //function som return true
    //console.log(func(1));
    let filtered = noteList.filter(func)
    return filtered;
  };
};

//////////////////////

////////// DELETED BUTTON ////////////

// const showDeleted = (note) => note.deleted === true; 

//////////////////////



////////// SEARCH FUNCTION ////////////

//searchNote = document.querySelector('#searchNote')

textSearch = document.querySelector('#searchInput');
textSearch.addEventListener('keydown', (event) => {
  searchString = textSearch.value.toLowerCase();
  console.log(searchString)
  //renderAllNotes(); Funkar ej
});


/*   for (i = 0, noteList.length > 0) {
     if (noteList[i].includes("str") {
       renderNote();
     }
   }; */
///////////////////////


//Mall i quill (Malin)
function createQuillTemplate() {
  let toolbar = document.getElementsByClassName("ql-toolbar")[0]
  let template = document.createElement("span");
  template.className = "ql-formats";
  var templateButton = document.createElement("button");
  templateButton.textContent = "Mall2";
  template.appendChild(templateButton);
  templateButton.className = "ql-picker-label";
  toolbar.appendChild(template);
  templateButton.addEventListener('click', formTemplate)
};

function formTemplate() {
  quill.setSelection(0, quill.getLength());
  quill.format('underline', true);
  quill.format('align', 'center');
  quill.format('color', 'red');
  quill.format('list', 'ordered');
  quill.format('size', 'large');
  quill.format('backgroundcolor', 'beige');
}