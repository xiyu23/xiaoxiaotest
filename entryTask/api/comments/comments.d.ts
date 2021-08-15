export interface IComment {
  id: number;
  comment: string;
  create_time: number;
  author: IAuthor;
}

export interface IAuthor {
  id: number;
  username: string;
  avatar: string;
}
