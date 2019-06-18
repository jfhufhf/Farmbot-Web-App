import * as React from "react";
import { StepButton } from "./step_buttons/index";
import { scrollToBottom } from "../util";
import { Row } from "../ui/index";
import { TaggedSequence } from "farmbot";
import { CONFIG_DEFAULTS } from "farmbot/dist/config";
import { ShouldDisplay, Feature } from "../devices/interfaces";
import { MessageType } from "./interfaces";
import { t } from "../i18next_wrapper";
import { NOTHING_SELECTED } from "./locals_list/handle_select";

export interface StepButtonProps {
  dispatch: Function;
  current: TaggedSequence | undefined;
  shouldDisplay: ShouldDisplay;
  stepIndex: number | undefined;
}

export function StepButtonCluster(props: StepButtonProps) {
  const { dispatch, current, shouldDisplay, stepIndex } = props;
  const commonStepProps = { dispatch, current, index: stepIndex };
  const ALL_THE_BUTTONS = [
    <StepButton {...commonStepProps}
      step={{
        kind: "move_absolute",
        args: {
          location: NOTHING_SELECTED,
          offset: { kind: "coordinate", args: { x: 0, y: 0, z: 0 } },
          speed: CONFIG_DEFAULTS.speed
        }
      }}
      color="blue">
      {t("MOVE TO")}
    </StepButton>,
    <StepButton {...commonStepProps}
      step={{
        kind: "move_relative",
        args: { x: 0, y: 0, z: 0, speed: CONFIG_DEFAULTS.speed }
      }}
      color="green">
      {t("MOVE RELATIVE")}
    </StepButton>,
    <StepButton {...commonStepProps}
      step={{
        kind: "write_pin",
        args: { pin_number: NOTHING_SELECTED, pin_value: 0, pin_mode: 0 }
      }}
      color="orange">
      {t("CONTROL PERIPHERAL")}
    </StepButton>,
    <StepButton {...commonStepProps}
      step={{
        kind: "read_pin",
        args: {
          pin_number: NOTHING_SELECTED,
          pin_mode: 0,
          label: "---"
        }
      }}
      color="yellow">
      {t("READ SENSOR")}
    </StepButton>,
    <StepButton {...commonStepProps}
      step={{
        kind: "wait",
        args: { milliseconds: 0 }
      }}
      color="brown">
      {t("WAIT")}
    </StepButton>,
    <StepButton {...commonStepProps}
      step={{
        kind: "send_message",
        args: {
          message: t("FarmBot is at position ") + "{{ x }}, {{ y }}, {{ z }}.",
          message_type: MessageType.success
        }
      }}
      color="red">
      {t("SEND MESSAGE")}
    </StepButton>,
    <StepButton{...commonStepProps}
      step={{
        kind: "find_home",
        args: {
          axis: "all",
          speed: 100
        }
      }}
      color="blue">
      {t("Find Home")}
    </StepButton>,
    <StepButton {...commonStepProps}
      step={{
        kind: "_if",
        args: {
          lhs: "x",
          op: "is",
          rhs: 0,
          _then: { kind: "nothing", args: {} },
          _else: { kind: "nothing", args: {} }
        }
      }}
      color="purple">
      {t("IF STATEMENT")}
    </StepButton>,
    <StepButton {...commonStepProps}
      step={{
        kind: "execute",
        args: { sequence_id: 0 }
      }}
      color="gray">
      {t("EXECUTE SEQUENCE")}
    </StepButton>,
    <StepButton {...commonStepProps}
      step={{
        kind: "execute_script",
        args: { label: "plant-detection" }
      }}
      color="pink">
      {t("Run Farmware")}
    </StepButton>,
    <StepButton
      {...commonStepProps}
      color="brown"
      step={{ kind: "take_photo", args: {} }} >
      {t("TAKE PHOTO")}
    </StepButton>,
  ];

  shouldDisplay(Feature.mark_as_step) && ALL_THE_BUTTONS.push(<StepButton
    {...commonStepProps}
    step={{
      kind: "resource_update",
      args: {
        resource_type: "Device",
        resource_id: 0,
        label: "mounted_tool_id",
        value: 0
      }
    }}
    color="brown">
    {t("Mark As...")}
  </StepButton>
  );

  return <div>
    <Row>
      <div className="step-button-cluster">
        {ALL_THE_BUTTONS.map((stepButton, inx) =>
          <div key={inx} onClick={() => scrollToBottom("sequenceDiv")}>
            {stepButton}
          </div>)}
      </div>
    </Row>
  </div>;
}
