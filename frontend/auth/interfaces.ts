export interface Token {
  unencoded: UnencodedToken;
  encoded: string;
}

export interface AuthState {
  token: Token;
}

export interface UnencodedToken {
  /** ISSUER - Where token came from (API URL). */
  /** 发布方——令牌的来源(API URL)。 */
  iss: string;
  /** Where to download RPi software */
  os_update_server: string;
  /** Where to download beta RPi software */
  beta_os_update_server?: string;
  /** JSON Token Identifier- auto sync needs this to hear its echo on MQTT */
  /** 子令牌标识符——自动同步需要这个来在MQTT上听到它的echo */
  jti: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}
