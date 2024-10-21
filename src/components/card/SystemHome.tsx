import { t } from "i18next";
import SimpleCard from "@/components/common/SimpleCard";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import QRCode from "react-qr-code";
import { useMemo, useState } from "react";
import { normalizedFieldsOrder } from "@/utils/data";
import { DEFAULT_ND } from "@/utils/constants";
import DataGroup from "@/components/common/DataGroup";
import { DataField } from "@/types";

interface SystemHomeProps {
  title: string;
  dataFields: DataField[];
  fieldsOrder: string[];
  qrCodeFieldId?: string;
  firmwareFieldId?: string;
  firmwareFieldToAttach?: string;
}

export default function SystemHome({
  title,
  fieldsOrder = [],
  qrCodeFieldId,
  firmwareFieldId,
  firmwareFieldToAttach,
  dataFields: fields = [],
}: SystemHomeProps) {
  const normalizedFieldsOrderList = useMemo(
    () => normalizedFieldsOrder(fields, fieldsOrder),
    [fields, fieldsOrder]
  );

  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogClickOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const firmwareToUpdate = useMemo(() => {
    const firmwareField =
      fields.find((field) => field.alias === firmwareFieldId) ||
      ({} as DataField);

    return firmwareField.data === true;
  }, [fields, firmwareFieldId]);

  return (
    <SimpleCard title={t(title)} fullWidth>
      <Grid container spacing={1}>
        {normalizedFieldsOrderList
          .filter((fieldId) => fieldId !== firmwareFieldId)
          .map((fieldId, index) => {
            const field =
              fields.find((field) => field.alias === fieldId) ||
              ({} as DataField);

            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={12}
                lg={6}
                key={`SystemHome-${index}-${Math.random()}`}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  {qrCodeFieldId === field.alias && (
                    <Stack position="relative">
                      <Box
                        position="absolute"
                        left={0}
                        top={0}
                        width="35px"
                        height="35px"
                        borderRadius="50%"
                        zIndex={-1}
                        className="pulse"
                      />
                      <QrCodeScannerIcon
                        fontSize="large"
                        onClick={handleDialogClickOpen}
                        style={{ cursor: "pointer", flex: "none" }}
                      />
                      {/* QR Code Modal */}
                      <Dialog
                        open={openDialog}
                        onClose={handleDialogClose}
                        maxWidth="xs"
                        fullWidth
                      >
                        <DialogTitle>
                          {t(field.label || "")}
                          <IconButton
                            aria-label="close"
                            onClick={handleDialogClose}
                            sx={{
                              position: "absolute",
                              right: 8,
                              top: 8,
                              color: "gray",
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                          <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            width="100%"
                            height="100%"
                          >
                            <QRCode value={field.data as string} size={400} />
                            {/* {field.data} */}
                          </Stack>
                        </DialogContent>
                      </Dialog>
                    </Stack>
                  )}
                  <DataGroup
                    title={t(field.label || "") || DEFAULT_ND}
                    data={field.data}
                    firmwareToUpdate={
                      firmwareFieldToAttach === field.alias && firmwareToUpdate
                    }
                  />
                </Stack>
              </Grid>
            );
          })}
      </Grid>
    </SimpleCard>
  );
}
