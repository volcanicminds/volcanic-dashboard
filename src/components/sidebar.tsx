import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { DRAWER_WIDTH } from "@/utils/config";
import { useDrawer } from "@/hook/useDrawer";
import CloseIcon from "@mui/icons-material/Close";
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import MUIIcon, { IconNames } from "@/components/common/MUIIcon";
import { images, navigation } from "@/configuration";
import {
  type NavigationLeaf,
  type NavigationNode,
} from "@/configuration/types";
import { t } from "i18next";
import LogoutIcon from "@mui/icons-material/Logout";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { LAST_PAGE_STORAGE_KEY, remove } from "@/utils/localStorage";
import Button from "@/components/common/Button";
import { useAuth } from "@/components/AuthProvider";

const theme = import.meta.env.VITE_DEFAULT_THEME;

function shouldBeOpen(pathname: string, parentPath: string) {
  return pathname.startsWith(`/${parentPath}`);
}

const NavigationItem: React.FC<{
  item: NavigationNode | NavigationLeaf;
  parentPath: string;
  pathnameArray: Array<string>;
  editedNodes: string[];
  location: Location<any>;
  navigate: NavigateFunction;
  iteration?: number;
}> = ({
  item,
  parentPath = "/",
  pathnameArray = [],
  editedNodes = [],
  iteration = 0,
  location,
  navigate,
}) => {
  const [open, setOpen] = useState(shouldBeOpen(location.pathname, parentPath));
  const { closeDrawer } = useDrawer();

  const handleClick = () => {
    if ("subItems" in item) {
      // If the element is a NavigationNode with subitems, do nothing on click
      return;
    } else {
      // If the element is a NavigationLeaf, navigate to the associated path
      const leafPath = parentPath;
      navigate(`/${leafPath}`);
      closeDrawer();
    }
  };

  const handleNodeClick = () => {
    setOpen(!open);
  };

  const isEdited = useMemo(() => {
    return editedNodes.includes(
      `/${parentPath}`.replace(/\//g, encodeURIComponent("/"))
    );
  }, [editedNodes, parentPath]);

  return "subItems" in item ? (
    <>
      <ListItemButton
        onClick={handleNodeClick}
        className={`expandable ${open ? "expanded" : ""}`}
      >
        <ListItemText
          disableTypography
          sx={{ display: "flex", gap: 1 }}
          primary={
            item.icon && (
              <MUIIcon iconName={item.icon as IconNames} size="medium" />
            )
          }
          secondary={
            <Typography className={isEdited ? "is-edited" : ""}>
              {t(item.id)}
            </Typography>
          }
        />
        <Box
          width={24}
          height={24}
          className={`expand ${open ? "expand-less" : "expand-more"}`}
        />
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          component="div"
          sx={{
            paddingLeft: 2,
          }}
        >
          {item.subItems.map((subItem, index) => {
            return (
              <NavigationItem
                key={`${subItem.path}-${index}`}
                item={subItem}
                parentPath={`${parentPath}/${subItem.path}`}
                pathnameArray={pathnameArray}
                iteration={iteration + 1}
                editedNodes={editedNodes}
                location={location}
                navigate={navigate}
              />
            );
          })}
        </List>
      </Collapse>
    </>
  ) : (
    <ListItemButton
      selected={location.pathname === `/${parentPath}`}
      onClick={handleClick}
    >
      <ListItemText
        disableTypography
        sx={{ display: "flex", gap: 1 }}
        primary={
          item.icon && (
            <MUIIcon iconName={item.icon as IconNames} size="medium" />
          )
        }
        secondary={
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography className={isEdited ? "is-edited" : ""}>
              {t(item.id)}
            </Typography>
            {isEdited && (
              <Box
                sx={{
                  width: "7px",
                  height: "7px",
                  bgcolor: (theme) =>
                    location.pathname === `/${parentPath}`
                      ? theme.palette.common.white
                      : theme.palette.primary.main,
                  borderRadius: "50%",
                  flex: "none",
                }}
              />
            )}
          </Stack>
        }
      />
    </ListItemButton>
  );
};

export default function Sidebar({ editedNodes }: { editedNodes: string[] }) {
  const { isOpen, closeDrawer } = useDrawer();
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [confirmDialogSettings, setConfirmDialogSettings] = useState<{
    open: boolean;
    title: string;
    content: string;
    confirm: () => void;
  } | null>(null);

  const currentThemeImages = useMemo(() => images, [theme, images]);

  const currentPath = useMemo(() => {
    return location.pathname.split("/").slice(1);
  }, [location]);

  const handleLogout = (resetLocalStorage: boolean = true) => {
    resetLocalStorage && remove(LAST_PAGE_STORAGE_KEY);
    setConfirmDialogSettings(null);
    setToken(null);
    navigate("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 599) {
        closeDrawer();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Stack
      zIndex={2}
      left={0}
      top={0}
      width={{ xs: isOpen ? "100%" : 0, sm: DRAWER_WIDTH }}
      height="100vh"
      bgcolor={(theme) => theme.palette.sidebarBg?.main}
      position="fixed"
      display={{ xs: isOpen ? "flex" : "none", sm: "flex" }}
      className="sidebar"
      overflow="hidden"
      color={(theme) => theme.palette.sidebarText?.main}
    >
      {/* Close button */}
      <Stack
        className="close-btn"
        sx={{ display: { xs: "flex", sm: "none" } }}
        px={3}
      >
        <Button
          onClick={closeDrawer}
          startIcon={<CloseIcon />}
          sx={{ textTransform: "none", fontWeight: 700 }}
        >
          {t("sidebar-closeMenu")}
        </Button>
      </Stack>

      <Stack flex={1} overflow="auto" className="menu">
        {/* Logo */}
        <Stack p={3} direction="row" justifyContent="center">
          <Box
            component="img"
            src={
              (currentThemeImages[`./themes/${theme}/images/logo.png`] as any)
                ?.default
            }
            className="logo"
            sx={{
              objectFit: "contain",
            }}
            alt="Logo"
          />
        </Stack>

        {/* Menu items */}
        <List sx={{ mb: "auto", px: 3 }} className="menu-items">
          {navigation.map((item, index) => (
            <NavigationItem
              key={index}
              item={item}
              parentPath={item.path}
              pathnameArray={currentPath}
              editedNodes={editedNodes}
              location={location}
              navigate={navigate}
            />
          ))}
        </List>

        <ConfirmDialog
          open={!!confirmDialogSettings?.open}
          title={confirmDialogSettings?.title}
          content={confirmDialogSettings?.content}
          onDiscard={() => setConfirmDialogSettings(null)}
          onConfirm={confirmDialogSettings?.confirm || (() => {})}
        />
      </Stack>

      <Stack spacing={1} px={3}>
        <Button
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          variant="contained"
          color="secondary"
        >
          {t("logout-btn")}
        </Button>
      </Stack>
    </Stack>
  );
}
