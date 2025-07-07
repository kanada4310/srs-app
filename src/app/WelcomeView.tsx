import {
  Alert,
  Anchor,
  Button,
  Center,
  CheckIcon,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconInfoCircle } from "@tabler/icons-react";
import { t } from "i18next";
import { useEffect } from "react";

export default function WelcomeView() {
  const [_, setRegistered] = useLocalStorage({
    key: "registered",
    defaultValue: false,
  });

  useEffect(() => {}, []);
  return (
    <Center py="4rem" px="0.5rem" w="100%">
      <Stack gap="2rem" maw="600px">
        <div style={{ position: "relative" }}>
          <Image
            src="logo.svg"
            alt="Swallow Logo"
            maw="4rem"
            style={{
              position: "absolute",
              filter: "blur(20px)",
              opacity: 0.5,
              zIndex: -1,
            }}
          />
          <Image src="logo.svg" alt="Swallow Logo" maw="4rem" />
        </div>
        <Stack gap="xs">
          <Title order={1}>{t("welcome-view.welcome-title")}</Title>
          <Text fz="sm">{t("welcome-view.welcome-subtitle")}</Text>
          {[
            t("welcome-view.feature-no-signup"),
            t("welcome-view.feature-free-open-source"),
            t("welcome-view.feature-directly-in-browser"),
            t("welcome-view.feature-no-tracking"),
          ].map((item) => (
            <Group key={item} align="center" gap="xs">
              <CheckIcon
                style={{ color: "var(--mantine-color-green-strong)" }}
                size={12}
              />{" "}
              <Text fz="sm">{item}</Text>
            </Group>
          ))}
        </Stack>
        <Alert color="gray" icon={<IconInfoCircle />}>
          {t("welcome-view.alert-message")}
          <Anchor
            href="https://www.github.com/h16nning/skola"
            fz="sm"
            style={{ whiteSpace: "nowrap" }}
          >
            GitHub repository
          </Anchor>
          .
        </Alert>
        <Stack gap="xs">
          <Title order={3}>{t("welcome-view.about-project-title")}</Title>
          <Text fz="sm">
            {t("welcome-view.about-project-description")}
            <Anchor href="https://www.github.com/h16nning/skola" fz="sm">
              GitHub repository
            </Anchor>
            .
          </Text>
        </Stack>
        <Stack gap="xs">
          <Title order={3}>{t("welcome-view.about-privacy-title")}</Title>
          <Text fz="sm">{t("welcome-view.about-privacy-description")}</Text>
        </Stack>
        <Group align="start">
          <Button
            onClick={() => setRegistered(true)}
            size="md"
            variant="gradient"
          >
            {t("welcome-view.get-started-now")}
          </Button>
        </Group>
      </Stack>
    </Center>
  );
}
