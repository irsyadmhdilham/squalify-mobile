export interface pushNotification {
  mentions: boolean,
  reminder: boolean;
  activities: boolean;
  direct_message: boolean;
}

export interface notifications {
  push_notification: pushNotification,
  email_notification: boolean;
}

export interface socialNetAcc {
  google: string;
  dropbox: string;
  facebook: string;
}

export interface settings {
  notifications: {
    push_notification: pushNotification;
    email_notification: true;
  };
  social_net_acc: socialNetAcc;
}