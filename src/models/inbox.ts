import { profile } from "./profile";

export interface message {
  timestamp: Date;
  person: profile;
  text: string;
}

export interface groupChat {
  pk: number;
  messages: message[];
  owner: profile;
  participants: profile[];
  role: string;
}

export interface inbox {
  pk: number;
  created_on: string;
  chat_with: profile;
  unread: number;
  messages: message[];
  group_chat: groupChat[];
}