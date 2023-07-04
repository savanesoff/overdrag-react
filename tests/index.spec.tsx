import { render, screen } from "@testing-library/react";
import Overdrag from "../src/index";
describe("Overdrag", () => {
  it("should be defined", () => {
    expect(Overdrag).toBeDefined();
  });

  it("renders element", () => {
    render(<Overdrag>Overdrag element</Overdrag>);

    screen.debug();

    // check if App components renders headline
    expect(screen.getByText("Overdrag element")).toBeInTheDocument();
  });
});
