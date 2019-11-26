let quill = new Quill('#editor-container', {
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['image'],
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
var favouriteMode = false;
var tempCont = document.createElement("div"); //temporär icke-existerande div för quill2HTML
/* sideBar = document.addEventListener('click', (event.target) => {
  //if statements for each button in innersidebar, event.target.contains('knappis')
}); */

window.addEventListener('DOMContentLoaded', () => {
  loadNotes();
  if (noteList.length > 0) {
    //console.log(noteList);
    noteList.filter(note => !note.deleted).forEach(renderNote);
    setActiveNote(noteList[noteList.length - 1]);
    console.log('DOM fully loaded');
    createQuillTemplate();
  };
});

function renderNote(notes) { // obs notes är singular: ett noteobjekt //laddar en anteckning. 
  let allNotes = document.getElementById('innerSideBar');
  let note = document.createElement('div');
  let title = document.createElement('p');
  let preview = document.createElement('p');
  let topOfList = allNotes.children[1];
  note.className = 'note';
  title.className = 'noteTitle';
  preview.className = 'notePreview';
  note.setAttribute('id', notes.id)
  note.appendChild(preview);
  note.insertBefore(title, preview);
  //note.addEventListener('click', swapNote);
  title.innerHTML += notes.title;
  preview.innerHTML += notes.preview;
  allNotes.insertBefore(note, topOfList); //.nextsibling
  console.log(allNotes.children[1]);
  note.addEventListener('click', swapNote);
  displayDate(notes); // visar datum och tid i anteckningen
  createFavoriteButton(note, notes);
  createDeletedButton(note, notes);
};

function createDeletedButton(note, notes) { //funktion som skapar en delete-knapp. Kallas i renderNote.
  let button = document.createElement('button');
  let date = document.querySelector('.pDate')
  let img = document.createElement('img');
  button.className = 'del-button-note';
  button.setAttribute('onclick', 'deleteNote(' + notes.id + ')');
  img.src = 'img/delete-note.svg';
  img.className = 'del-icon-note';
  note.insertBefore(button, date);
  button.appendChild(img);
};

function createFavoriteButton(note, notes) { //funktion som skapar en favorite-knapp. Kallas i renderNote.
  let button = document.createElement('button');
  let date = document.querySelector('.pDate')
  let img = document.createElement('img');
  button.id = 'fav-button-note';
  button.setAttribute('onclick', 'favouriteNote(' + notes.id + ')');
  if (notes.favourite == true) {
    img.src = "img/star-fill.svg";
  } else {
    img.src = 'img/star-note.svg';
  };
  img.className = 'fav-icon-note';
  note.insertBefore(button, date);
  button.appendChild(img);
};

function loadNotes() { // laddar local storage. 
  let data = localStorage.getItem('note');
  if (data) {
    noteList = JSON.parse(data);
  } else {
    console.log('localstorage empty')
    createQuillTemplate();
    firstPopup(); //so the help popup only auto-renders when notelist is empty. 
  };
};

function firstPopup() {
  if (noteList.length !== 1) {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
    body.classList.toggle("backgroundBlur");
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
    selectedNote.preview = quill.getText(25, 60);
    selectedNote.title = quill.getText(0, 25);
    //note.innerHTML += selectedNote.preview;
    updatePreview();
    updateTitle()
    saveNotes();
  };
};

function updatePreview(note) { //uppdaterar objektets preview. 
  note = document.querySelector(`div[id="${selectedNote.id}"]`);
  let dots = "..."
  //console.log(note.childNodes)
  note.childNodes[1].innerHTML = selectedNote.preview + dots;
};

function updateTitle(note) { //uppdaterar titlen
  note = document.querySelector(`div[id="${selectedNote.id}"]`);
  let dots = "..."
  note.childNodes[0].innerHTML = selectedNote.title + dots;
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

function activeNote(targetNote) {
  selectedNote = targetNote;
  if (typeof selectedNote != "undefined") {
    var noteDiv = document.getElementById(selectedNote.id);
    if (noteDiv != null) {
      noteDiv.style.backgroundColor = "whitesmoke"; //styling så du ser vilken du valt, bör ändras
      noteDiv.style.borderLeft = "7px solid darkcyan";
      quill.setContents(selectedNote.data);
    };
  };
};

function setActiveNote(targetNote) {
  if (selectedNote !== null && typeof selectedNote !== "undefined") {
    document.getElementById(selectedNote.id).style.backgroundColor = "rgb(233, 233, 233)"; //återställ styling på fd vald note
    document.getElementById(selectedNote.id).style.borderLeft = "7px solid rgb(233, 233, 233)";
    console.log("setActiveNote Ran 1")
  };
  activeNote(targetNote);
};

function swapNote(event) {   //click funktion- när man klickar på en anteckningen syns det man skrivit i quillen
  //console.log(document.getElementById(event.target.id).innerHTML); //de här raderna har buggar
  //console.log(Id2Object(event.target.id).data); //samma här,buggar
  var targetNote = Id2Object(event.target.closest("div").id);
  /*   let deleted = document.querySelector('.del-icon-note');
    // if event.target.contains('del-note' eller fav-note)
    if (event.target.contains(deleted)) {
      console.log("deletedbutton pressed")
    }; */
  if (typeof targetNote != "undefined") {
    if (targetNote != selectedNote) {
      selectedNote.data = quill.getContents();

      if (favouriteMode == true && favouriteArray().indexOf(targetNote) == -1) {
        //foo()
      } else {
        try { setActiveNote(targetNote); }
        catch { activeNote(targetNote); }
      }
    }
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
  enableSearch();
  let addNoteButton = document.querySelector('.addNote'); //Tas bort och fixas när vi lägger till en global eventlisterner på innersidebar??
  addNoteButton.onclick = function () {
    addNote();
  };

  /* noteList.forEach(renderNote); */
  for (let i = 0; i < noteList.length; i++) {
    renderNote(noteList[i]);
    //console.log(noteList[i]);
  }
  setActiveNote(noteList[noteList.length - 1]);
};

function renderSearchedNotes() {
  let innerSideBar = document.querySelector('#innerSideBar');
  innerSideBar.innerHTML = `<div class="searchNotes">
                    <input type="search" name="searchNote" placeholder="search notes..." id="searchInput" value="${searchString}" onfocus="this.selectionStart = this.selectionEnd = this.value.length;">
                    <button class="addNote">
                        <img src="img/edit-regular.svg" class="addNoteSvg" alt="Add Note">
                    </button>
                </div>`;
  enableSearch();

  let addNoteButton = document.querySelector('.addNote'); //Tas bort och fixas när vi lägger till en global eventlisterner på innersidebar??
  addNoteButton.onclick = function () {
    addNote();
  };

  for (let i = 0; i < noteList.length; i++) {
    //console.log(noteList[i].data.ops)
    let ops = noteList[i].data.ops;
    for (let j = 0; j < ops.length; j++) {
      if (ops[j].insert.toLowerCase().includes(searchString)) {
        //console.log("match found" + noteList[i].id)
        renderNote(noteList[i]);
        break;
        //console.log(noteList[i]);
      }
    }
  }
  activeNote(event);
};

function enableSearch() {
  textSearch = document.querySelector('#searchInput');
  textSearch.addEventListener('input', (event) => {
    console.log("yo")
    searchString = textSearch.value.toLowerCase();
    renderSearchedNotes();
    console.log(searchString)
    //renderAllNotes(); Doesn't work. Seems to render once and then stops. eventlisterner 'keyup' stops as well. 
  });
  textSearch.focus();
};
enableSearch();


function addNote() {
  let notes = {    //objekt som skapas. Innehåller ID , data (texten), och andra properties vi behöver senare. ett objekt = en anteckning.
    id: Date.now(),
    title: "",
    preview: "",
    data: quill.getContents(),
    favourite: favouriteMode,
    deleted: false
  };
  renderNote(notes);
  noteList.push(notes);
  //tömmer editorn på text när man trycker på add note. 
  try { setActiveNote(notes); }
  catch { activeNote(notes); }
  firstNote();
  saveNotes(); //sparar i Local Storage
};

function firstNote() {
  if (noteList.length !== 1) {
    quill.deleteText(0, quill.getLength());
  };
};

function deleteSelectedNote(id) {
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
window.addEventListener("click", function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    body.classList.toggle("backgroundBlur");
  }
});


printDiv = function () {
  let printContents = quill.root.innerHTML;
  console.log(printContents);
  document.body.innerHTML = printContents;
  (console.log(document.body.innerHTML));
  window.print();
  location.reload();
};

//DISPLAYA NÄR ANTECKNINGEN SKAPADES | se efter setContent och getContent
function displayDate(notes) {
  let note = document.querySelector(`div[id = "${notes.id}"]`);
  // let child = allNotes.firstChild;
  var d = new Date(notes.id);
  var date = d.toLocaleString();
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


////////// FAVOURITE BUTTONS ////////////
favouriteButton = document.querySelector("#favouriteBtn");
favouriteButton.addEventListener('click', toggleFavouriteButton);

const showFavourites = (note) => note.favourite === true;

function favouriteNote(id) {
  //let button = document.querySelector('#fav-button-note');
  let img = event.target;
  let note = Id2Object(id);
  note.favourite = !note.favourite;
  if (note.favourite == true) {
    img.src = "img/star-fill.svg";
  } else {
    img.src = "img/star-note.svg"
    if (favouriteMode == true) {
      showOnlyFavourites();
      let favArray = favouriteArray();
      if (favArray.length > 0) {
        activeNote(favArray[favArray.length - 1]);
      }
    }
  }
  saveNotes();
};

function toggleFavouriteButton() { //funktion som endast visar anteckningar som har favourite.true. Ej klar än.
  favouriteButton.classList.toggle("favActive");
  favouriteMode = !favouriteMode;
  //star.classList.toggle("starActive");
  if (favouriteButton.classList.contains('favActive')) {
    showOnlyFavourites();
  } else {
    renderAllNotes();
  }
};

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

  enableSearch()

  let onlyFavs = filterNotes(showFavourites);
  onlyFavs.forEach(function (note) {
    renderNote(note);
  });
  function filterNotes(func = () => true) { //function som return true
    let filtered = noteList.filter(func)
    return filtered;
  };
  favArray = favouriteArray();
  if (favArray.length > 0) {
    activeNote(favArray[favArray.length - 1]);
  }
};

function favouriteArray() {
  favArray = [];
  noteList.forEach(function (fav) {
    if (fav.favourite == true) {
      favArray.push(fav);
    }
  });
  return favArray;
};

//////////////////////

////////// DELETED BUTTON ////////////
deletedButton = document.querySelector("#deletedBtn");
deletedButton.addEventListener('click', toggleDeletedButton);
const showDeleted = (note) => note.deleted === true;

function deleteNote(id) {
  //let button = document.querySelector('#fav-button-note');
  let img = event.target;
  let note = Id2Object(id);
  note.deleted = !note.deleted;
  if (note.deleted == true) {
    img.src = "img/delete-fill.svg";
  } else {
    img.src = "img/delete-note.svg"
  }
  saveNotes();
};

function toggleDeletedButton() { //funktion som endast visar anteckningar som har favourite.true. Ej klar än.
  deletedButton.classList.toggle("delActive");
  //star.classList.toggle("starActive");
  if (deletedButton.classList.contains('delActive')) {
    showOnlyDeleted();
  } else {
    renderAllNotes();
  }
};

function showOnlyDeleted() {
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

  enableSearch()

  let onlyDeleted = filterNotes(showDeleted);
  onlyDeleted.forEach(function (note) {
    renderNote(note);
  });

  function filterNotes(func = () => true) { //function som return true
    //console.log(func(1));
    let filtered = noteList.filter(func)
    return filtered;
  };
  setActiveNote(noteList[noteList.length - 1]);
};

//////////////////////


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