import type { Meta, StoryObj } from "@storybook/react";
import SimpleCard from "@/components/common/SimpleCard";
import { Typography } from "@mui/material";

const meta = {
  title: "Components/SimpleCard",
  component: SimpleCard,
  tags: ["basic", "component", "simplecard"],
} satisfies Meta<typeof SimpleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    fullWidth: true,
    title: <Typography variant="h5">Titolo card</Typography>,
    children: (
      <>
        <Typography>Contenuto 1</Typography>
        <Typography>Contenuto 2</Typography>
      </>
    ),
  },
};
