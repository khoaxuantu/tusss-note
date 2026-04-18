class ThemeButton extends HTMLElement {
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

customElements.define("button-theme", ThemeButton);
