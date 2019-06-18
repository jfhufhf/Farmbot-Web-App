import { designer } from "../reducer";
import { Actions } from "../../constants";
import { ReduxAction } from "../../redux/interfaces";
import {
  DesignerState, HoveredPlantPayl, CurrentPointPayl, CropLiveSearchResult
} from "../interfaces";
import { BotPosition } from "../../devices/interfaces";
import { fakeCropLiveSearchResult } from "../../__test_support__/fake_crop_search_result";

describe("designer reducer", () => {
  const oldState = (): DesignerState => {
    return {
      selectedPlants: undefined,
      hoveredPlant: {
        plantUUID: undefined,
        icon: ""
      },
      hoveredPlantListItem: undefined,
      cropSearchQuery: "",
      cropSearchResults: [],
      cropSearchInProgress: false,
      chosenLocation: { x: undefined, y: undefined, z: undefined },
      currentPoint: undefined,
      openedSavedGarden: undefined,
    };
  };

  it("sets search query", () => {
    const action: ReduxAction<string> = {
      type: Actions.SEARCH_QUERY_CHANGE,
      payload: "apple"
    };
    const newState = designer(oldState(), action);
    expect(newState.cropSearchQuery).toEqual("apple");
    expect(newState.cropSearchInProgress).toEqual(true);
  });

  it("selects plants", () => {
    const action: ReduxAction<string[]> = {
      type: Actions.SELECT_PLANT,
      payload: ["plantUuid"]
    };
    const newState = designer(oldState(), action);
    expect(newState.selectedPlants).toEqual(["plantUuid"]);
  });

  it("sets hovered plant", () => {
    const action: ReduxAction<HoveredPlantPayl> = {
      type: Actions.TOGGLE_HOVERED_PLANT,
      payload: {
        icon: "icon",
        plantUUID: "plantUuid"
      }
    };
    const newState = designer(oldState(), action);
    expect(newState.hoveredPlant).toEqual({
      icon: "icon", plantUUID: "plantUuid"
    });
  });

  it("sets hovered plant list item", () => {
    const action: ReduxAction<string> = {
      type: Actions.HOVER_PLANT_LIST_ITEM,
      payload: "plantUuid"
    };
    const newState = designer(oldState(), action);
    expect(newState.hoveredPlantListItem).toEqual("plantUuid");
  });

  it("sets chosen location", () => {
    const action: ReduxAction<BotPosition> = {
      type: Actions.CHOOSE_LOCATION,
      payload: { x: 0, y: 0, z: 0 }
    };
    const newState = designer(oldState(), action);
    expect(newState.chosenLocation).toEqual({ x: 0, y: 0, z: 0 });
  });

  it("sets current point data", () => {
    const action: ReduxAction<CurrentPointPayl> = {
      type: Actions.SET_CURRENT_POINT_DATA,
      payload: { cx: 10, cy: 20, r: 30, color: "red" }
    };
    const newState = designer(oldState(), action);
    expect(newState.currentPoint).toEqual({
      cx: 10, cy: 20, r: 30, color: "red"
    });
  });

  it("sets opened saved garden", () => {
    const payload = "savedGardenUuid";
    const action: ReduxAction<string | undefined> = {
      type: Actions.CHOOSE_SAVED_GARDEN,
      payload
    };
    const newState = designer(oldState(), action);
    expect(newState.openedSavedGarden).toEqual(payload);
  });

  it("stores new OpenFarm assets", () => {
    const payload: CropLiveSearchResult[] = [
      fakeCropLiveSearchResult(),
    ];
    const action: ReduxAction<typeof payload> = {
      type: Actions.OF_SEARCH_RESULTS_OK, payload
    };
    const newState = designer(oldState(), action);
    expect(newState.cropSearchResults).toEqual(payload);
    expect(newState.cropSearchInProgress).toEqual(false);
  });

  it("starts search", () => {
    const action: ReduxAction<undefined> = {
      type: Actions.OF_SEARCH_RESULTS_START, payload: undefined
    };
    const newState = designer(oldState(), action);
    expect(newState.cropSearchInProgress).toEqual(true);
  });

  it("ends search", () => {
    const state = oldState();
    state.cropSearchInProgress = true;
    const action: ReduxAction<undefined> = {
      type: Actions.OF_SEARCH_RESULTS_NO, payload: undefined
    };
    const newState = designer(state, action);
    expect(newState.cropSearchInProgress).toEqual(false);
  });
});
