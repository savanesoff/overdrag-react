import { render, screen } from "@testing-library/react";
import Controller from "overdrag";
import Overdrag from "../src/index";

function isNullOrUndefined(value: unknown): boolean {
  return value === null || value === undefined;
}

/**
 * Mock HTMLElement.offsetParent as it is not supported in JEST DOM
 */
Object.defineProperty(HTMLElement.prototype, "offsetParent", {
  get() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let element = this;
    while (
      !isNullOrUndefined(element) &&
      (isNullOrUndefined(element.style) ||
        isNullOrUndefined(element.style.display) ||
        element.style.display.toLowerCase() !== "none")
    ) {
      element = element.parentNode;
    }

    if (!isNullOrUndefined(element)) {
      return null;
    }

    if (
      !isNullOrUndefined(this.style) &&
      !isNullOrUndefined(this.style.position) &&
      this.style.position.toLowerCase() === "fixed"
    ) {
      return null;
    }

    if (
      this.tagName.toLowerCase() === "html" ||
      this.tagName.toLowerCase() === "body"
    ) {
      return null;
    }

    return this.parentNode;
  },
});

vi.mock("overdrag");

describe("Overdrag", () => {
  beforeAll(() => {
    // shim for Event Emitter
    // @ts-expect-error - we are sure that this is not undefined
    Controller.prototype._events = [];
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should be defined", () => {
    expect(Overdrag).toBeDefined();
  });

  it("renders element", () => {
    render(<Overdrag>Overdrag element</Overdrag>);
    expect(screen.getByText("Overdrag element")).toBeInTheDocument();
  });

  it("renders element with props", () => {
    const minContentHeight = Math.floor(Math.random() * 100);
    render(
      <Overdrag minContentHeight={minContentHeight}>Overdrag element</Overdrag>
    );

    expect(Controller.prototype.constructor).toHaveBeenCalledWith(
      expect.objectContaining({ minContentHeight })
    );
  });

  it('should assign event handlers to "on" props', () => {
    const handler = vi.fn();
    render(
      <Overdrag onDragStart={handler} onOut={handler}>
        Overdrag element
      </Overdrag>
    );
    expect(Controller.prototype.on).toHaveBeenCalledWith("dragStart", handler);
    expect(Controller.prototype.on).toHaveBeenCalledWith("out", handler);
  });

  it('should not assign event handlers to "on" props if they are not functions', () => {
    render(<Overdrag onDragStart={undefined}>Overdrag element</Overdrag>);
    expect(Controller.prototype.on).not.toHaveBeenCalled();
  });

  it("should allow HTML div attributes to be passed to the element", () => {
    const dataTestId = "overdrag";
    render(<Overdrag data-testid={dataTestId}>Overdrag element</Overdrag>);
    expect(screen.getByTestId(dataTestId)).toBeInTheDocument();
  });

  it("should allow style to be passed to the element", () => {
    const style = { color: "grb(255,255,0)" };
    const dataTestId = "overdrag";
    render(
      <Overdrag style={style} data-testid={dataTestId}>
        Overdrag element
      </Overdrag>
    );
    expect(screen.getByTestId(dataTestId)).toHaveStyle(style);
  });
});
