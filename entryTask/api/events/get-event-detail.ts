import fetchAPI, { EHttpStatus, EMethod } from "../../http";
import logger from "../../logger";
import { IEventDetail } from "./events";

interface IGetEventDetailReq {
  event_id: number;
}

export default async function getEventDetail({
  event_id,
}: IGetEventDetailReq): Promise<IEventDetail> {
  try {
    return await fetchAPI<IEventDetail>({
      method: EMethod.GET,
      url: `/events/${event_id}`,
    });
  } catch (httpCode) {
    if (httpCode === EHttpStatus.InvalidToken) {
      logger.error('Invalid token');
    } else if (httpCode === EHttpStatus.NotFound) {
      logger.error('Event not found');
    } else {
      logger.assert(`unhandled httpCode: ${httpCode}`);
    }
    throw httpCode;
  }
}
