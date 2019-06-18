import { resourceList } from "../resource_list";
import { markAsResourceFixture } from "../assertion_support";

describe("resourceList()", () => {
  it("lists defaults, plus saved points", () => {
    const { index } = markAsResourceFixture();
    const result = resourceList(index);
    expect(result.length).toBeTruthy();
    const headings = result.filter(x => x.heading).map(x => x.label);
    expect(headings).toContain("Device");
    expect(headings).toContain("Plants");
    expect(headings).toContain("Points");
  });
});
