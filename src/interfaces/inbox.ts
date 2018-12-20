import { profile } from "./profile";

export interface message {
  timestamp: string;
  person: profile;
  text: string;
}

export interface chat {
  pk: number;
  messages: message[];
  composed_by: profile;
  participants: profile[];
  group_name: string;
  chat_type: string;
}

export interface inbox {
  pk: number;
  chat: chat;
  created_on: string;
}