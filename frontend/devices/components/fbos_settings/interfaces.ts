import {
  SourceFbosConfig, BotState, ControlPanelState, ShouldDisplay,
  SaveFarmwareEnv, UserEnv
} from "../../interfaces";
import { InformationalSettings, TaggedDevice, Alert } from "farmbot";
import { TimeSettings } from "../../../interfaces";

export interface AutoSyncRowProps {
  dispatch: Function;
  sourceFbosConfig: SourceFbosConfig;
}

export interface AutoUpdateRowProps {
  dispatch: Function;
  sourceFbosConfig: SourceFbosConfig;
}

export interface CameraSelectionProps {
  env: UserEnv;
  botOnline: boolean;
  saveFarmwareEnv: SaveFarmwareEnv;
  shouldDisplay: ShouldDisplay;
  dispatch: Function;
}

export interface CameraSelectionState {
  cameraStatus: "" | "sending" | "done" | "error";
}

export interface BoardTypeProps {
  botOnline: boolean;
  bot: BotState;
  alerts: Alert[];
  dispatch: Function;
  shouldDisplay: ShouldDisplay;
  timeSettings: TimeSettings;
  sourceFbosConfig: SourceFbosConfig;
}

export interface PowerAndResetProps {
  controlPanelState: ControlPanelState;
  dispatch: Function;
  sourceFbosConfig: SourceFbosConfig;
  shouldDisplay: ShouldDisplay;
  botOnline: boolean;
}

export interface FactoryResetRowProps {
  dispatch: Function;
  sourceFbosConfig: SourceFbosConfig;
  botOnline: boolean;
}

export interface FarmbotOsRowProps {
  bot: BotState;
  osReleaseNotesHeading: string;
  osReleaseNotes: string;
  dispatch: Function;
  sourceFbosConfig: SourceFbosConfig;
  shouldDisplay: ShouldDisplay;
  botOnline: boolean;
  botToMqttLastSeen: string;
  timeSettings: TimeSettings;
  deviceAccount: TaggedDevice;
}

export interface FbosDetailsProps {
  botInfoSettings: InformationalSettings;
  dispatch: Function;
  shouldDisplay: ShouldDisplay;
  sourceFbosConfig: SourceFbosConfig;
  botToMqttLastSeen: string;
  timeSettings: TimeSettings;
  deviceAccount: TaggedDevice;
}

export interface OsUpdateButtonProps {
  bot: BotState;
  sourceFbosConfig: SourceFbosConfig;
  botOnline: boolean;
  shouldDisplay: ShouldDisplay;
}
