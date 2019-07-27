import * as React from "react";
import { t } from "../i18next_wrapper";

interface WidgetBodyProps {
  children?: React.ReactNode;
}

export function WidgetBody(props: WidgetBodyProps) {
  return <div className="widget-body">
    {t(props.children)}
  </div>;
}
