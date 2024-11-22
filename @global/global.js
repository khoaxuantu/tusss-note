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

customElements.define("theme-button", ThemeButton, { extends: "button" });

class GoTopButton extends HTMLButtonElement {
  constructor() {
    super();

    this.onclick = () => {
      setTimeout(() => {
        document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  }
}

customElements.define("go-top-button", GoTopButton, { extends: "button" });

function toggleTheme() {
  const theme = getTheme();
  const body = getBody();

  if (theme) {
    if (body.classList.contains(theme)) return;
    body.classList.toggle("light", theme == "light")
    body.classList.toggle("dark", theme == "dark");
  } else {
    setTheme("dark");
    body.classList.add("dark");
    body.classList.remove("light");
  }
}

function getTheme() {
  return localStorage.getItem("theme");
}

function setTheme(theme) {
  localStorage.setItem("theme", theme);
}

function getBody() {
  return document.getElementsByTagName("html")[0];
}
