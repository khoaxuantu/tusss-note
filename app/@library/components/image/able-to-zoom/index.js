class AbleToZoomImage extends HTMLElement {
  constructor() {
    super();

    this.onclick = () => {
      this.classList.toggle("zoom");
    };

    const [img] = this.getElementsByTagName("img");
    img.title += " (Click to zoom in/out)";

    const [caption] = this.getElementsByTagName("figcaption");
    if (!caption) {
      const newCaption = document.createElement("figcaption");
      newCaption.innerHTML = "Click to zoom in/out";
      this.appendChild(newCaption);
    } else {
      caption.innerText += " (Click to zoom in/out)";
      caption.innerText.trim();
    }
  }
}

customElements.define("able-to-zoom", AbleToZoomImage, { extends: "figure" });
