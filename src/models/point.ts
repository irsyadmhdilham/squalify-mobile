export interface attribute {
  pk?: number;
  attribute: string;
  point: number;
};

export interface log {
  point_type: string;
  timestamp: string;
  point: number;
  attribute: string
};

export interface point {
  pk?: number;
  attributes: attribute[]
  date: any;
  logs: log[];
  productive_point: number;
  career_point: number;
  total: number;
};

export interface contactPoints {
  pk?: number;
  referrals: {
    pk?: number;
    point: number;
  };
  ftf: {
    pk?: number;
    point: number;
  };
  app_sec: {
    pk?: number;
    point: number;
  };
  calls: {
    pk?: number;
    point: number;
  };
};

export interface groupPoint {
  pk: number;
  name: string;
  designation: string;
  profile_image: string;
  point: { pk: number; total: number;};
  downline?: number;
};

export interface allPoints {
  personal: number;
  group: number | null;
  agency: number;
}

export interface pointIo {
  point: number;
  uplineId: number;
  sender: number;
}

export interface totalSummary {
  current: number;
  difference: number;
  diff_percentage: number;
}

export interface contactsSummary {
  ftf: number;
  referrals: number;
  new_contacts: number;
  new_contacts_percentage: number;
  client_conversion: number;
  client_conversion_percentage: number;
  contacts: {
    referrals: number;
    ftf: number;
    booth: number;
    socmed: number;
    nesting: number;
    other: number;
    ttt: number;
    client: number;
  }
}

export interface engagementSummary {
  calls: number;
  servicing: number;
  appointment: number;
  new_calls: number;
  new_calls_percentage: number;
  new_servicing: number;
  new_servicing_percentage: number;
  new_appointment: number;
  new_appointment_percentage: number;
}

export interface salesSummary {
  sales_presentation: number;
  case_closed: number;
  new_sales_presentation: number;
  new_sales_presentation_percentage: number;
  new_cases: number;
  new_cases_percentage: number;
  total_new_sales: number;
}

export interface recruitmentSummary {
  career_presentation: number;
  recruitment: number;
  new_career_presentation: number;
  new_career_presentation_percentage: number;
  new_recruitment: number;
  new_recruitment_percentage: number;
}

export interface careerSummary {
  millionaire_suit: number;
  update_upline: number;
  personal_coaching: number;
  training: number;
}

export interface summary {
  total: totalSummary;
  contacts: contactsSummary;
  engagement: engagementSummary;
  sales: salesSummary;
  recruitment: recruitmentSummary;
  career: careerSummary;
}

export interface summaryResponse {
  total: {
    current: number;
    difference: number;
    diff_percentage: number;
  }
  contacts: {
    ftf: number;
    referrals: number;
    new_contacts: number;
    new_contacts_percentage: number;
    client_conversion: number;
    client_conversion_percentage: number;
    contacts: {
      referrals: number;
      ftf: number;
      booth: number;
      socmed: number;
      nesting: number;
      other: number;
      ttt: number;
      client: number;
    }
  }
  engagement: {
    calls: number;
    servicing: number;
    appointment: number;
    new_calls: number;
    new_calls_percentage: number;
    new_servicing: number;
    new_servicing_percentage: number;
    new_appointment: number;
    new_appointment_percentage: number;
  }
  sales: {
    sales_presentation: number;
    case_closed: number;
    new_sales_presentation: number;
    new_sales_presentation_percentage: number;
    new_cases: number;
    new_cases_percentage: number;
    total_new_sales: string;
  }
  recruitment: {
    career_presentation: number;
    recruitment: number;
    new_career_presentation: number;
    new_career_presentation_percentage: number;
    new_recruitment: number;
    new_recruitment_percentage: number;
  }
  career: {
    millionaire_suit: number;
    update_upline: number;
    personal_coaching: number;
    training: number;
  }
}