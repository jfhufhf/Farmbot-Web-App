import * as React from "react";
import { connect } from "react-redux";
import { ToolsState, Props } from "./interfaces";
import { Col, Row, Page } from "../ui";
import { ToolBayList, ToolBayForm, ToolList, ToolForm } from "./components";
import { mapStateToProps } from "./state_to_props";

@connect(mapStateToProps)
export class Tools extends React.Component<Props, Partial<ToolsState>> {
  state: ToolsState = { editingBays: false, editingTools: false };

  toggle = (name: keyof ToolsState) =>
    () => this.setState({ [name]: !this.state[name] });

  render() {
    return <Page className="tools-page">
      <Row>
        <Col sm={7}>
          {this.state.editingBays
            ? <ToolBayForm
              toggle={this.toggle("editingBays")}
              dispatch={this.props.dispatch}
              botPosition={this.props.botPosition}
              toolSlots={this.props.toolSlots}
              getToolSlots={this.props.getToolSlots}
              getChosenToolOption={this.props.getChosenToolOption}
              getToolOptions={this.props.getToolOptions}
              changeToolSlot={this.props.changeToolSlot} />
            : <ToolBayList
              toggle={this.toggle("editingBays")}
              getToolByToolSlotUUID={this.props.getToolByToolSlotUUID}
              getToolSlots={this.props.getToolSlots} />}
        </Col>
        <Col sm={5}>
          {this.state.editingTools
            ? <ToolForm
              isActive={this.props.isActive}
              toggle={this.toggle("editingTools")}
              dispatch={this.props.dispatch}
              tools={this.props.tools} />
            : <ToolList
              isActive={this.props.isActive}
              toggle={this.toggle("editingTools")}
              dispatch={this.props.dispatch}
              tools={this.props.tools} />}
        </Col>
      </Row>
    </Page>;
  }
}
