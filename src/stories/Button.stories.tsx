import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Button from "@/components/common/Button";
import * as Icons from "@mui/icons-material";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["basic", "component", "button"],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onClick: fn(),
  },
  argTypes: {
    icon: {
      control: "select",
      options: Object.keys(Icons),
      defaultValue: null,
    },
    startIcon: {
      control: "select",
      options: Object.keys(Icons),
      defaultValue: null,
    },
    endIcon: {
      control: "select",
      options: Object.keys(Icons),
      defaultValue: null,
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const IconTemplate = (icon: string) => {
  return Icons[icon as keyof typeof Icons];
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Basic: Story = {
  args: {
    color: "primary",
    children: "Basic Button",
    variant: "contained",
  },
  argTypes: {
    icon: { table: { disable: true } },
    isIconButton: { table: { disable: true } },
    startIcon: { table: { disable: true } },
    endIcon: { table: { disable: true } },
  },
};

export const StartIcon: Story = {
  args: {
    color: "primary",
    children: "Start Icon Button",
    variant: "contained",
  },
  render: function Render(args) {
    const IconComponent = IconTemplate(
      (args.startIcon as string) || "PlayCircleOutline"
    );
    return <Button {...args} startIcon={<IconComponent />} />;
  },
  argTypes: {
    icon: { table: { disable: true } },
    isIconButton: { table: { disable: true } },
    endIcon: { table: { disable: true } },
  },
};

export const EndIcon: Story = {
  args: {
    color: "primary",
    label: "End Icon Button",
    variant: "contained",
  },
  render: function Render(args) {
    const IconComponent = IconTemplate(
      (args.endIcon as string) || "AssistantPhoto"
    );
    return <Button {...args} endIcon={<IconComponent />} />;
  },
  argTypes: {
    icon: { table: { disable: true } },
    isIconButton: { table: { disable: true } },
    startIcon: { table: { disable: true } },
  },
};

export const IconButton: Story = {
  args: {
    color: "primary",
    variant: "contained",
    isIconButton: true,
  },
  render: function Render(args) {
    const IconComponent = IconTemplate((args.icon as string) || "CheckCircle");
    return <Button {...args} icon={<IconComponent />} />;
  },
  argTypes: {
    size: { table: { disable: true } },
    variant: { table: { disable: true } },
    isIconButton: { table: { disable: true } },
    label: { table: { disable: true } },
    startIcon: { table: { disable: true } },
    endIcon: { table: { disable: true } },
  },
};
