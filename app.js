
// Joakim - 'Skapa en anteckning' - Submit-knappen funkar och lägger till en anteckning på innersidebar. Dock går det inte att klicka på den än.
const addNewNote = document.getElementById("newNoteBtn");

//tom lista för notes
const noteList=[];
//global variable för notes
var Count=-1;
//global variable för vald note
var selectedNote;

//få lägsta öppna id, rätt dålig funktion men fick inte Lambda att fungera i JS
function getOpenId(){
  Count++;
  return Count;
}

//en simpel funktion för att konverta från heltal till Note
function Id2Note(int){
  var i;
  var t;
  for(i=0;i<noteList.length;i++){
    t=noteList[i].getAttribute("testId");
    if(int==t){
      return noteList[i]
    }
  }
}


addNewNote.onclick = function () {
  addElement();
}



function addElement () { 
  //let editorContent = document.querySelector(".ql-editor").innerHTML;
  let editorContent=quill.getText();
  console.log(editorContent);
  let currentNote = document.getElementById("innerSideBar"); 
  let child = currentNote.firstChild;
  let newNote = document.createElement("div"); 
  newNote.className = "newNote";
  newNote.innerHTML = editorContent;
  quill.deleteText(0,quill.getLength());


//Malin
  // Skapar ett ID och spar i variabel 
  var datumet = Date.now();
  var skapatID = Math.floor(datumet / 1000);



  //ger div(newnote) det skapade ID:t 
  newNote.setAttribute('id', skapatID);


  //ger div-noten ett nytt, "mer säkert", id
  var newId=getOpenId();
  newNote.setAttribute("testId",newId);
  //lägger till den i globala listan
  noteList.push(newNote);
  //testfunktion, bör tas bort
  //var t=document.getElementById("TEST");
  //t.innerHTML=noteList.length;
  //byter valt element vid klick
  newNote.setAttribute("onclick","focusElement("+newId+")");


  //skapa raderaknapp
  var raderaKnapp = document.createElement("button");
  // ger knapp en klass för att kunna styla det 
  raderaKnapp.className="ta-bort-knappen";
  //ger knapp specifikt ID och kör funktion vid klick 
  raderaKnapp.setAttribute("onclick", "removeElement("+skapatID+")");
  //ger radera knapp ett innehåll 
  var textRaderaKnapp = document.createTextNode("X");
  //slår ihop knappen med innehållet 
  raderaKnapp.appendChild(textRaderaKnapp);
  //lägger knappen i div (newnote) 
  newNote.appendChild(raderaKnapp);

  /* newNote.innerHTML = tinyMCE.get('printableArea').getContent(); */
  currentNote.insertBefore(newNote, child);

  //väjer det senast skapade elementet
  focusElement(newId);

};


function focusElement(newId){
  var oldNote=selectedNote;
  selectedNote=Id2Note(newId);

  if (oldNote!=selectedNote){
   oldNote.textContent=quill.getText();
   quill.setText(selectedNote.textContent);
  }

}

//Malin
//klickfunktionen
function removeElement(skapatID) {
  // spar anteckningen i en varabel 
  var attRadera = document.getElementById(skapatID);

  //om den borttagna noten är den valda, gör saker


  //raderar anteckningen
  attRadera.parentNode.removeChild(attRadera);

  //går igenom globala listan och tar bort noten ur listan
  var i;
  var index;
  for (i=0;i<noteList.length;i++){
    if (noteList[i].skapatID==skapatID){
      index=i;
    }
  }
  noteList.splice(index,1);
  //



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


  // TINY MCE config. 
/*   tinymce.init({
    selector:'textarea',
    menubar: false,
    fixed_toolbar_container: '.form',
    plugins: "autoresize",
    min_height: 700,
    max_height: 700,
    content_css: '/style.css, https://fonts.googleapis.com/css?family=Raleway&display=swap',
    body_class: 'editorStyling',
    editor_selector: "editor",
  }); */

  let quill = new Quill('#editor-container', {
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block']
      ]
    },
    placeholder: 'Team Pergament är cool',
    theme: 'snow'  // or 'bubble'
  });



// Hjälp knapp - Malin
var modal = document.getElementById("myModal"); // Get the modal hela första diven 
var btn = document.getElementById("helpBtn"); // Get the button that opens the modal
var span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal

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
  var printContents = document.querySelector(".ql-editor").innerHTML;
  var originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
//  document.body.innerHTML = originalContents;
location.reload();
}

