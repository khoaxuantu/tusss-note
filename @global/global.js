document.addEventListener("DOMContentLoaded", () => {
  const theme = getTheme();
  if (theme) {
    const body = getBody();
    body.classList.remove("light", "dark");
    body.classList.add(theme);
  }
});

class ThemeButton extends HTMLButtonElement {
  constructor() {
    super();
    this.onclick = () => {
      const body = getBody();
      body.classList.toggle("light");
      body.classList.toggle("dark");

      const theme = getTheme();
      if (!theme || theme == "light") setTheme("dark");
      else setTheme("light");
    };
  }
}

customElements.define("theme-button", ThemeButton, { extends: "button" })

function getTheme() {
  return localStorage.getItem("theme");
}

function setTheme(theme) {
  localStorage.setItem("theme", theme);
}

function getBody() {
  return document.getElementsByTagName("body")[0];
}
