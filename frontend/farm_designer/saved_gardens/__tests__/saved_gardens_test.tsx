jest.mock("react-redux", () => ({ connect: jest.fn() }));

jest.mock("../actions", () => ({
  snapshotGarden: jest.fn(),
  applyGarden: jest.fn(),
  destroySavedGarden: jest.fn(),
  openOrCloseGarden: jest.fn(),
  closeSavedGarden: jest.fn(),
}));

jest.mock("../../../history", () => ({
  history: { push: jest.fn() },
  getPathArray: () => [],
}));

jest.mock("../../../api/crud", () => ({ edit: jest.fn() }));

let mockDev = false;
jest.mock("../../../account/dev/dev_support", () => ({
  DevSettings: {
    futureFeaturesEnabled: () => mockDev,
  }
}));

import * as React from "react";
import { mount, shallow } from "enzyme";
import {
  SavedGardens, mapStateToProps, SavedGardensLink, SavedGardenHUD, savedGardenOpen
} from "../saved_gardens";
import { error } from "farmbot-toastr";
import { clickButton } from "../../../__test_support__/helpers";
import {
  fakePlantTemplate, fakeSavedGarden
} from "../../../__test_support__/fake_state/resources";
import { history } from "../../../history";
import { fakeState } from "../../../__test_support__/fake_state";
import {
  buildResourceIndex
} from "../../../__test_support__/resource_index_builder";
import { SavedGardensProps } from "../interfaces";
import { applyGarden, destroySavedGarden, closeSavedGarden } from "../actions";
import { Actions } from "../../../constants";

describe("<SavedGardens />", () => {
  const fakeProps = (): SavedGardensProps => ({
    dispatch: jest.fn(),
    plantPointerCount: 1,
    savedGardens: [fakeSavedGarden()],
    plantTemplates: [fakePlantTemplate(), fakePlantTemplate()],
    openedSavedGarden: undefined,
  });

  it("renders saved gardens", () => {
    const wrapper = mount(<SavedGardens {...fakeProps()} />);
    ["saved garden 1", "2", "apply"].map(string =>
      expect(wrapper.html().toLowerCase()).toContain(string));
  });

  it("applies garden", () => {
    const p = fakeProps();
    p.savedGardens[0].uuid = "SavedGarden.1.0";
    p.savedGardens[0].body.id = 1;
    p.plantPointerCount = 0;
    const wrapper = mount(<SavedGardens {...p} />);
    clickButton(wrapper, 3, "apply");
    expect(applyGarden).toHaveBeenCalledWith(1);
  });

  it("plants still in garden", () => {
    const wrapper = mount(<SavedGardens {...fakeProps()} />);
    wrapper.find("button").first().simulate("click");
    clickButton(wrapper, 3, "apply");
    expect(error).toHaveBeenCalledWith(expect.stringContaining(
      "Please clear current garden first"));
  });

  it("destroys garden", () => {
    const p = fakeProps();
    const wrapper = mount(<SavedGardens {...p} />);
    clickButton(wrapper, 2, "");
    expect(destroySavedGarden).toHaveBeenCalledWith(p.savedGardens[0].uuid);
  });

  it("goes back", () => {
    const wrapper = mount(<SavedGardens {...fakeProps()} />);
    wrapper.find("i").first().simulate("click");
    expect(history.push).toHaveBeenCalledWith("/app/designer/plants");
  });

  it("has no saved gardens yet", () => {
    const p = fakeProps();
    p.savedGardens = [];
    const wrapper = mount(<SavedGardens {...p} />);
    expect(wrapper.text().toLowerCase()).toContain("no saved gardens yet");
  });

  it("shows alt display", () => {
    mockDev = true;
    const wrapper = mount(<SavedGardens {...fakeProps()} />);
    expect(wrapper.html()).toContain("-nav");
    mockDev = false;
  });
});

describe("mapStateToProps()", () => {
  it("has no plants in garden", () => {
    const state = fakeState();
    state.resources = buildResourceIndex([]);
    const result = mapStateToProps(state);
    expect(result.plantPointerCount).toEqual(0);
  });

  it("has plants in garden", () => {
    const result = mapStateToProps(fakeState());
    expect(result.plantPointerCount).toBeGreaterThan(0);
  });
});

describe("<SavedGardensLink />", () => {
  it("opens saved garden panel", () => {
    mockDev = true;
    const wrapper = shallow(<SavedGardensLink />);
    clickButton(wrapper, 0, "saved gardens");
    expect(history.push).toHaveBeenCalledWith(
      "/app/designer/saved_gardens");
    mockDev = false;
  });

  it("saved garden button hidden", () => {
    mockDev = false;
    const wrapper = shallow(<SavedGardensLink />);
    const btn = wrapper.find("button").at(0);
    expect(btn.props().hidden).toEqual(true);
    mockDev = false;
  });
});

describe("savedGardenOpen", () => {
  it("is open", () => {
    const result = savedGardenOpen(["", "", "", "saved_gardens", "4", ""]);
    expect(result).toEqual(4);
  });
});

describe("<SavedGardenHUD />", () => {
  it("renders", () => {
    const wrapper = mount(<SavedGardenHUD dispatch={jest.fn()} />);
    ["viewing saved garden", "menu", "edit", "exit"].map(string =>
      expect(wrapper.text().toLowerCase()).toContain(string));
  });

  it("opens menu", () => {
    const wrapper = mount(<SavedGardenHUD dispatch={jest.fn()} />);
    clickButton(wrapper, 0, "menu");
    expect(history.push).toHaveBeenCalledWith("/app/designer/saved_gardens");
  });

  it("navigates to plants", () => {
    const dispatch = jest.fn();
    const wrapper = mount(<SavedGardenHUD dispatch={dispatch} />);
    clickButton(wrapper, 1, "edit");
    expect(history.push).toHaveBeenCalledWith("/app/designer/plants");
    expect(dispatch).toHaveBeenCalledWith({
      type: Actions.SELECT_PLANT,
      payload: undefined
    });
  });

  it("exits garden", () => {
    const wrapper = mount(<SavedGardenHUD dispatch={jest.fn()} />);
    clickButton(wrapper, 2, "exit");
    expect(closeSavedGarden).toHaveBeenCalled();
  });
});
