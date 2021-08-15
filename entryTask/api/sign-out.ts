import fetchAPI, { EHttpStatus, EMethod } from "../http";
import logger from "../logger";

export default async function signOut() {
  try {
    await fetchAPI({
      method: EMethod.DELETE,
      url: '/auth/token',
    });
    logger.warn('TODO: remove token from redux-store and localStorage');
  } catch (httpCode) {
    if (httpCode === EHttpStatus.InvalidToken) {
      logger.error('Invalid token');
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
    await signOut();
    logger.log('signout user succeed');
  } catch (httpCode) {
    logger.error(`signout user failed: ${httpCode}`);
  }
}
