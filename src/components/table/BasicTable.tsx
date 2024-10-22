import {
  Dispatch,
  ReactNode,
  useEffect,
  useMemo,
  useState,
  useContext,
  useCallback,
} from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_Row,
  createMRTColumnHelper,
  MRT_ColumnFiltersState,
} from "material-react-table";
import {
  Box,
  Grid,
  ListItemIcon,
  ListItemText,
  MenuItem,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  DATETIME_LOCAL_FORMAT,
  DEFAULT_ND,
  ROW_TOOLTIP_DELAY,
} from "@/utils/constants";
import _, { camelCase } from "lodash";
import i18next, { t } from "i18next";
import dayjs from "dayjs";
import { MRT_Localization_IT } from "material-react-table/locales/it";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import SimpleCard from "@/components/common/SimpleCard";
import useToast from "@/hook/useToast";
import TableFormDialog from "@/components/common/table/TableForm";
import { parseDateWithTimezone } from "@/utils/dates";
import Button from "@/components/common/Button";
import { Location } from "react-router-dom";
import {
  ConfigColumn,
  Data,
  DefaultConfig,
  TableFeatures as TableFeaturesType,
  ComponentFooter,
  ColumnHidden,
  TableTimestamp,
} from "@/types";
import TableFeatures from "../common/table/common/Features";
import {
  getFormattedValue,
  getPrintFormatterByType,
  sortingFnPrimitives,
} from "@/components/common/table/common/utils";
import { AppActions } from "@/components/layout/mainlayout";
import Footer from "@/components/common/Footer";
import { DEFAULT_THEME_NAME } from "@/utils/constants";

import { ThemesContext } from "@/themes";

dayjs.extend(customParseFormat);

const DEFAULT_PAGE_SIZE = 10;
const DELETE_FIELD = "DT_RowId";
interface BasicTableProps {
  id: string;
  title: string;
  columns?: ConfigColumn[];
  features?: TableFeaturesType;
  dataFields: any[];
  commonData?: any;
  footer?: ComponentFooter;
  config?: DefaultConfig;
  data?: Data[];
  timestamp?: TableTimestamp;
  tableIdField?: string;
  tableName: string;
  state?: {
    columnFilters?: MRT_ColumnFiltersState;
  };
  dispatch: Dispatch<AppActions>;
  configurableEndpoint: (path: string, args?: any) => Promise<any>;
  configurableEndpointPost: (
    url: string,
    data?: any,
    config?: any
  ) => Promise<any>;
  forceReload: () => void;
  forceComponentReload: (id: string) => void;
  forceComponentReloadByName: (name: string) => void;
  location: Location<any>;
  isSubTable?: boolean;
}

const columnHelper = createMRTColumnHelper<any>();

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

export const defaultFeatures = {
  exportCsv: true,
  exportPdf: true,
  refresh: false,
} as TableFeaturesType;

