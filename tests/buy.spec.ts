import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";

const LINKS = [];

LINKS.forEach((link) => {
  test(`purchase on link ${link}`, async ({ page }) => {
    await page.goto(process.env.LOGIN_URL + "");
    // login
    await page.getByRole("link", { name: /sign in/i }).click();
    const loginModal = page.getByRole("dialog");
    const emailInput = loginModal.getByRole("textbox");
    await emailInput.fill(process.env.USERNAME + "");
    await emailInput.blur();
    const passwordInput = loginModal.getByLabel(/password/i);
    await passwordInput.fill(process.env.PASSWORD + "");
    await passwordInput.blur();
    await page.getByText("Log in", { exact: true }).click();
    await page.waitForURL("**/user/my_trips?view=List");

    // purchase
    await page.goto(link);
    await page
      .locator("#scroll-container a")
      .filter({ hasText: "Book Now" })
      .click();
    const frame = page.frameLocator(".wtrvl-ifrm");
    await frame.getByRole("button", { name: /continue/i }).click();
    await frame.getByRole("button", { name: /sign out/i }).click();

    // fill form
    await frame
      .getByTestId("guest_firstname-input")
      .fill(faker.person.firstName());
    await frame
      .getByTestId("guest_lastname-input")
      .fill(faker.person.lastName());
    const email = faker.internet.email();
    await frame.getByTestId("guest_email-input").fill(email);
    await frame.getByTestId("guest_confirm_email-input").fill(email);
  });
});
