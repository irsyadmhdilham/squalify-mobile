export interface memo {
  pk: number;
  start_date: Date;
  end_date: Date;
  text: string;
  countdown: Date;
  posted_date: Date;
  posted_by: {
    name: string;
    profile_image: string;
  }
}