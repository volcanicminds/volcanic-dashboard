import { FC } from "react";
import * as Icons from "@mui/icons-material";

export type IconNames = keyof typeof Icons;
type IconProps = {
  iconName: IconNames;
  size?: "inherit" | "small" | "medium" | "large";
};

const IconComponent: FC<IconProps> = ({ iconName, size = "large" }) => {
  const Icon = Icons[iconName];
  return Icon ? <Icon fontSize={size} /> : null;
};

export default IconComponent;
