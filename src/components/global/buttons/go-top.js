class GoTopButton extends HTMLElement {
  constructor() {
    super();

    this.onclick = () => {
      setTimeout(() => {
        document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    };
  }
}

customElements.define("button-go-top", GoTopButton);
