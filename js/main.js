// main.js — menu & theme
(function(){
  const menuBtn = document.getElementById("menuBtn");
  const mainNav = document.getElementById("mainNav");
  const themeToggle = document.getElementById("themeToggle");

  if(menuBtn && mainNav){
    menuBtn.addEventListener("click", ()=>{
      const hidden = mainNav.classList.toggle("hidden");
      mainNav.setAttribute("aria-hidden", hidden ? "true" : "false");
    });
  }

  function applyTheme(theme){
    if(theme === "dark"){
      document.documentElement.setAttribute("data-theme","dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("grocery_theme", theme);
  }

  // init theme
  const savedTheme = localStorage.getItem("grocery_theme") || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
  applyTheme(savedTheme);

  if(themeToggle){
    themeToggle.addEventListener("click", ()=>{
      const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      applyTheme(cur === "dark" ? "light" : "dark");
    });
  }
})();