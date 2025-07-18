import { expect, test } from '@playwright/test';

// Checkly is a tool used to monitor deployed environments, such as production or preview environments.
// It runs end-to-end tests with the `.check.spec.ts` extension after each deployment to ensure that the environment is up and running.
// With Checkly, you can monitor your production environment and run `*.check.spec.ts` tests regularly at a frequency of your choice.
// If the tests fail, Checkly will notify you via email, Slack, or other channels of your choice.
// On the other hand, E2E tests ending with `*.spec.ts` are only run before deployment.
// You can run them locally or on CI to ensure that the application is ready for deployment.

const targetUrl = process.env.ENVIRONMENT_URL || process.env.PRODUCTION_URL;

if (!targetUrl) {
  throw new Error(
    'Please set the ENVIRONMENT_URL or PRODUCTION_URL environment variable',
  );
}

test.describe('Sanity', () => {
  test.describe('Static pages', () => {
    test('should display the homepage', async ({ page }) => {
      await page.goto(targetUrl);

      await expect(
        page.getByText(
          'Little Haven is a platform for parent communities to connect, share, and thrive.',
        ),
      ).toBeVisible();
    });
  });
});
