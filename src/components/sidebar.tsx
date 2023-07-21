import { styled, Theme, CSSObject } from "@mui/material/styles";
import {
  Box,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Dashboard, Notifications, Settings } from "@mui/icons-material";
import Image from "mui-image";
import logo from "@/assets/logo.png";
import { FormattedMessage } from "react-intl";
import { DRAWER_WIDTH } from "@/utils/config";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";
import { openDrawer } from "@/app/store/customizationSlice";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(
  MuiDrawer,
  {}
)(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const open = useSelector(
    (state: RootState) => state.customization.isDrawerOpen
  );

  const handleDrawer = () => {
    dispatch(openDrawer({ open: !open }));
  };

  const upperMenuItems = [
    {
      icon: <Dashboard />,
      navigateTo: "/",
      label: (
        <FormattedMessage
          id={"menu.dashboard"}
          description="The menu item to navigate to the dashboard"
        />
      ),
    },
  ];

  const lowerMenuItems = [
    {
      icon: <Notifications />,
      navigateTo: "/notifications",
      label: (
        <FormattedMessage
          id={"menu.notifications"}
          description="The menu item to navigate to the notifications page"
        />
      ),
    },
    {
      icon: <Settings />,
      navigateTo: "/settings",
      label: (
        <FormattedMessage
          id={"menu.settings"}
          description="The menu item to navigate to the settings page"
        />
      ),
    },
  ];
  const drawer = (
    <>
      <DrawerHeader>
        <Link to="/">
          <Image
            style={{ padding: "1em" }}
            easing="none"
            duration={0}
            width={150}
            src={logo}
            fit="contain"
          />
        </Link>
      </DrawerHeader>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <List>
          {upperMenuItems.map((item, index) => (
            <ListItem key={`SidebarItems${index}`} disablePadding>
              <ListItemButton onClick={() => navigate(item.navigateTo)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List>
          {lowerMenuItems.map((item, index) => (
            <ListItem key={`SidebarItems${index}`} disablePadding>
              <ListItemButton onClick={() => navigate(item.navigateTo)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: "auto" },
        flexShrink: { sm: 0 },
        display: { xs: "none", sm: "block" },
      }}
    >
      <Drawer
        variant="temporary"
        open={!open}
        onClose={handleDrawer}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer variant="permanent" open={open}>
        {drawer}
      </Drawer>
    </Box>
  );
}
