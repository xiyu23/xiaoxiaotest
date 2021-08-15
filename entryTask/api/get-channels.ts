import fetchAPI, { EHttpStatus, EMethod } from "../http";
import logger from "../logger";

interface IGetChannelsRes {
  channels: IChannel[];
}

interface IChannel {
  id: string;
  name: string;
}

export default async function getChannels(): Promise<IGetChannelsRes> {
  try {
    const res = await fetchAPI<IGetChannelsRes>({
      method: EMethod.GET,
      url: '/channels',
    });
    logger.log(`succeed to get ${res.channels.length} channels.`);
    return res;
  } catch (httpCode) {
    if (httpCode === EHttpStatus.InvalidToken) {
      logger.error('Invalid token');
    } else {
      logger.assert(`unhandled httpCode: ${httpCode}`);
    }
    throw httpCode;
  }
}
