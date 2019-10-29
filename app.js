var showBtn = document.getElementById("showHideBtn");
//Fabian
showBtn.onclick = function() {showHideFunction()};

function showHideFunction(){
     if(document.getElementById("innerSideBar").style.display = "block"){
      document.getElementById("innerSideBar").style.display = "none";
      console.log(showBtn.style);
     } 
     else if(document.getElementById("innerSideBar").style.display = "none"){
      document.getElementById("innerSideBar").style.display = "block";
      console.log("2");
     } else{
      document.getElementById("innerSideBar").style.display = "block"
     }
    
    //console.log("hejsan");
}


// Quill.js text editor. Not used at the moment. 
let quill = new Quill('#editor-container', {
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block']
      ]
    },
    placeholder: 'Compose an epic...',
    theme: 'snow'  // or 'bubble'
  });
  


  // TINY MCE Rich text editor. 
  tinymce.init({
    selector:'textarea',
    menubar: false,
    fixed_toolbar_container: '.form',
    plugins: "autoresize",
    min_height: 600,
    max_height: 600,
    content_css: '/style.css',
    body_class: 'editorStyling'
});


// Hjälp knapp 
window.onload = function(){ 
// Get the modal hela första diven 
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

var starta = document.getElementById("starta");

var musöver = document.querySelector("p")

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

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
};