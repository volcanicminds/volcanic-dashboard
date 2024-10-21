import { useMemo } from "react";
import type { Preview } from "@storybook/react";
import { Theme } from "@mui/material/styles";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import {
  componentsCustomization,
  baseThemes,
  typographies,
} from "../src/configuration";

import "./i18n";
import i18next from "i18next";
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

i18next.addResourceBundle(
  "it",
  "translation",
  {
    "hp-model": "Modello",
    "hp-serial": "Seriale",
    "secumgr-ipk": "IPK SECUMGR",
    "cu-firmware-ipk": "IPK FIRMWARE CU",
    "hp-ipaddr": "Indirizzo IP",
    "hp-gwaddr": "Indirizzo GW",
    "cu-plant": "Impianto",
    id: "ID",
    timestamp: "Data",
    "hp-events-title": "Eventi",
    "vp-available": "Punti utilizzati: ",
    "vp-of": " di ",
    "vp-inputs": "Ingressi",
    "vp-outputs": "Uscite",
    "vp-free": "Liberi",
    "virtio-evt": "Event",
    "virtio-evt-eyemotion-1": "Movement",
    "virtio-evt-eyemotion-10": "Area Exit",
    "virtio-evt-eyemotion-11": "Crossing count",
    "virtio-evt-eyemotion-2": "Intrusion",
    "virtio-evt-eyemotion-3": "Crossing",
    "virtio-evt-eyemotion-4": "Change scene",
    "virtio-evt-eyemotion-5": "Darkening",
    "virtio-evt-eyemotion-6": "Blindness",
    "virtio-evt-eyemotion-7": "VDF",
    "virtio-evt-eyemotion-8": "VDF Match",
    "virtio-evt-eyemotion-9": "Entrance Area",
    "virtio-evt-hikvision-1": "Motion",
    "virtio-evt-hikvision-10": "Tampering",
    "virtio-evt-hikvision-11": "Abandoned Object",
    "virtio-evt-hikvision-12": "Facial recognition",
    "virtio-evt-hikvision-13": "WL Sensor",
    "virtio-evt-hikvision-2": "Shelter",
    "virtio-evt-hikvision-3": "PIR",
    "virtio-evt-hikvision-4": "Scene Change",
    "virtio-evt-hikvision-5": "Face detection",
    "virtio-evt-hikvision-6": "Line detection",
    "virtio-evt-hikvision-7": "Area Entrance",
    "virtio-evt-hikvision-8": "Area Exit",
    "virtio-evt-hikvision-9": "Intrusion",
    "virtio-evt-redscan-1": "A1",
    "virtio-evt-redscan-2": "DM",
    "virtio-evt-redscan-3": "MO",
    "virtio-evt-redscan-4": "DQ",
    "virtio-evt-redscan-5": "AR",
    "virtio-evt-redscan-6": "AM",
    "virtio-evt-redscan-7": "TR",
    "virtio-evt-redscan-8": "SO",
    "virtio-evt-redscan-9": "TA",
    "none-btn": "Nessuno",
    all: "Tutti",
    "sch-prg-number": "Numero",
    "sch-prg-hc": "Abilitato",
    "sch-prg-description": "Descrizione",
    "ccu-central-tamper-label": "Manutenzione",
    "ccu-maintenance-dip1-label": "DIP 1",
    "ccu-sabotage-label": "Sabotaggio",
    "ccu-wifi-status-label": "WiFi",
    "ccu-mobile-status-label": "GSM",
    "ccu-ZigBee-status-label": "ZigBee",
    "ccu-pstn-status-label": "PSTN",
    "stu-download-status-label": "Download",
    "stu-upload-status-label": "Upload",
    "battery-test-info": "Clicca sul pulsante per avviare il test batteria",
    "battery-ko": "Test batteria fallito",
    "cm-find-operators": "Trova operatori",
    "cm-not-available": "Non disponibile",
    "not-online": "Non online",
    "cm-contact-list": "Contatti",
    "cm-gsm-number": "Numero",
    "cm-gsm-operator": "Operatore",
    "cm-gsm-signal": "Segnale",
    "cp-available": "Punti utilizzati: ",
    "cp-of": " di ",
    "cp-inputs": "Ingressi",
    "cp-outputs": "Uscite",
    "cp-free": "Libero",
    "cp-free2": "Liberi",
    "btn-zigbee-search-warning":
      "La ricerca e il reset dei dispositivi ZigBee sono disponibili solo se il sistema è in stato di manutenzione",
    "zigbee-info": "Informazioni ZigBee",
    "zigbee-reset-info": "Reset ZigBee",
    "tts-info": "TTS",
    "tts-title-list": "Lista TTS",
    "tts-begin": "Inizio",
    "progress-bar-title": "Aggiornamento firmware",
    "st-speed-test": "Test velocità",
    "utilities.export-label": "Esporta",
    "utilities.export-cloud-label": "Esporta su cloud",
    NodoExportCloud: "Esporta su cloud",
    "utilities.import-label": "Importa",
    NodoImport: "Importa",
    "utilities.import-cloud-label": "Importa da cloud",
    NodoImportCloud: "Importa da cloud",
  },
  true,
  true
);
i18next.addResourceBundle(
  "en",
  "translation",
  {
    "hp-model": "Model",
    "hp-serial": "Serial",
    "secumgr-ipk": "IPK SECUMGR",
    "cu-firmware-ipk": "IPK FIRMWARE CU",
    "hp-ipaddr": "IP Address",
    "hp-gwaddr": "GW Address",
    "cu-plant": "Plant",
    id: "ID",
    timestamp: "Date",
    "hp-events-title": "Events",
    "vp-available": "Used points: ",
    "vp-of": " of ",
    "vp-inputs": "Inputs",
    "vp-outputs": "Outputs",
    "vp-free": "Free",
    "virtio-evt": "Event",
    "virtio-evt-eyemotion-1": "Movement",
    "virtio-evt-eyemotion-10": "Exit Area",
    "virtio-evt-eyemotion-11": "Crossing count",
    "virtio-evt-eyemotion-2": "Intrusion",
    "virtio-evt-eyemotion-3": "Crossing",
    "virtio-evt-eyemotion-4": "Change scene",
    "virtio-evt-eyemotion-5": "Darkening",
    "virtio-evt-eyemotion-6": "Blindness",
    "virtio-evt-eyemotion-7": "VDF",
    "virtio-evt-eyemotion-8": "VDF Match",
    "virtio-evt-eyemotion-9": "Entrance Area",
    "virtio-evt-hikvision-1": "Motion",
    "virtio-evt-hikvision-10": "Tampering",
    "virtio-evt-hikvision-11": "Abandoned Object",
    "virtio-evt-hikvision-12": "Facial recognition",
    "virtio-evt-hikvision-13": "WL Sensor",
    "virtio-evt-hikvision-2": "Shelter",
    "virtio-evt-hikvision-3": "PIR",
    "virtio-evt-hikvision-4": "Scene Change",
    "virtio-evt-hikvision-5": "Face detection",
    "virtio-evt-hikvision-6": "Line detection",
    "virtio-evt-hikvision-7": "Entrance Area",
    "virtio-evt-hikvision-8": "Exit Area",
    "virtio-evt-hikvision-9": "Intrusion",
    "virtio-evt-redscan-1": "A1",
    "virtio-evt-redscan-2": "DM",
    "virtio-evt-redscan-3": "MO",
    "virtio-evt-redscan-4": "DQ",
    "virtio-evt-redscan-5": "AR",
    "virtio-evt-redscan-6": "AM",
    "virtio-evt-redscan-7": "TR",
    "virtio-evt-redscan-8": "SO",
    "virtio-evt-redscan-9": "TA",
    "none-btn": "None",
    all: "All",
    "sch-prg-number": "Number",
    "sch-prg-hc": "Enabled",
    "sch-prg-description": "Description",
    "ccu-central-tamper-label": "Maintenance",
    "ccu-maintenance-dip1-label": "DIP 1",
    "ccu-sabotage-label": "Sabotage",
    "ccu-wifi-status-label": "WiFi",
    "ccu-mobile-status-label": "GSM",
    "ccu-ZigBee-status-label": "ZigBee",
    "ccu-pstn-status-label": "PSTN",
    "stu-download-status-label": "Download",
    "stu-upload-status-label": "Upload",
    "battery-test-info": "Click on the button to start the battery test",
    "battery-ko": "Battery test failed",
    "cm-find-operators": "Find operators",
    "cm-not-available": "Not available",
    "not-online": "Not online",
    "cm-contact-list": "Contacts",
    "cm-gsm-number": "Number",
    "cm-gsm-operator": "Operator",
    "cm-gsm-signal": "Signal",
    "cp-available": "Used points: ",
    "cp-of": " of ",
    "cp-inputs": "Inputs",
    "cp-outputs": "Outputs",
    "cp-free": "Free",
    "cp-free2": "Free",
    "btn-zigbee-search-warning":
      "ZigBee devices search and reset are available only if the system is in maintenance state",
    "zigbee-info": "ZigBee info",
    "zigbee-reset-info": "ZigBee reset",
    "tts-info": "TTS",
    "tts-title-list": "TTS list",
    "tts-begin": "Begin",
    "progress-bar-title": "Firmware upgrade",
    "st-speed-test": "Speed test",
    "utilities.export-label": "Export",
    "utilities.export-cloud-label": "Export to cloud",
    NodoExportCloud: "Export to cloud",
    "utilities.import-label": "Import",
    NodoImport: "Import",
    "utilities.import-cloud-label": "Import from cloud",
    NodoImportCloud: "Import from cloud",
  },
  true,
  true
);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      values: [
        { name: "Dark", value: "#333" },
        { name: "Light", value: "#F7F9F2" },
      ],
    },
    tags: ["autodocs"],
  },

  initialGlobals: {
    backgrounds: { value: "light" },
  },
};

export const withMuiTheme = (Story, context) => {
  const { theme: themeKey } = context.globals;

  const theme = useMemo(() => baseThemes[themeKey] as Theme, [themeKey]);
  const overrideTypography = useMemo(
    () =>
      (
        typographies as {
          [key: string]: any;
        }
      )[themeKey],

    [typographies, themeKey]
  );

  const themeOptions = useMemo(
    () => ({
      palette: theme.palette,
      typography: overrideTypography,
    }),
    [theme, overrideTypography]
  );

  const muiTheme = createTheme(themeOptions);
  muiTheme.components = componentsCustomization(themeKey, muiTheme);

  return (
    <ThemeProvider theme={muiTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Story />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export const decorators = [withMuiTheme];

export const globalTypes = {
  theme: {
    name: "Theme",
    title: "Theme",
    description: "Theme for your components",
    defaultValue: "mytheme",
    toolbar: {
      icon: "paintbrush",
      dynamicTitle: true,
      items: [{ value: "mytheme", title: "My Theme" }],
    },
  },
};

export default preview;
