interface commenter {
  pk: number;
  profile_image?: string;
  name: string;
}

export class Comment {
  commenter: commenter;
  message: string;
  date: Date;

  constructor(date: Date, message: string, commenter: commenter) {
    this.date = date;
    this.message = message;
    this.commenter = commenter;
  }
}