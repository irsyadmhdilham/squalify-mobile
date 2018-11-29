import { sales } from "./sales";
import { owner } from "./agency";

export interface comment {
  pk: number;
  commented_by: owner;
  text: string;
  timestamp: string;
}

export interface like {
  pk: number;
  liker: any;
}

export interface post {
  pk: number,
  posted_by: owner;
  post_type: string;
  sales_rel: sales;
  timestamp: string;
  comments: number;
  likes: like[];
}