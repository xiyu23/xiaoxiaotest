import fetchAPI, { EHttpStatus, EMethod } from "../../http";
import logger from "../../logger";
import { IUser } from "./likes";

interface IGetLikesReq {
  offset?: number; // integer	Index of the starting record. Default: 0
  limit?:	number; // Number of records to fetch. Defaults to 25
}

interface IGetLikesRes {
  users: IUser[];
  hasMore: boolean; // Flag indicating if there are more comments available or not
}

/**
 * Get a list of paginated users who have liked the event.
 *
 * 查询指定`event_id`的likes（分页方法）
 * 
 * 若希望一次查到全部，请使用`getLikesForEventAtOnce`
 * @param event_id
 * @param req 请求参数
 * @returns 返回查询一次的结果列表
 */
export default async function getLikesForEvent(event_id: number, req: IGetLikesReq = {}): Promise<IGetLikesRes> {
  try {
    const res = await fetchAPI<IGetLikesRes>({
      method: EMethod.GET,
      url: `/events/${event_id}/likes`,
      data: req,
    });
    logger.log(`succeed to get ${res.users.length} likes for ${event_id}. has more? ${res.hasMore ? 'Y' : 'N'}`);
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
 * 查询所有likes，一次性返回
 * 
 * **注意**：全量列表，可能导致查询较慢，可使用分页方法`getEvents`，不过需要调用方自行维护`offset`
 * @param event_id
 * @param req 请求参数
 * @returns 全部events
 */
export async function getLikesForEventAtOnce(event_id: number, req: IGetLikesReq = {}): Promise<IGetLikesRes> {
  try {
    const allLikedUsers = [];
    const tmpReq = { ...req };
    while (1) {
      const res = await getLikesForEvent(event_id, tmpReq);
      allLikedUsers.push(...res.users);
      if (!res.hasMore) {
        break;
      }
      tmpReq.offset = allLikedUsers.length;
    }
    return {
      users: allLikedUsers,
      hasMore: false,
    };
  } catch (e) {
    logger.error(`getLikesForEventAtOnce failed: ${e}`);
    throw e;
  }
}
