/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {test as FDSViewPagesTest} from '../../fixtures/FDSViewPages.fixture';
import {apiHelpersTest} from '../../fixtures/apiHelpers.fixture';
import {applicationsMenuPageTest} from '../../fixtures/applicationsMenuPages.fixture';

const DATASET_NAME = 'New Data Set Item Actions';

export const test = mergeTests(
	apiHelpersTest,
	applicationsMenuPageTest,
	FDSViewPagesTest
);

test.describe('DataSet Item Actions', () => {
    test('Setup environment', async({
        _apiHelpers,
        _FDSViewPage,
    }) => {
        await test.step('Create Data Set', async() => {
            await _FDSViewPage.createTestDataSet({name: DATASET_NAME});
        });
        
        await test.step('Create Data Set View', async () => {
            await _FDSViewPage.createTestDataSetView({dataSetName: DATASET_NAME});
        });
    });

    test.describe('DataSet Fields Tab', () => {      
        test('Dataset Fields Tab is selected', async ({
            _FDSViewPage,
            page,
        }) => {
            await _FDSViewPage.gotoTestDataSet({name: DATASET_NAME});
            await _FDSViewPage.gotoTestDataSetView({dataSetName: DATASET_NAME});
        
            await test.step('Open Data Set Fields Tab', async() => {
                await _FDSViewPage.gotoDataSetFieldsTab();
        
                await expect(page.getByRole('heading', {name: 'Fields'})).toBeVisible();
                await expect(page.getByText(/No fields added yet./)).toBeVisible();
            });
        });
    
        test('Can select Fields for the Dataset', async ({
            _FDSViewPage,
            page,
        }) => {
            await _FDSViewPage.gotoTestDataSet({name: DATASET_NAME});
            await _FDSViewPage.gotoTestDataSetView({dataSetName: DATASET_NAME});

            await test.step('Open Data Set Fields Tab', async() => {
                await _FDSViewPage.gotoDataSetFieldsTab();
        
                await expect(page.getByRole('heading', {name: 'Fields'})).toBeVisible();
                await expect(page.getByText(/No fields added yet./)).toBeVisible();
            });

            const fieldModal = await test.step('Open Data Set Fields Modal', async() => {
                await _FDSViewPage.addNewField();
        
                await expect(page.getByRole('dialog')).toBeVisible();

                await expect(page.getByRole('heading', {name: 'Add Fields'})).toBeVisible();

                return page.getByRole('dialog');
            });

            await test.step('Select id and name fields', async() => {
                await fieldModal.getByLabel(/id/).check();
                await fieldModal.getByLabel(/name/).check();
                await fieldModal.getByRole('button', {name: 'Save'}).click();

                await expect(page.locator('.orderable-table-row').nth(0)).toContainText('id');
                await expect(page.locator('.orderable-table-row').nth(1)).toContainText('name');
            });
        });
    });

    test.describe('DataSet Actions Tab', () => {
        test('Dataset Actions Tab is selected', async ({
            _FDSViewPage,
            page,
        }) => {
            await _FDSViewPage.gotoTestDataSet({name: DATASET_NAME});
            await _FDSViewPage.gotoTestDataSetView({dataSetName: DATASET_NAME});
        
            await test.step('Open Data Set Actions Tab', async() => {
                await _FDSViewPage.gotoDataSetActionsTab();
        
                await expect(page.getByRole('heading', {name: 'Actions'})).toBeVisible();
            });
        });

        test('Can define an Item Actions of type Link for the Dataset', async ({
            _FDSViewPage,
            page,
        }) => {
            await _FDSViewPage.gotoTestDataSet({name: DATASET_NAME});
            await _FDSViewPage.gotoTestDataSetView({dataSetName: DATASET_NAME});

            await test.step('Open Data Set Actions Tab', async() => {
                await _FDSViewPage.gotoDataSetActionsTab();
        
                await expect(page.getByRole('heading', {name: 'Actions'})).toBeVisible();
            });

            await test.step('Open Data Set Item Action Form', async() => {
                await _FDSViewPage.addItemAction();
        
                await expect(page.getByRole('heading', {name: 'New Item Action'})).toBeVisible();
            });

            await test.step('Fill Item Action Form', async() => {
                await page.getByPlaceholder('Action Name').fill('Link Item Action');

                await page.getByLabel('TypeRequired', {exact: true}).selectOption({label: 'Link'});

                await page.getByLabel('URLRequired', {exact: true}).fill('https://www.liferay.com');

                await page.getByRole('button', {name: 'Save'}).click();
            });

            await test.step('Action is defined',async () => {
                await expect(page.locator('.orderable-table-row').nth(0)).toContainText('Link Item Action');
            });
        }); 
    });

    test('Clean up environment', async ({_FDSViewPage}) => {
        await _FDSViewPage.deleteDataSet({name: 'New Data Set Item Actions'});
    });
});
