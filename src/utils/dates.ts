import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const timezoneMap = {
  // Europa
  CET: "Europe/Paris", // Central European Time
  CEST: "Europe/Paris", // Central European Summer Time
  BST: "Europe/London", // British Summer Time
  WET: "Europe/Lisbon", // Western European Time
  WEST: "Europe/Lisbon", // Western European Summer Time
  EET: "Europe/Helsinki", // Eastern European Time
  EEST: "Europe/Helsinki", // Eastern European Summer Time

  // America
  EST: "America/New_York", // Eastern Standard Time
  EDT: "America/New_York", // Eastern Daylight Time
  CST: "America/Chicago", // Central Standard Time
  CDT: "America/Chicago", // Central Daylight Time
  MST: "America/Denver", // Mountain Standard Time
  MDT: "America/Denver", // Mountain Daylight Time
  PST: "America/Los_Angeles", // Pacific Standard Time
  PDT: "America/Los_Angeles", // Pacific Daylight Time
  AKST: "America/Anchorage", // Alaska Standard Time
  AKDT: "America/Anchorage", // Alaska Daylight Time
  HST: "Pacific/Honolulu", // Hawaii Standard Time

  // Asia
  IST: "Asia/Kolkata", // Indian Standard Time
  PKT: "Asia/Karachi", // Pakistan Standard Time
  WIB: "Asia/Jakarta", // Western Indonesia Time
  WITA: "Asia/Makassar", // Central Indonesia Time
  WIT: "Asia/Jayapura", // Eastern Indonesia Time
  JST: "Asia/Tokyo", // Japan Standard Time
  KST: "Asia/Seoul", // Korea Standard Time
  SGT: "Asia/Singapore", // Singapore Time
  HKT: "Asia/Hong_Kong", // Hong Kong Time
  AWST: "Australia/Perth", // Australian Western Standard Time
  ACST: "Australia/Adelaide", // Australian Central Standard Time
  AEST: "Australia/Sydney", // Australian Eastern Standard Time
  AEDT: "Australia/Sydney", // Australian Eastern Daylight Time

  // Africa
  CAT: "Africa/Harare", // Central Africa Time
  EAT: "Africa/Nairobi", // East Africa Time
  WAT: "Africa/Lagos", // West Africa Time

  // Oceania
  NZST: "Pacific/Auckland", // New Zealand Standard Time
  NZDT: "Pacific/Auckland", // New Zealand Daylight Time
  FJT: "Pacific/Fiji", // Fiji Time
  ChST: "Pacific/Guam", // Chamorro Standard Time
  SST: "Pacific/Pago_Pago", // Samoa Standard Time

  // Antartide
  CAST: "Antarctica/Casey", // Casey Time

  // Generici/Altro
  UTC: "UTC", // Coordinated Universal Time
  GMT: "Etc/GMT", // Greenwich Mean Time
} as {
  [key: string]: string;
};

export function parseDateWithTimezone(dateStr: string) {
  const timezoneAbbr = (dateStr.match(/[A-Z]{3,4}/) || {})[0];
  if (timezoneAbbr) {
    const timezone = timezoneMap[timezoneAbbr];

    if (!timezone) {
      throw new Error("Unrecognized timezone abbreviation");
    }

    const dateWithoutTimezone = dateStr.replace(timezoneAbbr, "").trim();

    return dayjs
      .tz(dateWithoutTimezone, "YYYY-MM-DD HH:mm:ss", timezone)
      .toDate();
  }

  return dateStr;
}
