//登录页
import * as React from "react";
import axios from "axios";

import { error as log, success, init as logInit } from "farmbot-toastr";
import { AuthState } from "../auth/interfaces";
import { prettyPrintApiErrors, attachToRoot } from "../util";
import { API } from "../api";                         //请求接口的地址
import { Session } from "../session";                 //持有用户JWT的密钥
import { FrontPageState, SetterCB } from "./interfaces";   //值
import { Row, Col } from "../ui/index";                //封装的布局页面
import { LoginProps, Login } from "./login";             //登录块
import { ForgotPassword, ForgotPasswordProps } from "./forgot_password";   //忘记密码
import { ResendVerification } from "./resend_verification";
import { CreateAccount } from "./create_account";                       //注册账户
import { Content } from "../constants";                                  //提示信息
import { LaptopSplash } from "./laptop_splash";                           //登录页右边电脑
import { TermsCheckbox } from "./terms_checkbox";
import { get } from "lodash";                                      //JavaScript 实用工具库
import { t } from "../i18next_wrapper";                            //双语言

export const attachFrontPage =
  () => attachToRoot(FrontPage, {});

const showFor = (size: string[], extraClass?: string): string => {
  const ALL_SIZES = ["xs", "sm", "md", "lg", "xl"];
  const HIDDEN_SIZES = ALL_SIZES.filter(x => !size.includes(x));
  const classNames = HIDDEN_SIZES.map(x => "hidden-" + x);
  if (extraClass) { classNames.push(extraClass); }
  return classNames.join(" ");
};

export interface PartialFormEvent {
  currentTarget: {
    checked: boolean;
    defaultValue: string;
    value: string;
  }
}

/** Set value for front page state field (except for "activePanel"). */
export const setField =
  (name: keyof Omit<FrontPageState, "activePanel">, cb: SetterCB) =>
    (event: PartialFormEvent) => {
      const state: Partial<FrontPageState> = {};

      switch (name) {
        // Booleans
        case "agreeToTerms":
        case "registrationSent":
          state[name] = event.currentTarget.checked;
          break;
        // all others (string)
        default:
          state[name] = event.currentTarget.value;
      }
      cb(state);
    };

export class FrontPage extends React.Component<{}, Partial<FrontPageState>> {
  constructor(props: {}) {
    super(props);
    this.state = {
      registrationSent: false,
      regEmail: "",
      regName: "",
      regPassword: "",
      regConfirmation: "",
      email: "",
      loginPassword: "",
      agreeToTerms: false,
      activePanel: "login"
    };
  }

