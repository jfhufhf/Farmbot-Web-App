let mockPath = "/app/designer/plants";
jest.mock("../../history", () => ({
  getPathArray: jest.fn(() => { return mockPath.split("/"); }),
}));

let mockDev = false;
jest.mock("../../account/dev/dev_support", () => ({
  DevSettings: {
    futureFeaturesEnabled: () => mockDev,
  }
}));

import * as React from "react";
import { DesignerNavTabs } from "../panel_header";
import { shallow } from "enzyme";

describe("<DesignerNavTabs />", () => {
  it("renders for map", () => {
    mockPath = "/app/designer";
    const wrapper = shallow(<DesignerNavTabs />);
    expect(wrapper.hasClass("gray-panel")).toBeTruthy();
    expect(wrapper.html()).toContain("active");
  });

  it("renders for plants", () => {
    mockPath = "/app/designer/plants";
    const wrapper = shallow(<DesignerNavTabs />);
    expect(wrapper.hasClass("green-panel")).toBeTruthy();
    expect(wrapper.html()).toContain("active");
  });

  it("renders for farm events", () => {
    mockPath = "/app/designer/events";
    const wrapper = shallow(<DesignerNavTabs />);
    expect(wrapper.hasClass("yellow-panel")).toBeTruthy();
    expect(wrapper.html()).toContain("active");
  });

  it("renders for saved gardens", () => {
    mockPath = "/app/designer/saved_gardens";
    mockDev = true;
    const wrapper = shallow(<DesignerNavTabs />);
    expect(wrapper.hasClass("green-panel")).toBeTruthy();
    expect(wrapper.html()).toContain("active");
  });

  it("renders for settings", () => {
    mockPath = "/app/designer/settings";
    mockDev = true;
    const wrapper = shallow(<DesignerNavTabs />);
    expect(wrapper.hasClass("gray-panel")).toBeTruthy();
    expect(wrapper.html()).toContain("active");
  });
});
