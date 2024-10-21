import Button from "@/components/common/Button";
import { TableFeatures as TableFeaturesType } from "@/types";
import { Add, FileDownload, Refresh } from "@mui/icons-material";
import { Box, CircularProgress } from "@mui/material";
import { t } from "i18next";
import { MRT_TableInstance } from "material-react-table";

interface TableFeaturesProps {
  id: string;
  tableFeatures: TableFeaturesType;
  isLoading: "add" | "delete" | "firmware" | undefined;
  createNewRecord: () => void;
  handleExportRowsCsv: (rows: any[]) => void;
  handleExportRowsPdf: (rows: any[]) => void;
  forceComponentReload: (id: string) => void;
  table?: MRT_TableInstance<any>;
}

const TableFeatures = ({
  id,
  table,
  tableFeatures,
  isLoading,
  createNewRecord,
  handleExportRowsCsv,
  handleExportRowsPdf,
  forceComponentReload,
}: TableFeaturesProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      {tableFeatures.add && (
        <Button
          sx={{ color: (theme) => theme.palette.tableButtons?.main }}
          disabled={isLoading != null}
          onClick={createNewRecord}
          startIcon={isLoading === "add" ? null : <Add />}
        >
          {isLoading === "add" ? (
            <CircularProgress color="secondary" size={25} />
          ) : (
            t("add")
          )}
        </Button>
      )}
      {tableFeatures.exportCsv && (
        <Button
          sx={{ color: (theme) => theme.palette.tableButtons?.main }}
          disabled={
            table?.getPrePaginationRowModel &&
            table.getPrePaginationRowModel().rows.length === 0
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
            table?.getPrePaginationRowModel &&
            table.getPrePaginationRowModel().rows.length === 0
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
  );
};

export default TableFeatures;
