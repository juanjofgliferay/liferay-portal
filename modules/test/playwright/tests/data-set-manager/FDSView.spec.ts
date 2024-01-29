/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {dataSetManagerPageTest} from '../../fixtures/DataSetManagerPages.fixture';
import {applicationsMenuPageTest} from '../../fixtures/applicationsMenuPageTest';
import {loginTest} from '../../fixtures/loginTest';

export const test = mergeTests(
	applicationsMenuPageTest,
	dataSetManagerPageTest,
	loginTest
);

test('CreationActionsAdminPageIsDisplayed', async ({
	dataSetManagerPage,
	page,
}) => {
	await test.step('Create Data Set', async () => {
		await dataSetManagerPage.createTestDataSet();
	});

	await test.step('Create Data Set View', async () => {
		await dataSetManagerPage.createTestDataSetView();
	});

	await test.step('Open Data Set Actions Tab', async () => {
		await dataSetManagerPage.gotoTestDataSetView();

		await expect(
			page.getByRole('heading', {name: 'Details'})
		).toBeVisible();

		await page.getByRole('button', {name: 'Actions'}).click();

		await expect(
			page.getByRole('heading', {name: 'Actions'})
		).toBeVisible();
	});

	await dataSetManagerPage.deleteDataSet();
});
