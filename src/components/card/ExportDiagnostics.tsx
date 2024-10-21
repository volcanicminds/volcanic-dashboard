import { t } from "i18next";
import SimpleCard from "@/components/common/SimpleCard";
import Button from "@/components/common/Button";
import { get, TOKEN_STORAGE_KEY } from "@/utils/localStorage";

export default function ExportDiagnostics({ title }: { title: string }) {
  function executeExportDiagnostics() {
    const authToken = get(TOKEN_STORAGE_KEY);
    window.open(
      `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_BASE_PATH}/diagnostics?auth=${authToken}`,
      "_parent"
    );
  }

  return (
    <SimpleCard title={t(title)} fullWidth>
      <Button
        sx={{ mt: 2 }}
        variant="contained"
        onClick={executeExportDiagnostics}
      >
        {t("cu-diagnostics-label")}
      </Button>
    </SimpleCard>
  );
}
