import logger from "../logger";

export enum EMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface IFetchReq {
  method: EMethod;
  url: string;
  data?: {
    [key: string]: any;
  };
}

export enum EHttpStatus {
  Success = 200,
  BadRequest = 400,
  InvalidToken = 403,
  NotFound = 404,
};

async function cancelableFetch({
  method,
  url,
  data = {},
}: IFetchReq) {
  const tag = `[${method}][${url}]`;
  // support cancellation
  const abortController = new AbortController();
  const { signal } = abortController;
  const initOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    signal,
  };
  if (method === 'POST') {
    initOptions.body = JSON.stringify(data);
  }

  logger.log(`${tag} req: ${JSON.stringify(initOptions)}`);
  const response = fetch(url, initOptions);
  return {
    then(onResolve, onReject) {
      return response.then((res) => {
        logger.log(`${tag} succeed. res: ${res}`);
        const json = res.json(); // parses JSON response into native JavaScript objects
        onResolve(json);
      }, (err) => {
        logger.error(`${tag} failed. err: ${err.message || 'unknown error #1'}`);
        onReject(err);
      });
    },
    catch(onReject) {
      return response.catch((err) => {
        logger.error(`${tag} failed. err: ${err.message || 'unknown error #2'}`);
        onReject(err);
      });
    },
    cancel() {
      abortController.abort();
      return response.catch((err) => {
        if (err.name === 'AbortError') {
          logger.log(`${tag} has been aborted successfully.`);
          return 'ok';
        }

        const errmsg = `${tag} cannot be aborted because ${err.message || 'unknown error #3'}`;
        logger.error(errmsg);
        throw new Error(errmsg);
      });
    }
  }

    
    throw ``;

  
  return json;
}

const store = {
  token: 'test-token',
}

/**
 * 
 * @param param req
 * @returns A promise with type of T when success, otherwise a HttpCode for the rejected value.
 * -1 stands for unexpected error on fetchAPI.
 */
export default async function fetchAPI<T>({
  method,
  url,
  data = {},
}: IFetchReq): Promise<T> {
  const tag = `[${method}][${url}]`;
  
  // todo: get token from store?
  const token = store.token;

  const initOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-BLACKCAT-TOKEN': token,
    },
  };
  if (method === 'POST') {
    initOptions.body = JSON.stringify(data);
  }

  logger.log(`${tag} req: ${JSON.stringify(initOptions)}`);
  let response;
  try {
    response = await fetch(url, initOptions);
  } catch (err) {
    const errmsg = err.message || 'unknown error #1';
    logger.error(`${tag} failed because fetch API exception. errmsg: ${errmsg}`);
    return Promise.reject(-1);
  }

  // determine whether bussiness logic is correct
  // if failed because of not logged in, redirect to login page?
  const httpCode = response.status;
  if (httpCode !== EHttpStatus.Success) {
    logger.error(`${tag} failed with http ${httpCode}(${response.statusText}). res: ${response}`);
    const isNotLoggedIn = httpCode === EHttpStatus.InvalidToken;
    const isNotFound = httpCode === EHttpStatus.NotFound;
    if (isNotLoggedIn) {
      logger.warn(`${tag} failed because user hasn't logged in.`);
      logger.warn('TODO: dispatch to store? to show a relogin dialog??');
    } else if (isNotFound) {
      logger.error(`${tag} failed because bussiness logic error.`);
      logger.warn('TODO: dispatch to store? to show a logic error dialog??');
    } else {
      logger.assert(`${tag} unhandled http status code: ${httpCode}(${response.statusText})`);
    }
    return Promise.reject(httpCode);
  }

  // success
  logger.log(`${tag} succeed. res: ${response}`);
  return response.json as T;
}