import fetchAPI, { EHttpStatus, EMethod } from "../../http";
import logger from "../../logger";

/**
 * Like an event as the current user.
 *
 * 用户likes `event_id`
 * @param param
 * @returns
 */
export default async function likeEvent(event_id: number): Promise<any> {
  try {
    return await fetchAPI({
      method: EMethod.POST,
      url: `/events/${event_id}/likes`,
    });
  } catch (httpCode) {
    if (httpCode === EHttpStatus.InvalidToken) {
      logger.error('Invalid token / already_liked'); // bad design, should not be mixed
    } else if (httpCode === EHttpStatus.NotFound) {
      logger.error('Event not found');
    } else {
      logger.assert(`unhandled httpCode: ${httpCode}`);
    }
    throw httpCode;
  }
}
