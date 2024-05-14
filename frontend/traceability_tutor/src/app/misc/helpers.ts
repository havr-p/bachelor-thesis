import {environment} from "../../environments/environment";

export function getSocialLoginUrl(name: string) {
  console.log("test getSocialLoginUrl")
  return `/oauth2/authorization/${name}?redirect_uri=${environment.oauthRedirectUri}`
}

export const handleLogError = (error: any) => {
  if (error.response) {
    console.log(error.response.data)
  } else if (error.request) {
    console.log(error.request)
  } else {
    console.log(error.message)
  }
  }

export function parseUserFromJwt(token: string) {
  console.log("token BBBBBB");
  if (!token) { return }
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace('-', '+').replace('_', '/')
  const decoded = JSON.parse(window.atob(base64));
  if (decoded.exp) {
    decoded.exp = new Date(decoded.exp * 1000);
  }
  return decoded;
}
