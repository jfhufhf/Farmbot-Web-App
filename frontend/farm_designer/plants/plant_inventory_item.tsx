import * as React from "react";
import moment from "moment";
import { DEFAULT_ICON, svgToUrl } from "../../open_farm/icons";
import { push } from "../../history";
import { Actions } from "../../constants";
import { TaggedPlant } from "../map/interfaces";
import { get } from "lodash";
import { unpackUUID } from "../../util";
import { t } from "../../i18next_wrapper";
import { cachedCrop } from "../../open_farm/cached_crop";

type IMGEvent = React.SyntheticEvent<HTMLImageElement>;

export interface PlantInventoryItemProps {
  tpp: TaggedPlant;
  dispatch: Function;
  hovered: boolean;
}

interface PlantInventoryItemState {
  icon: string;
}

// The individual plants that show up in the farm designer sub nav.
export class PlantInventoryItem extends
  React.Component<PlantInventoryItemProps, PlantInventoryItemState> {

  state: PlantInventoryItemState = { icon: "" };

  render() {
    const plant = this.props.tpp.body;
    const { tpp, dispatch } = this.props;
    const plantId = (plant.id || "ERR_NO_PLANT_ID").toString();

    const toggle = (action: "enter" | "leave") => {
      const { icon } = this.state;
      const isEnter = action === "enter";
      dispatch({
        type: Actions.TOGGLE_HOVERED_PLANT, payload: {
          plantUUID: (isEnter ? tpp.uuid : undefined),
          icon: (isEnter ? icon : "")
        }
      });
    };

    const click = () => {
      const plantCategory =
        unpackUUID(this.props.tpp.uuid).kind === "PlantTemplate"
          ? "saved_gardens/templates"
          : "plants";
      push(`/app/designer/${plantCategory}/${plantId}`);
      dispatch({ type: Actions.SELECT_PLANT, payload: [tpp.uuid] });
    };

    // See `cachedIcon` for more details on this.
    const maybeGetCachedIcon = (e: IMGEvent) => {
      const OFS = tpp.body.openfarm_slug;
      const img = e.currentTarget;
      OFS && cachedCrop(OFS)
        .then((crop) => {
          const i = svgToUrl(crop.svg_icon);
          i !== img.getAttribute("src") && img.setAttribute("src", i);
          this.setState({ icon: i });
        });
    };

    // Name given from OpenFarm's API.
    const label = plant.name || "Unknown plant";

    // Original planted date vs time now to determine age.
    const getPlantedAt = get(plant, "planted_at", moment());
    const createdAt = get(plant, "created_at", moment());
    const plantedAt = getPlantedAt
      ? moment(getPlantedAt)
      : moment(createdAt);
    const currentDay = moment();
    const daysOld = currentDay.diff(plantedAt, "days") + 1;

    return <div
      className={`plant-search-item ${this.props.hovered ? "hovered" : ""}`}
      key={plantId}
      onMouseEnter={() => toggle("enter")}
      onMouseLeave={() => toggle("leave")}
      onClick={click}>
      <img
        className="plant-search-item-image"
        src={DEFAULT_ICON}
        onLoad={maybeGetCachedIcon} />
      <span className="plant-search-item-name">
        {label}
      </span>
      <i className="plant-search-item-age">
        {daysOld} {t("days old")}
      </i>
    </div>;
  }
}
