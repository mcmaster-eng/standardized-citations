function highlightSub(elem) {
  var x = document.getElementsByClassName("subDrop");
  // Reset style of all option boxes
  for (var i = 0; i < x.length; i++) {
     x.item(i).className = 'subDrop';
  }
  // Apply active style to clicked element
  elem.className += ' activeClear';
}
// Changes text shown in the subject filter
function changeText(elem){
  var t = elem.id;
  var lower_t = t.toLowerCase();
  document.getElementById("fixedBTN").innerHTML = lower_t;
  //window.alert(elem.title);
}
function collapsible(elem){
 var collaps = document.getElementsByClassName("content");
 selectedcollap = elem.id;
 elem.classList.toggle("active2");
 if (collaps[selectedcollap].style.maxHeight) {
   collaps[selectedcollap].style.maxHeight = null;
 }
 else {
   collaps[selectedcollap].style.maxHeight = collaps[selectedcollap].scrollHeight + "px";
 }
}
