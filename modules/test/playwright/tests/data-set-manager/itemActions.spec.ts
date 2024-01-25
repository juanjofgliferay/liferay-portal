/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {dataSetManagerPageTest} from '../../fixtures/DataSetManagerPages.fixture';
// import {apiHelpersTest} from '../../fixtures/apiHelpersTest';
import {loginTest} from '../../fixtures/loginTest';
import {applicationsMenuPageTest} from '../../fixtures/applicationsMenuPageTest';

const DATASET_NAME = 'New Data Set Item Actions';

export const test = mergeTests(
	applicationsMenuPageTest,
	dataSetManagerPageTest,
    loginTest
);

test.describe('DataSet Item Actions', () => {
    test('Setup environment', async({
        dataSetManagerPage,
    }) => {
        await test.step('Create Data Set', async() => {
            await dataSetManagerPage.createTestDataSet({name: DATASET_NAME});
        });
        
        await test.step('Create Data Set View', async () => {
            await dataSetManagerPage.createTestDataSetView({dataSetName: DATASET_NAME});
        });
    });

    test.describe('DataSet Fields Tab', () => {      
        test('Dataset Fields Tab is selected', async ({
            dataSetManagerPage,
            page,
        }) => {
            await dataSetManagerPage.gotoTestDataSet({name: DATASET_NAME});
            await dataSetManagerPage.gotoTestDataSetView({dataSetName: DATASET_NAME});
        
            await test.step('Open Data Set Fields Tab', async() => {
                await dataSetManagerPage.gotoDataSetFieldsTab();
        
                await expect(page.getByRole('heading', {name: 'Fields'})).toBeVisible();
                await expect(page.getByText(/No fields added yet./)).toBeVisible();
            });
        });
    
        test('Can select Fields for the Dataset', async ({
            dataSetManagerPage,
            page,
        }) => {
            await dataSetManagerPage.gotoTestDataSet({name: DATASET_NAME});
            await dataSetManagerPage.gotoTestDataSetView({dataSetName: DATASET_NAME});

            await test.step('Open Data Set Fields Tab', async() => {
                await dataSetManagerPage.gotoDataSetFieldsTab();
        
                await expect(page.getByRole('heading', {name: 'Fields'})).toBeVisible();
                await expect(page.getByText(/No fields added yet./)).toBeVisible();
            });

            const fieldModal = await test.step('Open Data Set Fields Modal', async() => {
                await dataSetManagerPage.addNewField();
        
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
            dataSetManagerPage,
            page,
        }) => {
            await dataSetManagerPage.gotoTestDataSet({name: DATASET_NAME});
            await dataSetManagerPage.gotoTestDataSetView({dataSetName: DATASET_NAME});
        
            await test.step('Open Data Set Actions Tab', async() => {
                await dataSetManagerPage.gotoDataSetActionsTab();
        
                await expect(page.getByRole('heading', {name: 'Actions'})).toBeVisible();
            });
        });

        test('Can define an Item Actions of type Link for the Dataset', async ({
            dataSetManagerPage,
            page,
        }) => {
            await dataSetManagerPage.gotoTestDataSet({name: DATASET_NAME});
            await dataSetManagerPage.gotoTestDataSetView({dataSetName: DATASET_NAME});

            await test.step('Open Data Set Actions Tab', async() => {
                await dataSetManagerPage.gotoDataSetActionsTab();
        
                await expect(page.getByRole('heading', {name: 'Actions'})).toBeVisible();
            });

            await test.step('Open Data Set Item Action Form', async() => {
                await dataSetManagerPage.addItemAction();
        
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

    test.describe('Dataset in the home page', () => {
        test('Add DataSet fragment', async({applicationsMenuPage, page}) => {
            await test.step('Go Home', async () => {
                await applicationsMenuPage.goto();
            });

            await test.step('Click on "Edit" button', async () => {
                const editPageButton = await page.getByRole('link', {name: 'Edit'});
                await editPageButton.click();
            });

            await test.step('Search for "Data Set" fragment', async () => {
                const fragmentSearchInput = await page.getByLabel('Search Fragments and Widgets');
                fragmentSearchInput.fill('Data Set');
            });

            await test.step('Drag "Data Set" fragment & Drop into the page editor', async () => {
                // TODO: not working. Need to manually drop fragment manually
                await page
                    .getByRole('menuitem', {name: 'Data Set'})
                    .dragTo(page.locator('.page-editor__root'));
            });

            await test.step('Select empty Data Set fragment', async () => {
                await page
                    .getByText('Select a data set view. Beta')
                    .first()
                    .click();
            });

            await test.step('Open Data Set View Selector', async () => {
                await page.getByRole('button', {name: 'Select Data Set View'}).click();
                await page.getByRole('menuitem', {name: 'Select Data Set View...'}).click();
            });

            // await test.step('Select Data Set View', async () => {
            //     await expect(page.getByRole('heading', {name: 'Select'})).toBeVisible();

            //     await page.locator('.selectable').filter({hasText: 'Data Set View Test'}).click();

            //     await page.getByRole('button', {name: 'Save'}).click();
            // });

            // Click "Select Data Set View" button
            //      - opens dropdown and select "Select Data Set View..."
            // Opens a modal and select the Data Set View
            //      - select radio button (w/ Data Set View name)
            //      - click save
            // Check that Table is present in the document
            // Look for the first item row / last column(.dnd-td .item-actions)
            // One button (unique action)
            // Three dots (multiple actions)

        });
    });

    test('Clean up environment', async ({dataSetManagerPage}) => {
        await dataSetManagerPage.deleteDataSet({name: 'New Data Set Item Actions'});
    });
});
