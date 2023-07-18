import Overdrag from "overdrag";

declare global {
  interface HTMLElement {
    __overdrag: Overdrag;
  }
}
