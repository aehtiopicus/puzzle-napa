import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Simple component to test
function TestComponent() {
  return (
    <div>
      <h1>Welcome to Next.js</h1>
      <p>This is a test component</p>
    </div>
  );
}

describe("TestComponent", () => {
  it("renders the heading", () => {
    render(<TestComponent />);
    const heading = screen.getByRole("heading", {
      name: /welcome to next.js/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders the paragraph", () => {
    render(<TestComponent />);
    const paragraph = screen.getByText(/this is a test component/i);
    expect(paragraph).toBeInTheDocument();
  });
});
