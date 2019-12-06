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
  theme: 'snow'
});


const addNewNote = document.getElementById("newNoteBtn");
let noteList = [];
var selectedNote = null;
let searchString = "";
var favouriteMode = false;
var deletedMode = false;
var tempCont = document.createElement("div");
var darkMode;


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

    r += Symbol2Width(n);
    tempTitle += n;
    i += 1;

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

    r += Symbol2Width(n);
    tempPre += n;
    i += 1;

  }
  if (r >= max) {
    tempPre += "..."
  }

  noteDiv.childNodes[1].innerHTML = tempPre;
};

window.addEventListener('DOMContentLoaded', () => {

  darkMode = (localStorage.getItem("darkmode") || false) === "true";
  setDarkMode();

  loadNotes();
  if (noteList.length > 0) {
    noteList.filter(note => !note.deleted).forEach(renderNote);
    activeNote(noteList[0]);
    console.log('DOM fully loaded');
  };
});


const sideBarNotes = document.querySelector(".noteSection");
sideBarNotes.addEventListener('click', function (event) {
  var targetNote = event.target.closest("div").id;

  if (event.target.classList.contains("addNoteSvg") || event.target.classList.contains("addNote")) {
    addNote();
  }
  if (event.target.classList.contains("del-button-note") || event.target.classList.contains("del-icon-note")) {
    deleteNote(targetNote);
    event.target.closest('div').remove();
  }
  if (event.target.classList.contains("fav-button-note") || event.target.classList.contains("fav-icon-note")) {
    favouriteNote(targetNote);
  }
}, false);

function renderNote(notes) {
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
  title.innerHTML += notes.title;
  preview.innerHTML += notes.preview;
  if (noteList.filter(note => note.id == notes.id).length < 1) {
    allNotes.insertBefore(note, topOfList)
  } else {
    allNotes.appendChild(note)
  }

  note.addEventListener('click', swapNote);
  displayDate(notes);
  createFavouriteButton(note, notes);
  createDeletedButton(note, notes);
  textUpdate(notes);
};

function createDeletedButton(note, notes) {
  let button = document.createElement('button');
  let date = note.querySelector('.pDate')
  let img = document.createElement('img');
  button.className = 'del-button-note';
  if (notes.deleted == true) {
    img.src = 'img/delete-fill.svg';
  } else {
    img.src = 'img/delete-note.svg';
  };
  img.className = 'del-icon-note';
  note.insertBefore(button, date);
  button.appendChild(img);
};

function createFavouriteButton(note, notes) {
  let button = document.createElement('button');
  let date = note.querySelector('.pDate')
  let img = document.createElement('img');
  button.id = 'fav-button-note';
  if (notes.favourite == true) {
    img.src = "img/star-fill.svg";
  } else {
    img.src = 'img/star-note.svg';
  };
  img.className = 'fav-icon-note';
  note.insertBefore(button, date);
  button.appendChild(img);
};

function loadNotes() {
  let data = localStorage.getItem('note');
  if (data) {
    noteList = JSON.parse(data);
  } else {
    firstPopup();
  };
};

function firstPopup() {
  if (noteList.length !== 1) {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
    body.classList.toggle("backgroundBlur");
  };
};


function saveNotes() {
  localStorage.setItem('note', JSON.stringify(noteList));
};


quill.on('text-change', autoUpdate);


function autoUpdate() {
  var data = quill.getContents();
  if (selectedNote) {
    selectedNote.data = data;
    let s = quill.getText().split("\n");
    selectedNote.title = s[0];
    selectedNote.preview = s[1];
    textUpdate(selectedNote);
    saveNotes();
  };
};

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

function swapNote(event) {
  var targetNote = Id2Object(event.target.closest("div").id);

  if (typeof targetNote != "undefined") {
    if (targetNote != selectedNote) {
      selectedNote.data = quill.getContents();

      if ((favouriteMode == true && favouriteArray().indexOf(targetNote) == -1) ||
        (deletedMode == true && deletedArray().indexOf(targetNote) == -1)) {

      } else {
        activeNote(targetNote);
      }
    }
  } else console.log("For some reason, event was undefined. (Swapnote-function)");
};

function renderAllNotes() {
  let innerSideBar = document.querySelector('#innerSideBar');
  innerSideBar.innerHTML = ""

  for (let i = 0; i < noteList.length; i++) {
    if (noteList[i].deleted === false)
      renderNote(noteList[i]);
  };
  let a = defaultArray();
  a.forEach(function (n) {
    textUpdate(n);
  });

  let tempNote = a[0];
  activeNote(tempNote);
};

