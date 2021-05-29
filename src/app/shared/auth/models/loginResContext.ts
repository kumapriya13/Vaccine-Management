export interface ILoginResContext {
  jwt?: string;
  user_id?: string;
  user_type?: string;
  site_ids?: string[];
  fname?: string;
  lname?: string;
  sites?: ISitesObj;
}

export interface ISites {
  site_id?: string;
  site_name?: string;
}

export interface ISitesObj {
  sites?: ISites[];
}