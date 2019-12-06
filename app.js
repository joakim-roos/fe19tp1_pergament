let quill = new Quill('#editor-container', {
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['image'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
      [{ 'font': [] }],
      ['clean']
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
var deletedMode = false;
var tempCont = document.createElement("div"); //temporär icke-existerande div för quill2HTML
var darkMode;
/* sideBar = document.addEventListener('click', (event.target) => {
  //if statements for each button in innersidebar, event.target.contains('knappis')
}); */


//////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////FUNKTIONER/////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

function Id2Object(n) {
  var i;
  for (i = 0; i < noteList.length; i++) {
    if (noteList[i].id == n) {
      return (noteList[i]);
    };
  };
};

function defaultArray() {
  defArray = [];
  noteList.forEach(function (def) {
    if (def.deleted == false) {
      defArray.push(def);
    }
  });
  return defArray;
};

function favouriteArray() {
  favArray = [];
  noteList.forEach(function (fav) {
    if (fav.favourite == true && fav.deleted != true) {
      favArray.push(fav);
    }
  });
  return favArray;
};

function deletedArray() {
  delArray = [];
  noteList.forEach(function (del) {
    if (del.deleted == true) {
      delArray.push(del);
    }
  });
  return delArray;
};



const SymbolHash = {
  a: 20,
  b: 18,
  c: 20,
  d: 18,
  e: 20,
  f: 32,
  g: 18,
  h: 18,
  i: 40,
  j: 40,
  k: 18,
  l: 40,
  m: 12,
  n: 18,
  o: 18,
  p: 18,
  q: 18,
  r: 30,
  s: 20,
  t: 34,
  u: 18,
  v: 20,
  w: 14,
  x: 20,
  y: 20,
  z: 22,
  A: 15,
  B: 15,
  C: 15,
  D: 15,
  E: 16,
  F: 18,
  G: 14,
  H: 15,
  I: 40,
  J: 20,
  K: 15,
  L: 18,
  M: 13,
  N: 15,
  O: 14,
  P: 16,
  R: 14,
  S: 16,
  T: 18,
  U: 15,
  V: 16,
  W: 12,
  X: 16,
  Y: 16,
  Z: 18
}



function Symbol2Width(symbol) {
  var width;
  width = SymbolHash[symbol];
  if (width == undefined) {
    width = 20;
  }
  width = 100 / width;
  return width
}

function textUpdate(note) {
  let noteDiv = document.querySelector(`div[id="${note.id}"]`);

  let r = 0;
  let i = 0;
  let tempTitle = "";
  let n = "";
  let max = 100;

  while (r < max) {
    n = note.title[i]
    if (n == undefined) {
      break;
    }
    //console.log(n);
    r += Symbol2Width(n);
    tempTitle += n;
    i += 1;
    //console.log(r);
  }
  if (r >= max) {
    tempTitle += "..."
  }

  noteDiv.childNodes[0].innerHTML = tempTitle;


  r = 0;
  i = 0;
  let tempPre = "";
  n = "";
  max = 110

  while (r < max) {
    n = note.preview[i]
    if (n == undefined) {
      break;
    }
    //console.log(n);
    r += Symbol2Width(n);
    tempPre += n;
    i += 1;
    //console.log(r);
  }
  if (r >= max) {
    tempPre += "..."
  }

  noteDiv.childNodes[1].innerHTML = tempPre;
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////FUNKTIONER/////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////




window.addEventListener('DOMContentLoaded', () => {

  darkMode = (localStorage.getItem("darkmode") || false) === "true";
  setDarkMode();

  loadNotes();
  if (noteList.length > 0) {
    //console.log(noteList);
    noteList.filter(note => !note.deleted).forEach(renderNote);
    activeNote(noteList[0]);
    console.log('DOM fully loaded');
    //  createQuillTemplate();
  };
});


/////////////// EVENT LISTENER FÖR HELA LEFT-SECTION /////////////////
const sideBarNotes = document.querySelector(".noteSection");
sideBarNotes.addEventListener('click', function (event) {
  var targetNote = event.target.closest("div").id;

  if (event.target.classList.contains("addNoteSvg") || event.target.classList.contains("addNote")) {
    addNote();
  }
  if (event.target.classList.contains("del-button-note") || event.target.classList.contains("del-icon-note")) {
    deleteNote(targetNote);
    event.target.closest('div').remove();
    // console.log("deleteNote, ran from new eventlistener");
  }
  if (event.target.classList.contains("fav-button-note") || event.target.classList.contains("fav-icon-note")) {
    favouriteNote(targetNote);
    //  console.log("favouriteNote, ran from new eventlistener");
  }
}, false);

// const searchNotes = document.querySelector('.searchNotes');
// searchNotes.addEventListener('click', function (event) {

// }, false);

function renderNote(notes) { // obs notes är singular: ett noteobjekt //laddar en anteckning. 
  let allNotes = document.getElementById('innerSideBar');
  let note = document.createElement('div');
  let title = document.createElement('p');
  let preview = document.createElement('p');
  let topOfList = allNotes.children[0];
  note.className = 'note';
  title.className = 'noteTitle';
  preview.className = 'notePreview';
  note.setAttribute('id', notes.id)
  note.appendChild(preview);
  note.insertBefore(title, preview);
  //note.addEventListener('click', swapNote);
  title.innerHTML += notes.title;
  preview.innerHTML += notes.preview;
  if (noteList.filter(note => note.id == notes.id).length < 1) {
    allNotes.insertBefore(note, topOfList)
  } else {
    allNotes.appendChild(note)
  }

  //allNotes.insertBefore(note, topOfList); //.nextsibling
  //console.log(allNotes.children[1]);
  note.addEventListener('click', swapNote);
  displayDate(notes); // visar datum och tid i anteckningen
  createFavouriteButton(note, notes);
  createDeletedButton(note, notes);
  textUpdate(notes);
};

function createDeletedButton(note, notes) { //funktion som skapar en delete-knapp. Kallas i renderNote.
  let button = document.createElement('button');
  let date = note.querySelector('.pDate')
  let img = document.createElement('img');
  button.className = 'del-button-note';
  // button.setAttribute('onclick', 'deleteNote(' + notes.id + ')');
  if (notes.deleted == true) {
    img.src = 'img/delete-fill.svg';
  } else {
    img.src = 'img/delete-note.svg';
  };
  img.className = 'del-icon-note';
  note.insertBefore(button, date);
  button.appendChild(img);
};

function createFavouriteButton(note, notes) { //funktion som skapar en favorite-knapp. Kallas i renderNote.
  let button = document.createElement('button');
  let date = note.querySelector('.pDate')
  let img = document.createElement('img');
  button.id = 'fav-button-note';
  // button.setAttribute('onclick', 'favouriteNote(' + notes.id + ')');
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
    //console.log('localstorage empty')
    //  createQuillTemplate();
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


quill.on('text-change', autoUpdate);


function autoUpdate() { //uppdaterar selectedNote på text-change. 
  var data = quill.getContents();
  if (selectedNote) {
    selectedNote.data = data;
    let s = quill.getText().split("\n");
    selectedNote.title = s[0];
    //console.log("P count: "+s[0].length);
    selectedNote.preview = s[1];
    textUpdate(selectedNote);
    saveNotes();
  };
};

/* function update() { //uppdaterar selectedNote på text-change. 
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
}; */

/* function updatePreview(note) { //uppdaterar objektets preview. 
  note = document.querySelector(`div[id="${selectedNote.id}"]`);
  let dots = "..."
  //console.log(note.childNodes)
  note.childNodes[1].innerHTML = selectedNote.preview + dots;
}; */

/* function updateTitle(note) { //uppdaterar titlen
  note = document.querySelector(`div[id="${selectedNote.id}"]`);
  let dots = "..."
  note.childNodes[0].innerHTML = selectedNote.title + dots;
}; */


/* function activeNote(targetNote) {
  selectedNote = targetNote;
  if (typeof selectedNote != "undefined") {
    var noteDiv = document.getElementById(selectedNote.id);
    if (noteDiv != null) {
      noteDiv.style.backgroundColor = "whitesmoke"; //styling så du ser vilken du valt, bör ändras
      noteDiv.style.borderLeft = "7px solid darkcyan";
      quill.setContents(selectedNote.data);
    };
  };
}; */

function activeNote(targetNote) {
  selectedNote = targetNote;
  setHighlight(targetNote.id);
  //console.log("ran")
};

function setHighlight(targetID) {
  let notes = document.querySelectorAll('.note');
  for (i = 0; i < notes.length; i++) {
    //console.log("loop: " + notes[i].id)
    if (Number(targetID) === Number(notes[i].id)) {
      notes[i].classList.add('selected')
      quill.setContents(selectedNote.data);
    } else {
      notes[i].classList.remove('selected')
    }
  }
};

function swapNote(event) {   //click funktion- när man klickar på en anteckningen syns det man skrivit i quillen
  //console.log(document.getElementById(event.target.id).innerHTML); //de här raderna har buggar
  //console.log(Id2Object(event.target.id).data); //samma här, buggar
  var targetNote = Id2Object(event.target.closest("div").id);
  //console.log(targetNote);
  // if (event.target.classList.contains('del-icon-note')) { //Borttagen pga den nya eventlistenern (??)
  //   console.log(event.target)
  //   event.target.closest('div').remove();
  // };

  if (typeof targetNote != "undefined") {
    if (targetNote != selectedNote) {
      selectedNote.data = quill.getContents();

      if ((favouriteMode == true && favouriteArray().indexOf(targetNote) == -1) ||
        (deletedMode == true && deletedArray().indexOf(targetNote) == -1)) {

      } else {
        activeNote(targetNote);
        //console.log(targetNote + "in swapnote")
        //console.log("activenote in swapnote ran")
      }
    }
  } else console.log("For some reason, event was undefined. (Swapnote-function)");
};

// let addNoteButton = document.querySelector('.addNote');
// addNoteButton.onclick = function () {
//   addNote();
// };

function renderAllNotes() {
  let innerSideBar = document.querySelector('#innerSideBar');
  // innerSideBar.innerHTML = `<div class="searchNotes">
  //                   <input type="search" name="searchNote" id="searchInput" placeholder="search notes..">
  //                   <button class="addNote">
  //                       <img src="img/edit-regular.svg" class="addNoteSvg" alt="Add Note">
  //                   </button>
  //               </div>`;
  // enableSearch();
  innerSideBar.innerHTML = ""
  // let addNoteButton = document.querySelector('.addNote'); //Tas bort och fixas när vi lägger till en global eventlisterner på innersidebar??
  // addNoteButton.onclick = function () {
  //   addNote();
  // };

  /* noteList.forEach(renderNote); */
  for (let i = 0; i < noteList.length; i++) {
    if (noteList[i].deleted === false)
      renderNote(noteList[i]);
    //console.log(noteList[i]);
  }

  let a = defaultArray();
  a.forEach(function (n) {
    textUpdate(n);
  });


  let tempNote = a[0];
  //console.log(defaultArray());
  //console.log(tempNote);
  activeNote(tempNote);
};

function renderSearchedNotes() {
  let innerSideBar = document.querySelector('#innerSideBar');
  // innerSideBar.innerHTML = `<div class="searchNotes">
  //                   <input type="search" name="searchNote" placeholder="search notes..." id="searchInput" value="${searchString}" onfocus="this.selectionStart = this.selectionEnd = this.value.length;">
  //                   <button class="addNote">
  //                       <img src="img/edit-regular.svg" class="addNoteSvg" alt="Add Note">
  //                   </button>
  //               </div>`;
  // enableSearch();
  innerSideBar.innerHTML = ""
  // let addNoteButton = document.querySelector('.addNote'); //Tas bort och fixas när vi lägger till en global eventlisterner på innersidebar??
  // addNoteButton.onclick = function () {
  //   addNote();
  // };

  if (favouriteMode) {
    favouriteButton.classList.toggle("favActive");
    favouriteMode = false;
  }
  if (deletedMode) {
    deletedButton.classList.toggle("delActive");
    deletedMode = false;
  }

  let foundArray = [];

  if (searchString == "") {
    foundArray = defaultArray();
  }
  else {
    for (let i = 0; i < noteList.length; i++) {
      //console.log(noteList[i].data.ops)
      let ops = noteList[i].data.ops;
      for (let j = 0; j < ops.length; j++) {
        try {
          if (ops[j].insert.toLowerCase().includes(searchString)) {
            //console.log("match found" + noteList[i].id)
            foundArray.push(noteList[i]);
            //renderNote(noteList[i]);
            //console.log(noteList[i]);
            break;
          }
        }
        catch{

        }
      }
    }
  }

  foundArray.forEach(function (term) {
    renderNote(term);
  });
  //console.log(foundArray[0])
  activeNote(event.target.closest("div").id);
};

function enableSearch() {
  textSearch = document.querySelector('#searchInput');
  textSearch.addEventListener('input', (event) => {
    //console.log("yo")
    searchString = textSearch.value.toLowerCase();
    renderSearchedNotes();
    //console.log(searchString)
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
    deleted: deletedMode
  };
  renderNote(notes);
  noteList.unshift(notes);
  activeNote(notes);
  //console.log(notes.id);
  firstNote();
  saveNotes();
  //renderAllNotes();
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
    setActiveNote(noteList[0]); //fixes utifall att du tar bort active note
    //console.log("removed selected");
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
  // let printContents = quill.root.innerHTML;
  // document.body.innerHTML = printContents;
  window.print();
  // location.reload();
};

//DISPLAYA NÄR ANTECKNINGEN SKAPADES | se efter setContent och getContent
function displayDate(notes) {
  let note = document.querySelector(`div[id = "${notes.id}"]`);
  var d = new Date(notes.id);
  var date = d.toLocaleString();
  var pDateId = document.createElement("p");
  note.appendChild(pDateId);
  pDateId.className = "pDate";
  pDateId.innerHTML = date;
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
        activeNote(favArray[0]);
      }
    }
  }
  saveNotes();
};

function toggleFavouriteButton() { //funktion som endast visar anteckningar som har favourite.true. Ej klar än.
  favouriteButton.classList.toggle("favActive");
  favouriteMode = !favouriteMode;

  if (deletedMode) { deletedButton.classList.toggle("delActive"); }
  deletedMode = false;
  if (favouriteButton.classList.contains('favActive')) {
    showOnlyFavourites();
    let a = favouriteArray();
    a.forEach(function (n) {
      textUpdate(n);
    });
  } else {
    //noteList.filter(note => note.favourite === false && note.deleted === false).forEach(renderNote);
    //noteList.filter(note => !note.deleted).forEach(renderNote);
    renderAllNotes();
  }
};

function showOnlyFavourites() {
  let allNotes = document.querySelector('#innerSideBar');
  // allNotes.innerHTML = `<div class="searchNotes">
  //               <input type="search" name="searchNote" id="searchInput" placeholder="search notes..">
  //               <button class="addNote">
  //                   <img src="img/edit-regular.svg" class="addNoteSvg" alt="Add Note">
  //               </button>
  //           </div>`;
  allNotes.innerHTML = ""
  // let addNoteButton = document.querySelector('.addNote');   //Tas bort och fixas när vi lägger till en global eventlisterner på innersidebar??
  // addNoteButton.onclick = function () {
  //   addNote();
  // };

  enableSearch()

  noteList.filter(note => note.favourite === true && note.deleted !== true).forEach(renderNote);

  favArray = favouriteArray();
  if (favArray.length > 0) {
    activeNote(favArray[0]);
  };

  /*   let onlyFavs = filterNotes(showFavourites);
  onlyFavs.forEach(function (note) {
    renderNote(note);
  });
  function filterNotes(func = () => true) { //function som return true
    let filtered = noteList.filter(func)
    return filtered;
  }; */
};

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
  deletedMode = !deletedMode;

  if (favouriteMode) { favouriteButton.classList.toggle("favActive"); }
  favouriteMode = false;
  //star.classList.toggle("starActive");
  if (deletedButton.classList.contains('delActive')) {
    showOnlyDeleted();
    let a = deletedArray();
    a.forEach(function (n) {
      textUpdate(n);
    });
  } else {
    //console.log(noteList.forEach(noteList.deleted));
    //noteList.filter(note => note.favourite === false && note.deleted === false).forEach(renderNote);
    //noteList.filter(note => note.deleted === false).forEach(renderNote);
    renderAllNotes();
  };
};

function showOnlyDeleted() {
  let allNotes = document.querySelector('#innerSideBar');
  // allNotes.innerHTML = `<div class="searchNotes">
  //               <input type="search" name="searchNote" id="searchInput" placeholder="search notes..">
  //               <button class="addNote">
  //                   <img src="img/edit-regular.svg" class="addNoteSvg" alt="Add Note">
  //               </button>
  //           </div>`;
  allNotes.innerHTML = ""
  // let addNoteButton = document.querySelector('.addNote');   //Tas bort och fixas när vi lägger till en global eventlisterner på innersidebar??
  // addNoteButton.onclick = function () {
  //   addNote();
  // };

  enableSearch()

  noteList.filter(note => note.deleted === true).forEach(renderNote);

  delArray = deletedArray();
  if (delArray.length > 0) {
    activeNote(delArray[0]);
  };
  /* 
    let onlyDeleted = filterNotes(showDeleted);
    onlyDeleted.forEach(function (note) {
      renderNote(note);
    });
  
    function filterNotes(func = () => true) { //function som return true
      //console.log(func(1));
      let filtered = noteList.filter(func)
      return filtered;
    }; */
};

//////////////////////


//Mall i quill (Malin)
// function createQuillTemplate() {
//   let toolbar = document.getElementsByClassName("ql-toolbar")[0]
//   let template = document.createElement("span");
//   template.className = "ql-formats";
//   var templateButton = document.createElement("button");
//   templateButton.textContent = "Mall2";
//   template.appendChild(templateButton);
//   templateButton.className = "ql-picker-label";
//   toolbar.appendChild(template);
//   templateButton.addEventListener('click', formTemplate)
// };

// function formTemplate() {
//   quill.setSelection(0, quill.getLength());
//   quill.format('underline', true);
//   quill.format('align', 'center');
//   quill.format('color', 'red');
//   quill.format('list', 'ordered');
//   quill.format('size', 'large');
//   quill.format('backgroundcolor', 'beige');
// }













///////////Dark mode moon moonBtn
////////// DELETED BUTTON ////////////
darkModeButton = document.querySelector(".darkmode");
darkModeButton.addEventListener('click', toggleDarkMode);

function setDarkMode() {
  //console.log("dm mode:" +darkMode);

  let darkArray = ["body", "#innerSideBar",];
  if (darkMode == false) {
    //console.log("true"+darkMode);
    darkArray.forEach(function (obj) {
      document.querySelector(obj).classList.add("dark");
    });
  }
  else {
    //console.log("false"+darkMode);
    darkArray.forEach(function (obj) {
      document.querySelector(obj).classList.remove("dark");
    });
  }
}

function toggleDarkMode() {
  darkMode = !darkMode;
  localStorage.setItem("darkmode", darkMode);

  setDarkMode();
}
