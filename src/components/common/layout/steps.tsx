export const SITE_STEPS = ["overview", "consumptions", "apportionment"];
export const TRIP_STEPS = ["overview", "transportDetail", "apportionment"];
export const ADD_STEPS = ["overview", "addDetail"];
export const APPORTIONMENT_STEP = "apportionments";

export function generateDinamicMultisteps(type: "site" | "trip" | "add") {
  let steps = [] as Array<string>;

  if (type === "site") {
    steps = ["overview", "consumptions", "apportionment"];
  }

  if (type === "trip") {
    ["overview", "transportDetail", "apportionment"];
  }

  if (type === "add") {
    steps = ["overview", "addDetail"];
  }

  return steps;
}
