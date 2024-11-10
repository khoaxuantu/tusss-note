/**
 * For the dropdown menu rendered by Nue
 *
 * @see https://nuejs.org/docs/page-layout.html#dropdown-menus
 */
class SidebarMenu extends HTMLElement {
  constructor() {
    super();

    const menus = this.querySelectorAll("[aria-haspopup]");
    this.#loadDropdownInteractionFor(menus);
  }

  /**
   *
   * @param {NodeListOf<HTMLSpanElement>} menus
   */
  #loadDropdownInteractionFor(menus) {
    menus.forEach((menu) => {
      const anchor = menu.querySelector("[aria-expanded=false]");
      anchor.onclick = () => {
        anchor.ariaExpanded = anchor.ariaExpanded == "true" ? "false" : "true";
      };
    });
  }
}

customElements.define("sidebar-menu", SidebarMenu, { extends: "aside" });
