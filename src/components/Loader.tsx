import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

export default function Loader({
  page,
  skeleton,
  justifyContent = "center",
}: {
  page?: boolean;
  skeleton?: boolean;
  justifyContent?: string;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 500); // 500ms delay

    return () => clearTimeout(timer); // Clean up on component unmount
  }, []);

  const LoaderComponent = useMemo(
    () =>
      skeleton ? (
        <Card sx={{ width: "100%" }}>
          <CardContent>
            <Typography variant="h5">
              <Skeleton width={200} height={60} />
            </Typography>
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="body1">
                <Skeleton width={300} height={40} />
              </Typography>
              <Typography variant="body1">
                <Skeleton width={300} height={40} />
              </Typography>
              <Typography variant="body1">
                <Skeleton width={300} height={40} />
              </Typography>
              <Typography variant="body1">
                <Skeleton width={300} height={40} />
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <CircularProgress />
      ),
    [skeleton]
  );

  return (
    <>
      {page ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent,
            alignItems: "center",
            height: "100vh",
          }}
        >
          {show && LoaderComponent}
        </Box>
      ) : (
        <Stack
          direction="row"
          justifyContent={justifyContent}
          alignItems="center"
          sx={{ width: "100%" }}
        >
          {LoaderComponent}
        </Stack>
      )}
    </>
  );
}