  componentDidMount() {
    if (Session.fetchStoredToken()) { window.location.assign("/app/controls"); }else{
        var something:any;
        something =  window.navigator.userAgent.toLowerCase();
      if(something.match(/MicroMessenger/i) == 'micromessenger'){
          var appid:string = 'wx670b5b928b90c9ab';
          let redirectUrl:string = 'http://120.77.169.211/index.php ';
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+redirectUrl+'&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
          
        //  API.setBaseUrl(API.fetchBrowserLocation());
        //   axios.post<AuthState>(API.current.tokensWechat)
        //     .then(resp => {
        //       // Session.replaceToken(resp.data);
        //       // Session.replaceToken({"token":{"unencoded":{"aud":"unknown","sub":2,"iat":1562659396,"jti":"35e47a93-f359-4648-b3fb-48188e45dff6","iss":"//120.77.169.211:3000","exp":1566115396,"mqtt":"120.77.169.211","bot":"device_2","vhost":"/","mqtt_ws":"ws://120.77.169.211:3002/ws","os_update_server":"https://api.github.com/repos/farmbot/farmbot_os/releases/latest","beta_os_update_server":"https://api.github.com/repos/FarmBot/farmbot_os/releases/latest"},"encoded":"eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJ1bmtub3duIiwic3ViIjoyLCJpYXQiOjE1NjI2NTkzOTYsImp0aSI6IjM1ZTQ3YTkzLWYzNTktNDY0OC1iM2ZiLTQ4MTg4ZTQ1ZGZmNiIsImlzcyI6Ii8vMTIwLjc3LjE2OS4yMTE6MzAwMCIsImV4cCI6MTU2NjExNTM5NiwibXF0dCI6IjEyMC43Ny4xNjkuMjExIiwiYm90IjoiZGV2aWNlXzIiLCJ2aG9zdCI6Ii8iLCJtcXR0X3dzIjoid3M6Ly8xMjAuNzcuMTY5LjIxMTozMDAyL3dzIiwib3NfdXBkYXRlX3NlcnZlciI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvZmFybWJvdC9mYXJtYm90X29zL3JlbGVhc2VzL2xhdGVzdCIsImJldGFfb3NfdXBkYXRlX3NlcnZlciI6Imh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvRmFybUJvdC9mYXJtYm90X29zL3JlbGVhc2VzL2xhdGVzdCJ9.DWNvAUnC3h3WLTRXuQyOS_VPq3PrmcqBLK2ACZJutvoRRLuss8rXmsGSe-2jJiReYP1rHJH7dlDME2kXuj6MlYx6uQbsZGspdsvChD-l3RH5f45yvU36cLtg3AtksHTCA0idGYJaGAFbOa2Mfm9wbHiBTCkqBc53ZnSkEExEXj-YaZ1F8nsJ6IprADX_4nBgD_yKT6syVjNk3x017wY-NHixEMsXzB17AyF3N2Zn9VYVwQ2Sjl9gp8yWvWZ24AJlxQCv3LthfcNoO48kh9o40GCzvWIIXA5lG4LABo6LJ00xgaUDPgEwj9DVN8aqSyjzZjB1SLeO_BqGE75cXc3hDQ"},"user":{"id":2,"device_id":2,"name":"555","email":"18695694535@qq.com","created_at":"2019-07-09T08:03:08.990Z","updated_at":"2019-07-09T08:03:09.331Z","agreed_to_terms_at":"2019-07-09T08:03:08.170Z"}});
        //       // window.location.assign("/app/controls");

        //     }).catch((error: Error) => {
        //       switch (get(error, "response.status")) {
        //         case 451: // TOS was updated; User must agree to terms.
        //           window.location.assign("/tos_update");
        //           break;
        //         case 403: // User did not click verification email link.
        //           log(t("Account Not Verified"));
        //           this.setState({ activePanel: "resendVerificationEmail" });
        //           break;
        //         default:
        //           log(prettyPrintApiErrors(error as {}));
        //       }
        //       this.setState({ loginPassword: "" });
        //     }); 
      }else{
          logInit();
          API.setBaseUrl(API.fetchBrowserLocation());
          this.setState({});
      }
    }
   
  }

  submitLogin = (e: React.FormEvent<{}>) => {
    e.preventDefault();
    const { email, loginPassword } = this.state;
    const payload = { user: { email, password: loginPassword } };
    API.setBaseUrl(API.fetchBrowserLocation());
    axios.post<AuthState>(API.current.tokensPath, payload)
      .then(resp => {
        Session.replaceToken(resp.data);
        window.location.assign("/app/controls");
      }).catch((error: Error) => {
        switch (get(error, "response.status")) {
          case 451: // TOS was updated; User must agree to terms.
            window.location.assign("/tos_update");
            break;
          case 403: // User did not click verification email link.
            log(t("Account Not Verified"));
            this.setState({ activePanel: "resendVerificationEmail" });
            break;
          default:
            log(prettyPrintApiErrors(error as {}));
        }
        this.setState({ loginPassword: "" });
      });
  }

  submitRegistration = (e: React.FormEvent<{}>) => {
    e.preventDefault();
    const {
      regEmail,
      regName,
      regPassword,
      regConfirmation,
      agreeToTerms
    } = this.state;

    const form = {
      user: {
        name: regName,
        email: regEmail,
        password: regPassword,
        password_confirmation: regConfirmation,
        agree_to_terms: agreeToTerms
      }
    };
    axios.post(API.current.usersPath, form).then(() => {
      const m = "Almost done! Check your email for the verification link.";
      success(t(m), t("Success"));
      this.setState({ registrationSent: true });
    }).catch(error => {
      log(prettyPrintApiErrors(error));
    });
  }

