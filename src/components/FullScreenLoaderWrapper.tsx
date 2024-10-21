import { Backdrop, CircularProgress, Stack, Typography } from "@mui/material";
import { Context, ReactNode, createContext, useEffect, useState } from "react";

export type FullScreenLoaderContextType = {
  setOpen: (open: boolean) => void;
  setContent: (content: string | undefined) => void;
};

export const FullScreenLoaderContext: Context<FullScreenLoaderContextType> =
  createContext({
    setOpen: (_open: boolean) => {},
    setContent: (_content: string | undefined) => {},
  });

export default function FullScreenLoaderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<string | undefined>();

  const handleClose = () => {
    console.warn("Cannot close the loader");
  };

  useEffect(() => {
    () => setContent(undefined);
  });

  return (
    <FullScreenLoaderContext.Provider
      value={{
        setOpen,
        setContent,
      }}
    >
      <Backdrop
        sx={{
          color: (theme) => theme.palette.common.white,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={open}
        onClick={handleClose}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress color="inherit" />
          <Typography>{content}</Typography>
        </Stack>
      </Backdrop>
      {children}
    </FullScreenLoaderContext.Provider>
  );
}
