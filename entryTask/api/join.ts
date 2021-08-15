import fetchAPI, { EHttpStatus, EMethod } from "../http";
import logger from "../logger";

interface IJoinReq {
  username: string;
  password: string;
  email: string;
}

interface IJoinRes {
  token: string;
  user: IUser;
}

interface IUser {
  id: string;
  username: string;
  email: string;
}

export default async function join({
  username,
  password,
  email,
}: IJoinReq): Promise<IJoinRes> {
  try {
    const res = await fetchAPI<IJoinRes>({
      method: EMethod.POST,
      url: '/join',
      data: {
        username,
        password,
        email,
      }
    });
    logger.warn('TODO: save token into redux-store and localStorage?');
    return res;
  } catch (httpCode) {
    if (httpCode === EHttpStatus.BadRequest) {
      logger.error('Username or password missing');
    } else if (httpCode === EHttpStatus.InvalidToken) {
      logger.error('Username already exists');
    } else {
      logger.assert(`unhandled httpCode: ${httpCode}`);
    }
    throw httpCode;
  }
}

// usage
async function onSignUpClicked() {
  const username = 'xiaohan';
  const password = '123456';
  const email = 'xiao.han@shopee.com';
  try {
    const res = await join({
      username,
      password,
      email,
    });
    logger.log(`register user succeed: ${JSON.stringify(res)}`);
  } catch (httpCode) {
    logger.error(`register user failed: ${httpCode}`);
  }
}
