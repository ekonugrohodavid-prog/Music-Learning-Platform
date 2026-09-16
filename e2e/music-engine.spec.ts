import { test, expect } from "@playwright/test";

test("music engine metronome lifecycle works in browser", async ({
  page,
}) => {
  await page.goto("/test/music-engine");

  await expect(
    page.getByRole("heading", { name: "Music Engine Test" }),
  ).toBeVisible();

  await expect(
    page.getByTestId("engine-status"),
  ).toHaveText("stopped");

  await expect(
    page.getByTestId("engine-bpm"),
  ).toHaveText("120");

  await page.getByRole("button", { name: "Start" }).click();

  await expect(
    page.getByTestId("engine-status"),
  ).toHaveText("running");

  await expect(
    page.getByTestId("tick-count"),
  ).toHaveText("4");

  await page.getByRole("button", { name: "Stop" }).click();

  await expect(
    page.getByTestId("engine-status"),
  ).toHaveText("stopped");
});
