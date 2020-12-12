document.addEventListener('DOMContentLoaded', function() {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, {edge: 'left'});
  });
  
function displayinfoListeHeros(){
  document.getElementById("infoBDEListeHeros").style.display="flex";
  document.getElementById("containerCards_BDE" ).style.display="none";
}