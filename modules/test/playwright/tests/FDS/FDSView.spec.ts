/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {test as FDSViewPagesTest} from '../../fixtures/FDSViewPages.fixture';
import {applicationsMenuPageTest} from '../../fixtures/applicationsMenuPages.fixture';

export const test = mergeTests(
	applicationsMenuPageTest,
	FDSViewPagesTest
);

test('CreationActionsAdminPageIsDisplayed', async ({
	_FDSViewPage,
	page,
}) => {
	await test.step('Create Data Set', async() => {
		await _FDSViewPage.createTestDataSet();
	});
	
	await test.step('Create Data Set View', async () => {
		await _FDSViewPage.createTestDataSetView();
	});
	
	await test.step('Open Data Set Actions Tab', async() => {
		await _FDSViewPage.gotoTestDataSetView();

		await expect(page.getByRole('heading', {name: 'Details'})).toBeVisible();

		await page.getByRole('button', {name: 'Actions'}).click();

		await expect(page.getByRole('heading', {name: 'Actions'})).toBeVisible();
	});

	await _FDSViewPage.deleteDataSet();
});
