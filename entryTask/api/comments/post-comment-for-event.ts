import fetchAPI, { EHttpStatus, EMethod } from "../../http";
import logger from "../../logger";
import { IComment } from "./comments";

type IPostCommentRes = IComment;

/**
 * Post a comment to an event.
 *
 * 为指定`event_id`添加评论
 * @param event_id
 * @param req 请求参数
 * @returns
 */
export default async function postCommentForEvent(
  event_id: number,
  comment: string,
): Promise<IPostCommentRes> {
  try {
    const res = await fetchAPI<IPostCommentRes>({
      method: EMethod.POST,
      url: `/events/${event_id}/comments`,
      data: {
        comment,
      },
    });
    logger.log(`succeed to post comment(${comment}) for ${event_id}.`);
    return res;
  } catch (httpCode) {
    if (httpCode === EHttpStatus.BadRequest) {
      logger.error('Comment parameter missing');
    } else if (httpCode === EHttpStatus.InvalidToken) {
      logger.error('Invalid token');
    } else if (httpCode === EHttpStatus.NotFound) {
      logger.error('Event not found');
    } else {
      logger.assert(`unhandled httpCode: ${httpCode}`);
    }
    throw httpCode;
  }
}
