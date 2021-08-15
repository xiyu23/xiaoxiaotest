import fetchAPI, { EHttpStatus, EMethod } from "../../http";
import logger from "../../logger";

interface IGetEventParticipantsReq {
  event_id: number;
}

/**
 * Indicate participation of the current user in an event.
 *
 * 用户参加`event_id`
 * @param param
 * @returns
 */
export default async function participateEvent({
  event_id,
}: IGetEventParticipantsReq): Promise<any> {
  try {
    return await fetchAPI({
      method: EMethod.POST,
      url: `/events/${event_id}/participants`,
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

