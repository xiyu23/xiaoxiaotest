import fetchAPI, { EHttpStatus, EMethod } from "../../http";
import logger from "../../logger";
import { IEventDetail, IUser } from "./events";

interface IGetEventParticipantsReq {
  event_id: number;
}

interface IGetEventParticipantsRes {
  users: IUser[];
}

/**
 * Get a list of all participants of an event.
 * @param param 
 * @returns an array of users
 */
export default async function getEventParticipants({
  event_id,
}: IGetEventParticipantsReq): Promise<IUser[]> {
  try {
    const res = await fetchAPI<IGetEventParticipantsRes>({
      method: EMethod.GET,
      url: `/events/${event_id}/participants`,
    });
    if (!Array.isArray(res.users)) {
      logger.assert(`prop 'users' in response of getEventParticipants must be type of array.
        response: ${JSON.stringify(res)}`);
      return [];
    }

    return res.users;
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

