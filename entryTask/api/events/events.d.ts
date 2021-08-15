export interface IEventDetail {
  id: number; // Event ID
  name: string; // Event name
  begin_time: number; // Event starting time
  end_time: number; // Event ending time
  description: string; // Full description of the event
  creator: ICreator; // An object containing the following keys:
  create_time: number; // Time when the event was published
  update_time: number; // Time when the event was last updated
  channel: IChannel; // An object containing the following keys:
  images: string[]; // An array of strings, which are image URLs
  location: string; // Event location
  goings_count: number; // Number of people who planned to go to the event
  likes_count: number; //	Number of people who liked the event
}

export interface ICreator {
  id: string;
  username: string;
  avatar: string;
}

export interface IChannel {
  id: string;
  name: string;
}

export interface IUser {
  id: string;
  username: string;
}