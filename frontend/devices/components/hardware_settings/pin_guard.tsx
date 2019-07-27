import * as React from "react";
import { PinGuardMCUInputGroup } from "../pin_guard_input_group";
import { PinGuardProps } from "../interfaces";
import { Header } from "./header";
import { Collapse } from "@blueprintjs/core";
import { Row, Col } from "../../../ui/index";
import { SpacePanelToolTip } from "../space_panel_tool_tip";
import { ToolTips } from "../../../constants";
import { t } from "../../../i18next_wrapper";

export function PinGuard(props: PinGuardProps) {

  const { pin_guard } = props.controlPanelState;
  const { dispatch, sourceFwConfig, resources } = props;

  return <section>
    <Header
      expanded={pin_guard}
      title={t("Pin Guard")}
      name={"pin_guard"}
      dispatch={dispatch} />
    <Collapse isOpen={!!pin_guard}>
      <Row>
        <Col xs={3} xsOffset={3}>
          <label>
            {t("Pin Number")}
          </label>
          <SpacePanelToolTip tooltip={ToolTips.PIN_GUARD_PIN_NUMBER} />
        </Col>
        <Col xs={4}>
          <label>
            {t("Timeout (sec)")}
          </label>
        </Col>
        <Col xs={2} className={"centered-button-div"}>
          <label>
            {t("To State")}
          </label>
        </Col>
      </Row>
      <PinGuardMCUInputGroup
        name={t("Pin Guard {{ num }}", { num: 1 })}
        pinNumKey={"pin_guard_1_pin_nr"}
        timeoutKey={"pin_guard_1_time_out"}
        activeStateKey={"pin_guard_1_active_state"}
        dispatch={dispatch}
        resources={resources}
        sourceFwConfig={sourceFwConfig} />
      <PinGuardMCUInputGroup
        name={t("Pin Guard {{ num }}", { num: 2 })}
        pinNumKey={"pin_guard_2_pin_nr"}
        timeoutKey={"pin_guard_2_time_out"}
        activeStateKey={"pin_guard_2_active_state"}
        dispatch={dispatch}
        resources={resources}
        sourceFwConfig={sourceFwConfig} />
      <PinGuardMCUInputGroup
        name={t("Pin Guard {{ num }}", { num: 3 })}
        pinNumKey={"pin_guard_3_pin_nr"}
        timeoutKey={"pin_guard_3_time_out"}
        activeStateKey={"pin_guard_3_active_state"}
        dispatch={dispatch}
        resources={resources}
        sourceFwConfig={sourceFwConfig} />
      <PinGuardMCUInputGroup
        name={t("Pin Guard {{ num }}", { num: 4 })}
        pinNumKey={"pin_guard_4_pin_nr"}
        timeoutKey={"pin_guard_4_time_out"}
        activeStateKey={"pin_guard_4_active_state"}
        dispatch={dispatch}
        resources={resources}
        sourceFwConfig={sourceFwConfig} />
      <PinGuardMCUInputGroup
        name={t("Pin Guard {{ num }}", { num: 5 })}
        pinNumKey={"pin_guard_5_pin_nr"}
        timeoutKey={"pin_guard_5_time_out"}
        activeStateKey={"pin_guard_5_active_state"}
        dispatch={dispatch}
        resources={resources}
        sourceFwConfig={sourceFwConfig} />
    </Collapse>
  </section>;
}
