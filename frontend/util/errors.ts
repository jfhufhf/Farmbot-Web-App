import { Dictionary } from "farmbot";

import { Content } from "../constants";
import { capitalize, map } from "lodash";
import { t } from "../i18next_wrapper";

export interface AxiosErrorResponse {
  response?: {
    data: {
      [reason: string]: string
    };
  };
}

const mapper = (v: string, k: string) => {
  // "Reason: Explanation lorem ipsum dolor ipsum."
  const reason = capitalize(("" + k).split("_").join(" "));
  const explanation = v.toString();

  return t(`${reason}: ${explanation}`);
};

/** Concats and capitalizes all of the error key/value
 *  pairs returned by the /api/xyz endpoint. */
export function prettyPrintApiErrors(err: AxiosErrorResponse) {
  const errors = safelyFetchErrors(err);
  return map(errors, mapper).join(" ");
}

function safelyFetchErrors(err: AxiosErrorResponse): Dictionary<string> {
  // In case the interpreter gives us an oddball error message.
  if (err && err.response && err.response.data) {
    return err.response.data;
  } else {
    return {
      error: t(Content.WEB_APP_DISCONNECTED)
    };
  }
}

export function bail(message: string): never {
  throw new Error(message);
}

export const catchErrors = (error: Error) => {
  if (window.Rollbar && window.Rollbar.error) {
    window.Rollbar.error(error);
  } else {
    throw error;
  }
};