function renderSearchedNotes() {
  let innerSideBar = document.querySelector('#innerSideBar');
  innerSideBar.innerHTML = ""

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
      let ops = noteList[i].data.ops;
      for (let j = 0; j < ops.length; j++) {
        try {
          if (ops[j].insert.toLowerCase().includes(searchString)) {
            foundArray.push(noteList[i]);
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
  activeNote(event.target.closest("div").id);
};

function enableSearch() {
  textSearch = document.querySelector('#searchInput');
  textSearch.addEventListener('input', (event) => {
    searchString = textSearch.value.toLowerCase();
    renderSearchedNotes();
  });
  textSearch.focus();
};
enableSearch();


function addNote() {
  let notes = {
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
  firstNote();
  saveNotes();
};

function firstNote() {
  if (noteList.length !== 1) {
    quill.deleteText(0, quill.getLength());
  };
};

function deleteSelectedNote(id) {
  var toDelete = document.getElementById(id);
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
    setActiveNote(noteList[0]);
  };
  toDelete.parentNode.removeChild(toDelete);
  saveNotes();
};

var showBtn = document.getElementById("showHideBtn");
function showHideFunction() {
  var sideNav = document.querySelector("#sideNav");
  if (sideNav.style.display === "block") {
    sideNav.style.display = "none";
  } else {
    sideNav.style.display = "block";
  };
};

let modal = document.getElementById("myModal");
let btn = document.getElementById("helpBtn");
let span = document.getElementsByClassName("close")[0];
let body = document.body;
btn.onclick = function () {
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
  window.print();
};

function displayDate(notes) {
  let note = document.querySelector(`div[id = "${notes.id}"]`);
  var d = new Date(notes.id);
  var date = d.toLocaleString();
  var pDateId = document.createElement("p");
  note.appendChild(pDateId);
  pDateId.className = "pDate";
  pDateId.innerHTML = date;
};

favouriteButton = document.querySelector("#favouriteBtn");
favouriteButton.addEventListener('click', toggleFavouriteButton);

const showFavourites = (note) => note.favourite === true;

function favouriteNote(id) {
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

function toggleFavouriteButton() {
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
    renderAllNotes();
  }
};

function showOnlyFavourites() {
  let allNotes = document.querySelector('#innerSideBar');
  allNotes.innerHTML = ""
  enableSearch()

  noteList.filter(note => note.favourite === true && note.deleted !== true).forEach(renderNote);

  favArray = favouriteArray();
  if (favArray.length > 0) {
    activeNote(favArray[0]);
  };
};

deletedButton = document.querySelector("#deletedBtn");
deletedButton.addEventListener('click', toggleDeletedButton);
const showDeleted = (note) => note.deleted === true;

function deleteNote(id) {
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

function toggleDeletedButton() {
  deletedButton.classList.toggle("delActive");
  deletedMode = !deletedMode;

  if (favouriteMode) { favouriteButton.classList.toggle("favActive"); }
  favouriteMode = false;
  if (deletedButton.classList.contains('delActive')) {
    showOnlyDeleted();
    let a = deletedArray();
    a.forEach(function (n) {
      textUpdate(n);
    });
  } else {
    renderAllNotes();
  };
};

function showOnlyDeleted() {
  let allNotes = document.querySelector('#innerSideBar');
  allNotes.innerHTML = ""
  enableSearch()

  noteList.filter(note => note.deleted === true).forEach(renderNote);

  delArray = deletedArray();
  if (delArray.length > 0) {
    activeNote(delArray[0]);
  };
};

darkModeButton = document.querySelector(".darkmode");
darkModeButton.addEventListener('click', toggleDarkMode);

function setDarkMode() {
  let darkArray = ["body", "#innerSideBar", "#editor-container", ".searchNotes", "#searchInput", ".ql-stroke", "#sideNav", "#toggleNotes"];
  if (darkMode == false) {
    darkArray.forEach(function (obj) {
      document.querySelector(obj).classList.add("dark");
    });
  }
  else {
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

window.onresize = function () {

  var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  var quireLogo = document.querySelector(".quireLogo");


  var text = document.getElementById("favouriteBtn");
  var text1 = document.getElementById("deletedBtn");
  var text2 = document.getElementById("helpBtn");
  var text3 = document.getElementById("printBtn");

  var sidebar = document.querySelector(".noteSection");


  if (width <= 550) {
    text.innerHTML = '<img src="img/star.svg" class="fav-icon" alt="Favourites"><div class="button-text"></div>';
    text1.innerHTML = '<img src="img/delete_outline-24px.svg" class="del-icon" alt="Deleted"> <div class="button-text del-self-text"></div>';
    text2.innerHTML = '<img src="img/question.svg" class="help-icon" alt="Help"><div class="button-text"></div>';
    text3.innerHTML = '<img src="img/print.svg" class="print-icon" alt="Print"> <div class="button-text print-self-text"></div>';


    text.style.position.fixed;

    if (width <= 500) {
      sidebar.style.z = "1";
    }
  }

  else {
    text.innerHTML = '<img src="img/star.svg" class="fav-icon" alt="Favourites"> <div class="button-text">Favourites</div>';
    text1.innerHTML = '<img src="img/delete_outline-24px.svg" class="del-icon" alt="Deleted"><div class="button-text del-self-text">Deleted</div>';
    text2.innerHTML = '<img src="img/question.svg" class="help-icon" alt="Help"><div class="button-text">Help</div>';
    text3.innerHTML = '<img src="img/print.svg" class="print-icon" alt="Print"><div class="button-text print-self-text">Print</div>';
  }
  return;
}

function toggleInnersideBar() {
  var sidebar = document.querySelector(".noteSection");
  sidebar.classList.toggle("hidden");
  if (sidebar.classList.contains("hidden")) {
    sidebar.style.display = "column";
  }
}