import { generateReducer } from "../redux/generate_reducer";
import { Actions } from "../constants";

export interface HelpState {
  currentTour: string | undefined;
}

export let initialState: HelpState = {
  currentTour: undefined,
};

export let helpReducer = generateReducer<HelpState>(initialState)
  .add<string>(Actions.START_TOUR, (s, { payload }) => {
    s.currentTour = payload;
    return s;
  });
