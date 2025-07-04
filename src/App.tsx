import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import "mantine-datatable/styles.css";
import "./style/index.css";

import classes from "./App.module.css";
import { cssVariablesResolver, presetTheme } from "./style/StyleProvider";

import { AppShell, Center, MantineProvider, Stack } from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { Outlet, useLocation } from "react-router-dom";
import WelcomeView from "./app/WelcomeView";
import LoginUI from "./app/login/LoginUI";
import Header from "./app/shell/Header/Header";
import Sidebar from "./app/shell/Sidebar/Sidebar";
import i18n from "./i18n";
import { useSetting } from "./logic/settings/hooks/useSetting";
import { importSharedDeck } from "./logic/share/importSharedDeck";

function useRestoreLanguage() {
  const [language] = useSetting("language");
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return language;
}

export default function App() {
  const [colorSchemePreference] = useSetting("colorSchemePreference");
  useRestoreLanguage();
  const [sidebarMenuOpened, sidebarhandlers] = useDisclosure(false);

  const [registered] = useLocalStorage({
    key: "registered",
    defaultValue: false,
  });

  // 共有リンク (/k/xxxx) で開いたらデッキを取り込む
  useEffect(() => {
    const path = window.location.pathname; // 例 /k/abcd1234
    if (path.startsWith("/k/")) {
      const key = path.split("/k/")[1];
      fetch("/.netlify/functions/share-get/" + key)
        .then((res) => res.json())
        .then((deck) => {
          importSharedDeck(deck); // Dexie に保存
          alert("共有デッキを取り込みました！");
        })
        .catch(() => alert("共有デッキの取得に失敗しました"));
    }
  }, []);

  const routeIsLearn = useLocation().pathname.includes("learn");
  useEffect(() => {
    if (routeIsLearn) {
      sidebarhandlers.close();
    } else {
      sidebarhandlers.open();
    }
  }, [routeIsLearn]);

  return (
    <I18nextProvider i18n={i18n}>
      <MantineProvider
        defaultColorScheme={colorSchemePreference}
        cssVariablesResolver={cssVariablesResolver}
        theme={presetTheme}
      >
        <Notifications
          transitionDuration={400}
          containerWidth="20rem"
          position="bottom-center"
          autoClose={2000}
          limit={1}
        />
        {registered ? (
          <AppShell
            layout="alt"
            navbar={{
              width: { xs: "3.5rem", lg: 300 },
              breakpoint: "xs",
              collapsed: {
                mobile: !sidebarMenuOpened,
                desktop: !sidebarMenuOpened,
              },
            }}
            header={{ height: 60 }}
          >
            <Header
              menuOpened={sidebarMenuOpened}
              menuHandlers={sidebarhandlers}
            />
            <AppShell.Navbar>
              <Sidebar
                menuOpened={sidebarMenuOpened}
                menuHandlers={sidebarhandlers}
              />
            </AppShell.Navbar>

            <AppShell.Main>
              <Stack h="100%">
                <Center className={classes.main} p="md" h="100%" mih={0}>
                  <Outlet />
                </Center>
              </Stack>
            </AppShell.Main>
            <LoginUI />
          </AppShell>
        ) : (
          <WelcomeView />
        )}
      </MantineProvider>
    </I18nextProvider>
  );
}
