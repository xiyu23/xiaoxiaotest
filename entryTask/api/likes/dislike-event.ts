import fetchAPI, { EHttpStatus, EMethod } from "../../http";
import logger from "../../logger";

/**
 * Dislike an event as the current user.
 *
 * 用户dislikes `event_id`
 * @param param
 * @returns
 */
export default async function dislikeEvent(event_id: number): Promise<any> {
  try {
    return await fetchAPI({
      method: EMethod.DELETE,
      url: `/events/${event_id}/likes`,
    });
  } catch (httpCode) {
    if (httpCode === EHttpStatus.InvalidToken) {
      logger.error('Invalid token');
    } else if (httpCode === EHttpStatus.NotFound) {
      logger.error('No like record found');
    } else {
      logger.assert(`unhandled httpCode: ${httpCode}`);
    }
    throw httpCode;
  }
}
