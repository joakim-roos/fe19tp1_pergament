
//Fabian
document.getElementById("showHideBtn").addEventListener("click", showHideFunction);

function showHideFunction(){
    /* if() */
    document.getElementById("innerSideBar").style.display = "block";
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