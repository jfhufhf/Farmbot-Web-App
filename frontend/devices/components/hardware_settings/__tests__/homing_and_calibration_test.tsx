jest.mock("../../../actions", () => ({
  updateMCU: jest.fn()
}));

import * as React from "react";
import { mount } from "enzyme";
import { HomingAndCalibration } from "../homing_and_calibration";
import { bot } from "../../../../__test_support__/fake_state/bot";
import { updateMCU } from "../../../actions";
import {
  fakeFirmwareConfig
} from "../../../../__test_support__/fake_state/resources";
import { error, warning } from "../../../../toast/toast";

describe("<HomingAndCalibration />", () => {
  function testAxisLengthInput(
    fw: string, provided: string, expected: string | undefined) {
    const dispatch = jest.fn();
    bot.controlPanelState.homing_and_calibration = true;
    bot.hardware.informational_settings.firmware_version = fw;
    const result = mount(<HomingAndCalibration
      dispatch={dispatch}
      bot={bot}
      firmwareConfig={fakeFirmwareConfig().body}
      sourceFwConfig={(x) => {
        return { value: bot.hardware.mcu_params[x], consistent: true };
      }}
      botDisconnected={false} />);
    const e = { currentTarget: { value: provided } } as
      React.SyntheticEvent<HTMLInputElement>;
    const input = result.find("input").first().props();
    input.onChange && input.onChange(e);
    input.onSubmit && input.onSubmit(e);
    expected
      ? expect(updateMCU)
        .toHaveBeenCalledWith("movement_axis_nr_steps_x", expected)
      : expect(updateMCU).not.toHaveBeenCalled();
  }
  it("short int", () => {
    testAxisLengthInput("5.0.0", "100000", undefined);
    expect(error)
      .toHaveBeenCalledWith("Value must be less than or equal to 32000.");
  });

  it("long int: too long", () => {
    testAxisLengthInput("6.0.0", "10000000000", undefined);
    expect(error)
      .toHaveBeenCalledWith("Value must be less than or equal to 2000000000.");
  });

  it("long int: ok", () => {
    testAxisLengthInput("6.0.0", "100000", "100000");
    expect(warning).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });
});
