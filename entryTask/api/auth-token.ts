import fetchAPI, { EHttpStatus, EMethod } from "../http";
import logger from "../logger";

interface IAuthTokenReq {
  username: string;
  password: string;
}

interface IAuthTokenRes {
  token: string;
  user: IUser;
}

interface IUser {
  id: string;
  username: string;
  email: string;
}

export default async function authToken({
  username,
  password,
}: IAuthTokenReq): Promise<IAuthTokenRes> {
  try {
    const res = await fetchAPI<IAuthTokenRes>({
      method: EMethod.POST,
      url: '/auth/token',
      data: {
        username,
        password,
      }
    });
    logger.warn('TODO: save token into redux-store and localStorage?');
    return res;
  } catch (httpCode) {
    if (httpCode === EHttpStatus.BadRequest) {
      logger.error('Username or password missing');
    } else if (httpCode === EHttpStatus.InvalidToken) {
      logger.error('Invalid login credentials.');
    } else if (httpCode === EHttpStatus.NotFound) {
      logger.error('User not found.');
    } else {
      logger.assert(`unhandled httpCode: ${httpCode}`);
    }
    throw httpCode;
  }
}

// usage
async function onSignInClicked() {
  const username = 'xiaohan';
  const password = '123456';
  try {
    const res = await authToken({
      username,
      password,
    });
    logger.log(`login user succeed: ${JSON.stringify(res)}`);
  } catch (httpCode) {
    logger.error(`login user failed: ${httpCode}`);
  }
}
