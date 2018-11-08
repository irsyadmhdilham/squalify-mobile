export interface content {
  text: string;
  date: Date;
  senderId: string;
}

export interface chat {
  id: string;
  senderImage: string;
  senderName: string;
  unread?: boolean | number;
  content?: content[];
}