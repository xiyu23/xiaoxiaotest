import fetchAPI, { EHttpStatus, EMethod } from "../../http";
import logger from "../../logger";
import { IEventDetail } from "./events";

interface IGetEventsReq {
  after?: number; // Retrieve events starting after this time
  before?: number; //	Retrieve events ending before this time
  channels?: string; // Comma separated channel IDs. E.g. 3,7,9. If not specified, events from all channels will be returned."
  offset?: number; // integer	Index of the starting record. Default: 0
  limit?:	number; // Number of entries to fetch. Default: 25
}


interface IGetEventsRes {
  events: IEventDetail[];
  hasMore: boolean; // Flag indicating if there are more events available or not
}

/**
 * 查询events（分页方法）
 * 
 * 全量使用`getEventsAtOnce`
 * @param req 请求参数
 * @returns 返回查询一次的结果列表
 */
export default async function getEvents(req: IGetEventsReq = {}): Promise<IGetEventsRes> {
  try {
    const res = await fetchAPI<IGetEventsRes>({
      method: EMethod.GET,
      url: '/channels',
      data: req,
    });
    logger.log(`succeed to get ${res.events.length} events. has more? ${res.hasMore ? 'Y' : 'N'}`);
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

/**
 * 查询满足条件的所有events
 * 
 * **注意**：全量列表，可能导致查询较慢，可使用分页方法`getEvents`，不过需要调用方自行维护`offset`
 * @param req 请求参数
 * @returns 全部events
 */
export async function getEventsAtOnce(req: IGetEventsReq = {}): Promise<IGetEventsRes> {
  try {
    const allEvents = [];
    const tmpReq = { ...req };
    while (1) {
      const res = await getEvents(tmpReq);
      allEvents.push(...res.events);
      if (!res.hasMore) {
        break;
      }
      tmpReq.offset = allEvents.length;
    }
    return {
      events: allEvents,
      hasMore: false,
    };
  } catch (e) {
    logger.error(`getEventsAtOnce failed: ${e}`);
    throw e;
  }
}
