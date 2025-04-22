const build = "DEV";

export const AUTH_URL = build == "DEV" ? "/server/employee/" : "/employee/";
export const URL = build == "DEV" ? "/server" : "/";
