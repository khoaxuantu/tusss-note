import type { SidenavItemProps, SidenavProps } from "./types";

export class SidenavPropsBuilder {
  readonly product: SidenavProps = {
    data: [],
  };

  constructor(private raw: Record<string, unknown>) {}

  build() {
    for (const [key, value] of Object.entries(this.raw)) {
      if (typeof value == "string") {
        this.product.data.push({ label: key, href: value });
        continue;
      }

      if (typeof value == "object") {
        const item: SidenavItemProps = { label: key };
        this.buildRecursive(value, item);
        this.product.data.push(item);
      }
    }

    return this;
  }

  private buildRecursive(value: unknown, parent: SidenavItemProps) {
    if (value === undefined || value === null) return;

    if (typeof value == "string") {
      parent.href = value;
      return;
    }

    if (typeof value == "object" && !Array.isArray(value)) {
      parent.items ??= [];

      for (const [k, v] of Object.entries(value)) {
        const item: SidenavItemProps = { label: k };
        this.buildRecursive(v, item);
        parent.items.push(item);
      }
    }
  }
}
