import { useDrawer } from "@/hook/useDrawer";
import Menu from "@mui/icons-material/Menu";
import { Stack, IconButton, Typography } from "@mui/material";

export default function Header({
  title,
  customer,
}: {
  title?: string;
  customer?: any;
}) {
  const { openDrawer } = useDrawer();

  return (
    <>
      <Stack direction="row" px={3} pt={3} zIndex={1}>
        <IconButton
          sx={{
            display: {
              xs: "block",
              sm: "none",
            },
            color: (theme) => theme.palette.hamburgerIcon?.main,
          }}
          onClick={openDrawer}
        >
          <Menu />
        </IconButton>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Stack spacing={-1}>
            {title && (
              <Typography
                variant="h1"
                fontWeight={700}
                sx={{
                  fontSize: { xs: 25, sm: 38 },
                }}
                m={0}
              >
                {title}
              </Typography>
            )}
            {customer?.name && (
              <Typography variant="h6" m={0} fontWeight={200}>
                {customer.name}
              </Typography>
            )}
            {customer?.description && (
              <Typography variant="h6" m={0} fontWeight={200}>
                {customer.description}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
