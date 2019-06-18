import * as React from "react";
import { push } from "../history";
import { SequencesListProps, SequencesListState } from "./interfaces";
import { sortResourcesById, urlFriendly, lastUrlChunk } from "../util";
import { Row, Col } from "../ui/index";
import { TaggedSequence } from "farmbot";
import { init } from "../api/crud";
import { Content } from "../constants";
import { StepDragger, NULL_DRAGGER_ID } from "../draggable/step_dragger";
import { Link } from "../link";
import { setActiveSequenceByName } from "./set_active_sequence_by_name";
import { UUID, VariableNameSet } from "../resources/interfaces";
import { variableList } from "./locals_list/variable_support";
import { t } from "../i18next_wrapper";
import { EmptyStateWrapper, EmptyStateGraphic } from "../ui/empty_state_wrapper";

const filterFn = (searchTerm: string) => (seq: TaggedSequence): boolean => seq
  .body
  .name
  .toLowerCase()
  .includes(searchTerm);

const sequenceList = (props: {
  dispatch: Function,
  resourceUsage: Record<UUID, boolean | undefined>,
  sequenceMetas: Record<UUID, VariableNameSet | undefined>
}) =>
  (ts: TaggedSequence) => {
    const css =
      [`fb-button`, `block`, `full-width`, `${ts.body.color || "purple"}`];
    lastUrlChunk() === urlFriendly(ts.body.name) && css.push("active");
    const { uuid } = ts;
    const nameWithSaveIndicator = ts.body.name + (ts.specialStatus ? "*" : "");
    const inUse = !!props.resourceUsage[uuid];
    const variableData = props.sequenceMetas[uuid];

    return <div className="sequence-list-items" key={uuid}>
      <StepDragger
        dispatch={props.dispatch}
        step={{
          kind: "execute",
          args: { sequence_id: ts.body.id || 0 },
          body: variableList(variableData)
        }}
        intent="step_splice"
        draggerId={NULL_DRAGGER_ID}>
        <Link
          to={`/app/sequences/${urlFriendly(ts.body.name) || ""}`}
          key={uuid}
          onClick={setActiveSequenceByName}>
          <button className={css.join(" ")} draggable={true}>
            <label>{nameWithSaveIndicator}</label>
            {inUse &&
              <i className="in-use fa fa-hdd-o" title={t(Content.IN_USE)} />}
          </button>
        </Link>
      </StepDragger>
    </div>;
  };

const emptySequenceBody = (seqCount: number): TaggedSequence["body"] => ({
  name: t("new sequence {{ num }}", { num: seqCount }),
  args: {
    version: -999,
    locals: { kind: "scope_declaration", args: {} },
  },
  color: "gray",
  kind: "sequence",
  body: []
});

interface SequenceListHeaderProps {
  onChange(e: React.SyntheticEvent<HTMLInputElement>): void;
  sequenceCount: number;
  dispatch: Function;
}

const SequenceListHeader = (props: SequenceListHeaderProps) =>
  <div className={"panel-top with-button"}>
    <div className="thin-search-wrapper">
      <div className="text-input-wrapper">
        <i className="fa fa-search"></i>
        <input
          onChange={props.onChange}
          placeholder={t("Search Sequences...")} />
      </div>
    </div>
    <button
      className="fb-button green add"
      onClick={() => {
        const newSequence = emptySequenceBody(props.sequenceCount);
        props.dispatch(init("Sequence", newSequence));
        push("/app/sequences/" + urlFriendly(newSequence.name));
        setActiveSequenceByName();
      }}>
      <i className="fa fa-plus" />
    </button>
  </div>;

export class SequencesList extends
  React.Component<SequencesListProps, SequencesListState> {

  state: SequencesListState = {
    searchTerm: ""
  };

  onChange = (e: React.SyntheticEvent<HTMLInputElement>) =>
    this.setState({ searchTerm: e.currentTarget.value });

  render() {
    const { sequences, dispatch, resourceUsage, sequenceMetas } = this.props;
    const searchTerm = this.state.searchTerm.toLowerCase();
    return <div>
      <SequenceListHeader
        dispatch={dispatch}
        sequenceCount={this.props.sequences.length}
        onChange={this.onChange} />
      <Row>
        <Col xs={12}>
          <EmptyStateWrapper
            notEmpty={sequences.length > 0}
            graphic={EmptyStateGraphic.sequences}
            title={t("No Sequences.")}
            text={Content.NO_SEQUENCES}>
            {sequences.length > 0 &&
              <div className="sequence-list">
                {sortResourcesById(sequences)
                  .filter(filterFn(searchTerm))
                  .map(sequenceList({ dispatch, resourceUsage, sequenceMetas }))}
              </div>}
          </EmptyStateWrapper>
        </Col>
      </Row>
    </div>;
  }
}
