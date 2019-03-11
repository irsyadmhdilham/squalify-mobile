import { owner } from "./agency";

export interface comment {
  pk: number;
  commented_by: owner;
  text: string;
  timestamp: Date;
};

export interface like {
  pk: number;
  liker: any;
};

export interface memo {
  pk: number;
  start_date: Date;
  end_date: Date;
  text: string;
  countdown: Date;
  posted_date: Date;
  posted_by: {
    pk?: number;
    name: string;
    profile_image: string;
  },
  likes: like[];
  comments: comment[];
}