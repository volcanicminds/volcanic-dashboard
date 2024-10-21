import { Condition, DataField, Rule } from "@/types";

export function checkRule(condition: Condition, fields: DataField[]) {
  const data = fields.find((field) => field.alias === condition.data)?.data;
  switch (condition.operator) {
    case "greater":
      if (typeof data === "number") {
        return (data as number) > ((condition.value as number) || 0);
      }
      return false;
    case "less":
      if (typeof data === "number") {
        return (data as number) < ((condition.value as number) || 0);
      }
      return false;
    case "equal":
      return data === condition.value;
    case "notEqual":
      return data !== condition.value;
    case "greaterOrEqual":
      if (typeof data === "number") {
        return (data as number) >= ((condition.value as number) || 0);
      }
      return false;
    case "lessOrEqual":
      if (typeof data === "number") {
        return (data as number) <= ((condition.value as number) || 0);
      }
      return false;
    case "between":
      if (typeof data === "number") {
        return (
          (data as number) >= (condition.value1 || 0) &&
          (data as number) <= (condition.value2 || 0)
        );
      }
      return false;
    case "in":
      if (data instanceof Array) {
        return (data as any[]).includes(condition.data);
      }
      return false;
    case "notIn":
      if (data instanceof Array) {
        return !(data as any[]).includes(condition.data);
      }
      return false;
    default:
      return false;
  }
}

export function getWhichRuleFullfilled(
  rules: Rule[] | ((fields: string) => Rule[]) = [],
  field: string,
  fields: DataField[]
) {
  let calculatedRules: Rule[] = [];

  if (typeof rules === "function") {
    if (field) {
      calculatedRules = rules(field);
    } else {
      console.error("Field is required in function getWhichRuleFullfilled");
      return;
    }
  } else {
    calculatedRules = rules;
  }

  const ruleIndex = calculatedRules.findIndex((rule) => {
    return rule.conditions.every((condition) => {
      return checkRule(condition, fields);
    });
  });

  return calculatedRules[ruleIndex];
}

export function getEventType(data: any = {}) {
  let dspFaults = 0;
  const events = data["Events"] || {};
  Object.keys(events).forEach((id) => {
    if (events[id]?.category === 4) {
      dspFaults++;
    }
  });

  if (dspFaults > 0) {
    return "Fault";
  }

  let dspTampers = 0;
  Object.keys(events).forEach((id) => {
    if (events[id]?.category === 3) {
      dspTampers++;
    }
  });

  if (dspTampers > 0) {
    return "Tamper";
  }

  return "Ok";
}
