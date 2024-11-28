import Button from "@/components/common/Button";
import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned";
import ClearIcon from "@mui/icons-material/Clear";
import { TableFeatures as TableFeaturesType } from "@/types";
import { FileDownload, Refresh } from "@mui/icons-material";
import { Box, CircularProgress } from "@mui/material";
import { t } from "i18next";
import { MRT_TableInstance } from "material-react-table";
import { Dispatch } from "react";

interface TableFeaturesProps {
  id: string;
  tableFeatures: TableFeaturesType;
  isLoading: "add" | "delete" | "firmware" | "paste" | undefined;
  createNewRecord: () => void;
  copyPasteRow: any | undefined;
  setShowPasteDialog: Dispatch<boolean>;
  resetCopyPasteMode: () => void;
  handleExportRowsCsv: (rows: any[]) => void;
  handleExportRowsPdf: (rows: any[]) => void;
  forceComponentReload: (id: string) => void;
  disabled?: boolean;
  table?: MRT_TableInstance<any>;
  selectedRowsLength?: number;
}

const TableFeatures = ({
  id,
  table,
  tableFeatures,
  isLoading,
  disabled,
  setShowPasteDialog,
  copyPasteRow,
  resetCopyPasteMode,
  handleExportRowsCsv,
  handleExportRowsPdf,
  forceComponentReload,
  selectedRowsLength = 0,
}: TableFeaturesProps) => {
  const showPasteDialog = () => {
    setShowPasteDialog(true);
  };

  return (
    <>
      {copyPasteRow != null && (
        <Box
          sx={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <Button
            sx={{ color: (theme) => theme.palette.tableButtons?.main }}
            disabled={isLoading != null || selectedRowsLength === 0 || disabled}
            onClick={showPasteDialog}
            startIcon={
              isLoading === "paste" ? null : <AssignmentReturnedIcon />
            }
          >
            {isLoading === "paste" ? (
              <CircularProgress color="secondary" size={25} />
            ) : (
              t("paste")
            )}
          </Button>
          <Button
            sx={{ color: (theme) => theme.palette.error?.main }}
            disabled={isLoading != null || disabled}
            onClick={resetCopyPasteMode}
            startIcon={isLoading === "paste" ? null : <ClearIcon />}
          >
            {isLoading === "paste" ? (
              <CircularProgress color="secondary" size={25} />
            ) : (
              t("cancel")
            )}
          </Button>
        </Box>
      )}
      {copyPasteRow == null && (
        <Box
          sx={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          {tableFeatures.exportCsv && (
            <Button
              sx={{ color: (theme) => theme.palette.tableButtons?.main }}
              disabled={
                isLoading != null ||
                (table?.getPrePaginationRowModel &&
                  table.getPrePaginationRowModel().rows.length === 0) ||
                disabled
              }
              onClick={() =>
                handleExportRowsCsv(
                  (table?.getPrePaginationRowModel &&
                    table.getPrePaginationRowModel().rows) ||
                    []
                )
              }
              startIcon={<FileDownload />}
            >
              {t("csv")}
            </Button>
          )}
          {tableFeatures.exportPdf && (
            <Button
              sx={{ color: (theme) => theme.palette.tableButtons?.main }}
              disabled={
                isLoading != null ||
                (table?.getPrePaginationRowModel &&
                  table.getPrePaginationRowModel().rows.length === 0) ||
                disabled
              }
              onClick={() =>
                handleExportRowsPdf(
                  (table?.getPrePaginationRowModel &&
                    table.getPrePaginationRowModel().rows) ||
                    []
                )
              }
              startIcon={<FileDownload />}
            >
              {t("pdf")}
            </Button>
          )}
          {tableFeatures.refresh && (
            <Button
              disabled={disabled || isLoading != null}
              sx={{ color: (theme) => theme.palette.tableButtons?.main }}
              onClick={() => {
                forceComponentReload(id);
              }}
              startIcon={<Refresh />}
            >
              {t("refresh")}
            </Button>
          )}
        </Box>
      )}
    </>
  );
};

export default TableFeatures;
