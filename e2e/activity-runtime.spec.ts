import { test, expect } from "@playwright/test";

test("ACT-003 activity runtime lifecycle works in browser", async ({
  page,
}) => {
  await page.goto("/test/activity-runtime");

  await expect(
    page.getByRole("heading", {
      name: "Activity Runtime Test",
    }),
  ).toBeVisible();

  await expect(
    page.getByTestId("activity-status"),
  ).toHaveText("ready");

  await expect(
    page.getByTestId("tap-count"),
  ).toHaveText("0");

  await expect(
    page.getByTestId("response-status"),
  ).toHaveText("empty");

  await page.getByRole("button", {
    name: "Start Activity",
  }).click();

  await expect(
    page.getByTestId("activity-status"),
  ).toHaveText("running");

  await page.getByRole("button", {
    name: "Tap the Pulse",
  }).click();

  await page.getByRole("button", {
    name: "Tap the Pulse",
  }).click();

  await expect(
    page.getByTestId("tap-count"),
  ).toHaveText("2");

  await page.getByRole("button", {
    name: "Stop Activity",
  }).click();

  await expect(
    page.getByTestId("activity-status"),
  ).toHaveText("captured");

  await expect(
    page.getByTestId("tap-count"),
  ).toHaveText("2");

  await expect(
    page.getByTestId("response-status"),
  ).toHaveText("ready");
});
