import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";

const LINKS = [
  "https://demo.wetravel.to/trips/activity-chicago-booth-colombiatrek2025-vaova-test-08133845",
];

LINKS.forEach((link) => {
  test(`purchase on link ${link}`, async ({ page }) => {
    // login
    /* await page.goto(process.env.LOGIN_URL + "");
    await page.getByRole("link", { name: /sign in/i }).click();
    const loginModal = page.getByRole("dialog");
    const emailInput = loginModal.getByRole("textbox");
    await emailInput.fill(process.env.USERNAME + "");
    await emailInput.blur();
    const passwordInput = loginModal.getByLabel(/password/i);
    await passwordInput.fill(process.env.PASSWORD + "");
    await passwordInput.blur();
    await page.getByText("Log in", { exact: true }).click(); */
    // await page.waitForURL("**/user/my_trips?view=List");

    // purchase
    await page.goto(link);
    await page
      .locator("#scroll-container a")
      .filter({ hasText: "Book Now" })
      .click();
    const frame = page.frameLocator(".wtrvl-ifrm");
    await frame.getByRole("button", { name: /continue/i }).click();
    // await frame.getByRole("button", { name: /sign out/i }).click();

    // fill form
    const email = faker.internet.email();
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const address = faker.location.streetAddress();

    await frame.getByTestId("guest_firstname-input").fill(firstName);
    await frame.getByTestId("guest_lastname-input").fill(lastName);
    await frame.getByTestId("guest_email-input").fill(email);
    await frame.getByTestId("guest_confirm_email-input").fill(email);
    await frame.getByRole("button", { name: /continue/i }).click();
    await frame.locator("div.c-payment-method-item.c-relative").click();

    // fill card information
    const stripeFrameLocator = frame.locator(
      'iframe[name^="__privateStripeFrame"]'
    );
    const stripeFrame = stripeFrameLocator.first().contentFrame();
    await stripeFrame
      .locator("#Field-numberInput")
      .fill(process.env.CARD_NUMBER + "");
    await stripeFrame.locator("#Field-expiryInput").fill("1230");
    await stripeFrame.locator("#Field-cvcInput").fill("123");
    await frame
      .getByPlaceholder(/name on card/i)
      .fill(`${firstName} ${lastName}`);
    await frame.getByPlaceholder("Address Line 1").fill(address);
    await frame.getByPlaceholder("City / Town").fill(faker.location.city());
    await frame.getByPlaceholder(/postcode/i).fill(faker.location.zipCode());
    await new Promise((r) => setTimeout(r, 2000));
  });
});
