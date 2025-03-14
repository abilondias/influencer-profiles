import { test, expect } from "@playwright/test"

test("page has title", async ({ page }) => {
  await page.goto("http://localhost:3000/")

  await expect(page.getByRole("heading")).toHaveText("Influencer Profiles")
})