const BasicTable = (props: BasicTableProps) => {
  const {
    id,
    title = DEFAULT_ND,
    features = defaultFeatures,
    columns: propsColumns = [],
    dataFields: fields = [],
    commonData,
    footer,
    config,
    timestamp,
    data: propsData,
    tableIdField = import.meta.env.VITE_DEFAULT_TABLE_FIELD_ID || "id",
    tableName,
    dispatch,
    state,
    configurableEndpoint,
    forceComponentReload,
    forceComponentReloadByName,
    location,
    isSubTable = false,
  } = props;

  const [open, setOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [openForm, setOpenForm] = useState(false);
  const [rowToEdit, setRowToEdit] = useState<MRT_Row<any> | undefined>();
  const [isLoading, setIsLoading] = useState<
    "add" | "delete" | "firmware" | undefined
  >();
  const [rowIdToDelete, setRowIdToDelete] = useState<string>();
  const { addNotification } = useToast();

  const [data, setData] = useState<Array<any>>([]);
  const [tableFeatures, setTableFeatures] = useState<
    TableFeaturesType | undefined
  >(features);

  useEffect(() => {
    setTableFeatures(Object.assign({}, defaultFeatures, features));
  }, [features]);

  useEffect(() => {
    const fieldsData = fields
      .map((field) => {
        return field?.data || [];
      })
      .flat();

    setData(fieldsData);
  }, [fields]);

  const handleExportRowsCsv = (rows: MRT_Row<any>[]) => {
    const idItems = propsColumns
      .filter((column) => !isColumnHidden(column.hiddenFromPrint))
      .map((column) => {
        const formatter =
          column.formatter?.renderForPrint ??
          (column.formatter
            ? getPrintFormatterByType(column.formatter)
            : undefined);

        return {
          id: column.field,
          header: t(column.headerName || DEFAULT_ND),
          customRenderer: formatter,
        };
      });

    const filteredData: any = rows.map((row: any) => {
      const dataItems = idItems.map((idItem) => {
        const rowValues = row.original;
        let value = rowValues[idItem.id || ""];
        if (idItem.customRenderer) {
          value = idItem.customRenderer(value, rowValues, {
            t,
            get: _.get,
            commonData,
            tableIdField,
          });
        }

        return {
          [idItem.header]: value,
        };
      });

      return dataItems.reduce((acc: any, item: any) => {
        return { ...acc, ...item };
      }, {});
    });

    const csv = generateCsv(csvConfig)(filteredData);
    csvConfig.filename = `${camelCase(t(title))}`;
    download(csvConfig)(csv);
  };

  const handleExportRowsPdf = (rows: MRT_Row<any>[]) => {
    const doc = new jsPDF();
    const tableHeaders = columns
      .filter((column) => {
        const propsColumn = propsColumns.find((pc) => column.id === pc.field);

        return !isColumnHidden(propsColumn?.hiddenFromPrint);
      })
      .map((c) => c.header);

    const idItems = propsColumns
      .filter((column) => !isColumnHidden(column.hiddenFromPrint))
      .map((column) => {
        const formatter =
          column.formatter?.renderForPrint ??
          (column.formatter
            ? getPrintFormatterByType(column.formatter)
            : undefined);

        return {
          id: column.field,
          customRenderer: formatter,
        };
      });
    const filteredData = rows.map((row: any) => {
      return idItems.map((idItem) => {
        const rowValues = row.original;
        const value = rowValues[idItem.id || ""];
        if (idItem.customRenderer) {
          return idItem.customRenderer(value, rowValues, {
            t,
            get: _.get,
            commonData,
            tableIdField,
          });
        }

        return value;
      });
    });

    autoTable(doc, {
      head: [tableHeaders],
      body: filteredData,
    });

    doc.save(`${camelCase(t(title))}.pdf`);
  };

  const columns = useMemo(() => {
    return propsColumns.map((c: ConfigColumn) => {
      const filterSelectOptions = c.filterSelectOptions?.map((option) => {
        if (typeof option === "string") {
          return option;
        }
        return { label: t(option.label), value: option.value };
      });

      return columnHelper.accessor(c.field, {
        id: c.field,
        header: c.headerName ? t(c.headerName) : "",
        size: c.width,
        enableColumnActions: !!c.showMenu,
        enableSorting: !!c.sortable,
        sortingFn: c.sortingFn ?? sortingFnPrimitives,
        enableColumnFilter: !!c.filterable,
        visibleInShowHideMenu: true,
        filterVariant: c.filterVariant,
        filterFn: c.filterFn,
        filterSelectOptions: filterSelectOptions,
        Cell: ({ cell, row }) => {
          const cellValue = cell.getValue();
          let normalizedRenderedCellValue = getFormattedValue({
            row,
            cellValue,
            column: c,
            commonData,
            tableIdField,
            configurableEndpoint,
            addNotification,
            refreshTable: () => forceComponentReload(id),
          });

          return normalizedRenderedCellValue;
        },
      });
    });
  }, [fields, propsColumns, commonData]);

  const defaultSorting = useMemo(() => {
    return config?.sort
      ? {
          id: config.sort.field,
          desc: config.sort.order === "desc",
        }
      : undefined;
  }, [columns]);

  const openDeleteConfirmModal = (row: MRT_Row<any>) => {
    setRowIdToDelete(row.original[DELETE_FIELD]);
    setOpen(true);
  };

  const confirmDeleteRow = async () => {
    const tableType = (propsData || [])[0]?.config?.params?.type;
    if (tableType) {
      setOpen(false);

      setOpenForm(false);
      !isSubTable &&
        dispatch({
          type: "can_poll",
          payload: true,
        });
      setIsLoading("delete");
      return configurableEndpoint("remove", {
        type: tableType,
        [DELETE_FIELD]: rowIdToDelete,
      })
        .then((response: any) => {
          if (response?.result === "error") {
            addNotification(response.message, { variant: "error" });
          }
          refreshComponent();
          forceComponentReload(id);
        })
        .catch((e: any) => {
          addNotification(e.message, { variant: "error" });
        })
        .finally(() => {
          setIsLoading(undefined);
        });
    }
  };

  const createNewRecord = () => {
    const tableType = (propsData || [])[0]?.config?.params?.type;
    if (tableType) {
      setIsLoading("add");
      return configurableEndpoint("add", {
        type: tableType,
      })
        .then((response: any) => {
          if (response?.result === "error") {
            addNotification(response.message, { variant: "error" });
          }
          refreshComponent();
          forceComponentReload(id);
        })
        .catch((e: any) => {
          addNotification(e.message, { variant: "error" });
        })
        .finally(() => {
          setIsLoading(undefined);
        });
    }
  };

  const isEditable = useMemo(() => {
    return tableFeatures?.form != null;
  }, [tableFeatures]);

  const openEditForm = (row: MRT_Row<any>) => {
    setRowToEdit(row);
    setOpenForm(true);
    !isSubTable &&
      dispatch({
        type: "can_poll",
        payload: false,
      });
  };

  const clickDeleteAction = (event: any, row: MRT_Row<any>) => {
    event.stopPropagation();
    openDeleteConfirmModal(row);
  };

  const isDeletable = useMemo(() => {
    return tableFeatures?.actions?.withDelete;
  }, [tableFeatures]);

  const hasCustomAction = useMemo(() => {
    return tableFeatures?.actions?.custom != null;
  }, [tableFeatures]);

  const hasActions = useMemo(() => {
    return isDeletable || hasCustomAction;
  }, [isDeletable, hasCustomAction]);

  const hasActionsMenu = useMemo(() => {
    return [isDeletable, hasCustomAction].filter((a) => !!a).length > 1;
  }, [isDeletable, hasCustomAction]);

  const isFilterable = useMemo(() => {
    return propsColumns.some((c) => c.filterable);
  }, [propsColumns]);

  const hasGlobalFilter = useMemo(() => {
    const configEnableGlobalFilter = config?.filtering?.enableGlobalFilter;
    return configEnableGlobalFilter == null ? true : configEnableGlobalFilter;
  }, [config]);

  const isColumnHidden = useCallback(
    (hidden: ColumnHidden | undefined) => {
      if (hidden && typeof hidden === "function") {
        return hidden(commonData);
      }

      return hidden;
    },
    [commonData]
  );

  const getColumnHidden = useCallback(
    (propsColumnsArg: ConfigColumn[]) =>
      propsColumnsArg
        .map((c) => ({ [c.field]: !isColumnHidden(c.hidden) }))
        .reduce((obj, item) => (obj = { ...obj, ...item }), {}),
    [isColumnHidden, commonData]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    onColumnFiltersChange:
      config?.filtering?.onColumnFiltersChange ?? setColumnFilters,
    enableGlobalFilter: hasGlobalFilter,
    autoResetPageIndex: true,
    enableRowSelection: false,
    enablePagination: config?.pagination?.enabled ?? true,
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    enableFullScreenToggle: false,
    enableHiding: config?.hiding?.enabled ?? true,
    enableDensityToggle: false,
    enableBatchRowSelection: false,
    enableSelectAll: false,
    enableMultiRowSelection: false,
    enableColumnFilters: isFilterable,
    enableRowActions: hasActions,
    positionActionsColumn: features.actions?.positionActionsColumn ?? "last",
    renderRowActions: !hasActionsMenu
      ? ({ row }) => (
          <Grid container direction="row" spacing={1}>
            {isDeletable ? (
              <Grid item xs={6} md={6}>
                <Tooltip title={t("table-delete")}>
                  <span>
                    <Button
                      color="error"
                      onClick={(event) => clickDeleteAction(event, row)}
                      isIconButton
                      icon={<DeleteIcon />}
                    />
                  </span>
                </Tooltip>
              </Grid>
            ) : null}
            {tableFeatures?.actions?.custom &&
              tableFeatures.actions.custom({ row })}
          </Grid>
        )
      : undefined,
    renderRowActionMenuItems: hasActionsMenu
      ? ({ row, closeMenu }) => {
          const actions = [] as ReactNode[];

          isDeletable &&
            actions.push(
              <MenuItem
                key="delete"
                onClick={(event) => {
                  clickDeleteAction(event, row);
                  closeMenu();
                }}
              >
                <ListItemIcon color="error">
                  <DeleteIcon sx={{ color: "error.main" }} />
                </ListItemIcon>
                <ListItemText>{t("table-delete")}</ListItemText>
              </MenuItem>
            );

          tableFeatures?.actions?.custom &&
            actions.push(tableFeatures.actions.custom({ row }));

          return actions;
        }
      : undefined,
    state: {
      columnFilters,
      ...(state || {}),
      columnVisibility: getColumnHidden(propsColumns),
      isLoading: isLoading === "delete",
    },
    initialState: {
      density: "compact",
      pagination: {
        pageSize: config?.pagination?.pageSize || DEFAULT_PAGE_SIZE,
        pageIndex: config?.pagination?.pageIndex || 0,
      },
      sorting: defaultSorting ? [defaultSorting] : [],
    },
    manualFiltering: !!config?.filtering?.manual,
    localization: ["it", "it-IT", "ita", "IT"].includes(i18next.language)
      ? MRT_Localization_IT
      : MRT_Localization_EN,
    renderTopToolbarCustomActions: ({ table }) =>
      !!tableFeatures ? (
        <TableFeatures
          id={id}
          table={table}
          tableFeatures={tableFeatures}
          isLoading={isLoading}
          createNewRecord={createNewRecord}
          handleExportRowsCsv={handleExportRowsCsv}
          handleExportRowsPdf={handleExportRowsPdf}
          forceComponentReload={forceComponentReload}
        />
      ) : null,
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        background: "none",
      },
    },
    muiBottomToolbarProps: {
      sx: {
        background: "none",
        boxShadow: "none",
      },
    },
    muiTopToolbarProps: {
      sx: {
        background: "none",
        "& .MuiButtonBase-root": {
          "&.Mui-disabled": {
            opacity: 0.7,
          },
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: "none",
      },
    },
    muiTableBodyRowProps: isEditable
      ? ({ row }) => ({
          onClick: (_event) => {
            openEditForm(row);
          },
          component: timestamp ? Tooltip : Box,
          enterDelay: timestamp?.delay ?? ROW_TOOLTIP_DELAY,
          title: timestamp
            ? dayjs(
                parseDateWithTimezone(row.original[timestamp.field])
              ).format(timestamp.format || DATETIME_LOCAL_FORMAT)
            : "",
          sx: {
            cursor: "pointer",
          },
        })
      : undefined,
  });

  const editRowModalTitle = useMemo(() => {
    let title = "";

    (tableFeatures?.form?.title || []).forEach((dialogTitle) => {
      const titleItem =
        dialogTitle.type === "translationId"
          ? t(dialogTitle.value)
          : dialogTitle.value && rowToEdit
            ? rowToEdit.original[dialogTitle.value] || dialogTitle.value
            : "";

      title = title === "" ? titleItem : title + " - " + titleItem;
    });

    return title;
  }, [tableFeatures, rowToEdit]);

  const closeEditForm = () => {
    setOpenForm(false);
    !isSubTable &&
      dispatch({
        type: "can_poll",
        payload: true,
      });
    setRowToEdit(undefined);
  };

  const formDataToEdit = useMemo(() => {
    const fieldToEdit = fields.find((field) => {
      return field.id === tableName;
    });

    const dataToEdit = (fieldToEdit?.data || []).find((d: any) => {
      return d[tableIdField] === rowToEdit?.original[tableIdField];
    });

    return dataToEdit;
  }, [fields, rowToEdit]);

  const refreshComponent = () => {
    tableFeatures?.refreshComponentOnSave &&
      forceComponentReloadByName(tableFeatures.refreshComponentOnSave);
    forceComponentReload(id);
  };

  const themes = useContext(ThemesContext);
  const tableTheme = useMemo(() => {
    const themeKey = Object.keys(themes).find((key) => key.includes("dark"));

    if (themeKey) {
      return themes[themeKey];
    }

    return themes[DEFAULT_THEME_NAME];
  }, [themes]);

  return (
    <>
      <ConfirmDialog
        open={open}
        onDiscard={() => setOpen(false)}
        onConfirm={confirmDeleteRow}
      />
      <TableFormDialog
        open={openForm}
        onDiscard={closeEditForm}
        onConfirm={closeEditForm}
        onDelete={
          isDeletable
            ? () => rowToEdit && openDeleteConfirmModal(rowToEdit)
            : undefined
        }
        title={editRowModalTitle}
        refresh={refreshComponent}
        inputs={tableFeatures?.form?.inputs || []}
        tableName={tableName}
        rowId={rowToEdit?.original[tableIdField]}
        formDataToEdit={formDataToEdit}
        commonData={commonData}
        dispatch={dispatch}
        configurableEndpoint={configurableEndpoint}
        location={location}
        footer={tableFeatures?.form?.footer}
      />
      <SimpleCard title={t(title)} fullWidth id="table-container">
        <ThemeProvider theme={tableTheme || {}}>
          <MaterialReactTable table={table} />
        </ThemeProvider>
        {footer && <Footer footer={footer} />}
      </SimpleCard>
    </>
  );
};

export default BasicTable;
