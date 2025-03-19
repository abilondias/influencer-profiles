import { expect, test } from "@playwright/test"

const mocks = {
  socialMedias: {
    path: "api/social_medias",
    json: {
      data: [
        { id: 1, slug: "tiktok", title: "Tiktok" },
        { id: 2, slug: "instagram", title: "Instagram" },
      ],
    },
  },
  influencers: {
    path: "api/influencers*",
    json: {
      data: [
        {
          id: 137,
          first_name: "John",
          last_name: "Doe",
          accounts: [
            { social_media_id: 1, name: "ttjohndoe" },
            { social_media_id: 2, name: "johndoe" },
          ],
        },
        {
          id: 256,
          first_name: "Jane",
          last_name: "Johnson",
          accounts: [
            { social_media_id: 1, name: "janej" },
            { social_media_id: 2, name: "janej" },
          ],
        },
      ],
    },
  },
}

test.describe("Influencer List", () => {
  test("should have the name filtering form", async ({ page }) => {
    await page.goto("http://localhost:3000/influencers")
    await page
      .getByRole("link", { name: "Influencer Profiles" })
      .waitFor({ state: "visible" })

    expect(
      await page.getByRole("textbox", { name: "Search by name" }),
    ).toBeVisible()
  })

  test("should require a name to filter", async ({ page }) => {
    await page.goto("http://localhost:3000/influencers")
    await page
      .getByRole("link", { name: "Influencer Profiles" })
      .waitFor({ state: "visible" })

    const initialUrl = page.url()
    const searchButton = await page.getByTestId("search-button")
    const searchField = await page.getByRole("textbox", {
      name: "Search by name",
    })

    await searchField.fill("")
    await searchButton.click()

    expect(page.url()).toBe(initialUrl)

    const name = "john"
    await searchField.fill(name)
    await searchButton.click()

    const newUrl = `${initialUrl}?name=${name}`
    await page.waitForURL(newUrl, { waitUntil: "domcontentloaded" })

    expect(page.url()).toBe(newUrl)
  })

  test("should list the influencers from the API", async ({ page }) => {
    await page.route(`*/**/${mocks.socialMedias.path}`, async (route) => {
      await route.fulfill({ json: mocks.socialMedias.json })
    })

    await page.route(`*/**/${mocks.influencers.path}`, async (route) => {
      await route.fulfill({ json: mocks.influencers.json })
    })

    await page.goto("http://localhost:3000/influencers")
    await page
      .getByRole("link", { name: "Influencer Profiles" })
      .waitFor({ state: "visible" })

    const idCell = await page.getByRole("cell", {
      name: mocks.influencers.json.data[0].id.toString(),
      exact: true,
    })
    await idCell.waitFor({ state: "visible" })
    expect(idCell).toBeVisible()

    const account = await page.getByRole("cell", {
      name: mocks.influencers.json.data[0].accounts[0].name,
      exact: true,
    })
    expect(account).toBeVisible()
  })
})