  toggleForgotPassword = () => this.setState({ activePanel: "forgotPassword" });

  submitForgotPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email } = this.state;
    const data = { email };
    axios.post(API.current.passwordResetPath, data)
      .then(() => {
        success(t("Email has been sent."), t("Forgot Password"));
        this.setState({ activePanel: "login" });
      }).catch(error => {
        let errorMessage = prettyPrintApiErrors(error);
        if (errorMessage.toLowerCase().includes("not found")) {
          errorMessage =
            `That email address is not associated with an account.`;
        }
        log(t(errorMessage));
      });
  }

  handleFormUpdate: SetterCB = (state) => this.setState(state);

  maybeRenderTos = () => {
    if (globalConfig.TOS_URL) {
      return <TermsCheckbox
        privUrl={globalConfig.PRIV_URL}
        tosUrl={globalConfig.TOS_URL}
        onChange={setField("agreeToTerms", this.handleFormUpdate)}
        agree={this.state.agreeToTerms} />;
    }
  }

  loginPanel = () => {
    const props: LoginProps = {
      email: this.state.email || "",
      onEmailChange: setField("email", this.handleFormUpdate),
      onLoginPasswordChange: setField("loginPassword", this.handleFormUpdate),
      onToggleForgotPassword: this.toggleForgotPassword,
      onSubmit: this.submitLogin,
    };
    return <Login {...props} />;
  }

  forgotPasswordPanel = () => {
    const goBack = () => this.setState({ activePanel: "login" });
    const props: ForgotPasswordProps = {
      onGoBack: goBack,
      onSubmit: this.submitForgotPassword,
      email: this.state.email || "",
      onEmailChange: setField("email", this.handleFormUpdate),
    };
    return <ForgotPassword {...props} />;
  }

  resendVerificationPanel = () => {
    const goBack = () => this.setState({ activePanel: "login" });
    return <ResendVerification
      onGoBack={goBack}
      ok={() => {
        success(t(Content.VERIFICATION_EMAIL_RESENT));
        goBack();
      }}
      no={() => {
        log(t(Content.VERIFICATION_EMAIL_RESEND_ERROR));
        goBack();
      }}
      email={this.state.email || ""} />;
  }

  activePanel = () => {
    switch (this.state.activePanel) {
      case "forgotPassword": return this.forgotPasswordPanel();
      case "resendVerificationEmail": return this.resendVerificationPanel();
      case "login":
      default:
        return this.loginPanel();
    }
  }

  defaultContent() {
    return <div className="static-page">
     <div className = 'banner_log_X'>
           <img className = 'banner_log_IMG' src="/app-resources/img/log_1.png"/>
      </div>
      <Row>
        <Col xs={12}>
          <h1 className="text-center">
            {t("Welcome to the")}
            <br className={showFor(["xs"])} />
            &nbsp;
              {t("FarmBot Web App")}
          </h1>
        </Col>
      </Row>

      <div className="inner-width">
        <Row>
          <h2 className="text-center">
            <Col xs={12}>
              <span className={showFor(["md", "lg", "xl"])}>
                {t("computer")}
              </span>
              <span className={showFor(["sm"])}>
                {t("tablet")}
              </span>
              <span className={showFor(["xs"])}>
                {t("smartphone")}
              </span>
              {t("Setup, customize, and control FarmBot from your")}
              &nbsp;
            </Col>
          </h2>
        </Row>
        <LaptopSplash className={showFor(["md", "lg", "xl"], "col-md-7")} />
        <img
          className={showFor(["sm"], "col-md-7")}
          src="/app-resources/img/farmbot-tablet.png" />
        <Row>
          <this.activePanel />
          <CreateAccount
            submitRegistration={this.submitRegistration}
            sent={!!this.state.registrationSent}
            get={(key) => this.state[key]}
            set={(key, val) => this.setState({ [key]: val })}>
            {this.maybeRenderTos()}
          </CreateAccount>
        </Row>
      </div>
    </div>;
  }

  render() { return Session.fetchStoredToken() ? <div /> : this.defaultContent(); }
}
