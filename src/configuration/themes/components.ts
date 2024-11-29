// third-party
import { merge } from "lodash";

// project import
import { Theme } from "@mui/material";
import componentsList from "@/configuration/themes/componentsIndex";

const defaultComponent = {
  default: (_theme: Theme) => null,
};

const componentsCustomization = (themeName: string, theme: Theme) => {
  const components =
    (
      componentsList as {
        [key: string]: any;
      }
    )[themeName] || [];

  //We need to list the components that we want to customize
  const Button = components["Button"] || defaultComponent;
  const ListItemButton = components["ListItemButton"] || defaultComponent;
  const SimpleCard = components["SimpleCard"] || defaultComponent;
  const BasicTable = components["BasicTable"] || defaultComponent;
  const Form = components["Form"] || defaultComponent;
  const Sidebar = components["Sidebar"] || defaultComponent;
  const MainLayout = components["MainLayout"] || defaultComponent;
  const Login = components["Login"] || defaultComponent;
  const CssBaseline = components["CssBaseline"] || defaultComponent;
  const DataGroup = components["DataGroup"] || defaultComponent;
  const Dialog = components["Dialog"] || defaultComponent;
  const Accordion = components["Accordion"] || defaultComponent;
  const FileInput = components["FileInput"] || defaultComponent;

  return merge(
    Button.default(theme),
    SimpleCard.default(theme),
    ListItemButton.default(theme),
    BasicTable.default(theme),
    Form.default(theme),
    Sidebar.default(theme),
    MainLayout.default(theme),
    Login.default(theme),
    CssBaseline.default(theme),
    DataGroup.default(theme),
    Dialog.default(theme),
    Accordion.default(theme),
    FileInput.default(theme)
  );
};

export default componentsCustomization;
