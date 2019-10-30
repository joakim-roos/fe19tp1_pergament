/* var quire = [ 
  title = "",
  date(),
  notes,
] */

// Joakim - 'Skapa en anteckning'

const addNewNote = document.getElementById("saveEditorBtn");

addNewNote.onclick = function () {
  addElement()
}

function addElement () { 
  let currentNote = document.getElementById("innerSideBar"); 
  let child = currentNote.firstChild;
  let newNote = document.createElement("div"); 
  newNote.className = "newNote";
  newNote.innerHTML = tinyMCE.get('printableArea').getContent();
  currentNote.insertBefore(newNote, child);
};



//Fabian

var showBtn = document.getElementById("showHideBtn");
showBtn.onclick = function() {showHideFunction()};

function showHideFunction(){
  var sideNav = document.querySelector("#sideNav");

     if(sideNav.style.display === "block"){
      sideNav.style.display = "none";
     }
      else {
        sideNav.style.display = "block";
     }
}


  // TINY MCE Rich text editor. 
  tinymce.init({
    selector:'textarea',
    menubar: false,
    fixed_toolbar_container: '.form',
    plugins: "autoresize",
    min_height: 700,
    max_height: 700,
    content_css: '/style.css, https://fonts.googleapis.com/css?family=Raleway&display=swap',
    body_class: 'editorStyling',
    editor_selector: "editor",
  });



// Hjälp knapp 

// Get the modal hela första diven 
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("helpBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
  // console.log("hello");
}
modal
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


/* För att skriva ut en anteckning */
printDiv = function(divName) {
  var printContents = document.getElementById(divName).innerHTML;
  var originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;

  window.print();

//  document.body.innerHTML = originalContents;
location.reload();
}

