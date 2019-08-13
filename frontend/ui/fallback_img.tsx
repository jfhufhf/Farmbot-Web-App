import * as React from "react";
import { defensiveClone } from "../util";
import { t } from "../i18next_wrapper";

type ImgTag = React.HTMLProps<HTMLImageElement>;

interface Props extends ImgTag {
  src: string;
  fallback: string;
}


type State = Partial<{ needsFallback: boolean }>;
/** Like a normal `<img>`, but it has a `fallback` URL if the image does not
 * load*/
export class FallbackImg extends React.Component<Props, State> {

  state: State = { needsFallback: false };

  componentWillReceiveProps(next: Props) {
    // Sorry. The webcam page needs live updates. <img/> tag was acting wonky.
    (next.src !== this.props.src) && this.setState({ needsFallback: false });
  }

  fallback = () => {
    return <div className="webcam-stream-unavailable">
      <img src={this.props.fallback} style={{ maxWidth: "100%" }} />
      <p>
        {t("Unable to load webcam feed.")}
      </p>
    </div>;
  }

  dontFallback = () => {
    const imgProps: Props = defensiveClone(this.props);
    delete imgProps.fallback;
    const onError = () => this.setState({ needsFallback: true });
    const splitSrc = this.props.src.split(" ");
    const displaySrc = () => {
      switch (splitSrc[0]) {
        case "iframe":
          return <iframe src={splitSrc[1]} />;
        default:
          return <video id="myPlayer" controls playsInline webkit-playsinline autoplay width="100%">  
            <source src="rtmp://rtmp01open.ys7.com/openlive/b49a95384255423c8076fee999945089.hd" type="rtmp/flv" />  
          </video>;
      }
    };
    return <div className="webcam-stream-valid">
      {displaySrc()}
    </div>;
  }

  render() {
    return (this.state.needsFallback ? this.fallback : this.dontFallback)();
  }
}
