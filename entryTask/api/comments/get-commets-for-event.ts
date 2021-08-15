import fetchAPI, { EHttpStatus, EMethod } from "../../http";
import logger from "../../logger";
import { IComment } from "./comments";

interface IGetCommentsReq {
  offset?: number; // integer	Index of the starting record. Default: 0
  limit?:	number; // Number of records to fetch. Defaults to 25
}


interface IGetCommentsRes {
  comments: IComment[];
  hasMore: boolean; // Flag indicating if there are more comments available or not
}

/**
 * Get a list of paginated comments of an event.
 *
 * 查询指定`event_id`的评论（分页方法）
 * 
 * 若希望一次查到全部，请使用`getCommentsForEventAtOnce`
 * @param event_id
 * @param req 请求参数
 * @returns 返回查询一次的结果列表
 */
export default async function getCommentsForEvent(event_id: number, req: IGetCommentsReq = {}): Promise<IGetCommentsRes> {
  try {
    const res = await fetchAPI<IGetCommentsRes>({
      method: EMethod.GET,
      url: `/events/${event_id}/comments`,
      data: req,
    });
    logger.log(`succeed to get ${res.comments.length} comments for ${event_id}. has more? ${res.hasMore ? 'Y' : 'N'}`);
    return res;
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

/**
 * 查询所有评论，一次性返回
 * 
 * **注意**：全量列表，可能导致查询较慢，可使用分页方法`getEvents`，不过需要调用方自行维护`offset`
 * @param event_id
 * @param req 请求参数
 * @returns 全部events
 */
export async function getCommentsForEventAtOnce(event_id: number, req: IGetCommentsReq = {}): Promise<IGetCommentsRes> {
  try {
    const allComments = [];
    const tmpReq = { ...req };
    while (1) {
      const res = await getCommentsForEvent(event_id, tmpReq);
      allComments.push(...res.comments);
      if (!res.hasMore) {
        break;
      }
      tmpReq.offset = allComments.length;
    }
    return {
      comments: allComments,
      hasMore: false,
    };
  } catch (e) {
    logger.error(`getCommentsForEventAtOnce failed: ${e}`);
    throw e;
  }
}
