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

  connectedCallback() {
    toggleTheme();
  }
}

customElements.define("theme-button", ThemeButton, { extends: "button" })

function toggleTheme() {
  const theme = getTheme();
  if (theme) {
    const body = getBody();
    if (body.classList.contains(theme)) return;
    body.classList.toggle("light", theme == "light")
    body.classList.toggle("dark", theme == "dark");
  }
}

function getTheme() {
  return localStorage.getItem("theme");
}

function setTheme(theme) {
  localStorage.setItem("theme", theme);
}

function getBody() {
  return document.getElementsByTagName("body")[0];
}
