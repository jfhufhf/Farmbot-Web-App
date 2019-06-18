jest.mock("../index", () => ({
  dispatchNetworkDown: jest.fn(),
  dispatchNetworkUp: jest.fn()
}));

const mockTimestamp = 0;
jest.mock("../../util", () => ({ timestamp: () => mockTimestamp }));

import {
  readPing,
  markStale,
  markActive,
  isInactive,
  startPinging,
  ACTIVE_THRESHOLD,
  PING_INTERVAL
} from "../ping_mqtt";
import { Farmbot, RpcRequest, RpcRequestBodyItem } from "farmbot";
import { dispatchNetworkDown, dispatchNetworkUp } from "../index";
import { FarmBotInternalConfig } from "farmbot/dist/config";

const TOO_LATE_TIME_DIFF = ACTIVE_THRESHOLD + 1;
const ACCEPTABLE_TIME_DIFF = ACTIVE_THRESHOLD - 1;

const state: Partial<FarmBotInternalConfig> = {
  LAST_PING_IN: 123,
  LAST_PING_OUT: 456
};

function fakeBot(): Farmbot {
  const fb: Partial<Farmbot> = {
    rpcShim: jest.fn((_: RpcRequestBodyItem[]): RpcRequest => ({
      kind: "rpc_request",
      args: {
        label: "ping",
        priority: 0
      }
    })),
    setConfig: jest.fn(),
    publish: jest.fn(),
    on: jest.fn(),
    ping: jest.fn((_timeout: number, _now: number) => Promise.resolve(1)),
    // TODO: Fix this typing (should be `FarmBotInternalConfig[typeof key]`).
    getConfig: jest.fn((key: keyof FarmBotInternalConfig) => state[key] as never),
  };

  return fb as Farmbot;
}

function expectStale() {
  expect(dispatchNetworkDown)
    .toHaveBeenCalledWith("bot.mqtt", undefined, expect.any(String));
}

function expectActive() {
  expect(dispatchNetworkUp)
    .toHaveBeenCalledWith("bot.mqtt", undefined, expect.any(String));
  expect(dispatchNetworkUp)
    .toHaveBeenCalledWith("user.mqtt", undefined, expect.any(String));
}

describe("ping util", () => {
  it("reads LAST_PING_(IN|OUT)", () => {
    const bot = fakeBot();
    expect(readPing(bot, "in")).toEqual(123);
    expect(readPing(bot, "out")).toEqual(456);
  });

  it("marks the bot's connection to MQTT as 'stale'", () => {
    markStale();
    expectStale();
  });

  it("marks the bot's connection to MQTT as 'active'", () => {
    markActive();
    expectActive();
  });

  it("checks if the bot isInactive()", () => {
    expect(isInactive(1, 1 + TOO_LATE_TIME_DIFF)).toBeTruthy();
    expect(isInactive(1, 1)).toBeFalsy();
    expect(isInactive(1, 1 + ACCEPTABLE_TIME_DIFF)).toBeFalsy();
  });

  it("binds event handlers with startPinging()", (done) => {
    const bot = fakeBot();
    startPinging(bot);
    setTimeout(() => {
      expect(bot.ping).toHaveBeenCalled();
      done();
    }, PING_INTERVAL + 10);
  });
});
