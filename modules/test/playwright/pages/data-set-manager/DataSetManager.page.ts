/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect} from '@playwright/test';

import {ApplicationsMenuPage} from '../product-navigation-applications-menu/ApplicationsMenuPage';

import type {Locator, Page} from '@playwright/test';

export class DataSetManagerPage {
	page: Page;
	applicationsMenuPage: ApplicationsMenuPage;
	readonly ADD_FIELDS_BUTTON: Locator;
	readonly ADD_FIELDS_MODAL_TITLE: Locator;
	readonly ADD_ITEM_ACTION: Locator;

	constructor(page) {
		this.page = page;
		this.applicationsMenuPage = new ApplicationsMenuPage(page);
		this.ADD_FIELDS_BUTTON = this.page.getByRole('button', {
			name: 'Add Fields',
		});
		this.ADD_FIELDS_MODAL_TITLE = this.page.getByRole('heading', {
			name: 'Add Fields',
		});
		this.ADD_ITEM_ACTION = this.page.getByRole('button', {
			name: 'New Item Action',
		});
	}

	async goto() {
		await this.applicationsMenuPage.goToDataSetManager();
	}

	/**
	 * createDataSet
	 * deleteDataSet
	 * createDataSetView
	 * deleteDataSetView
	 * gotoDataSet
	 * gotoDataSetView
	 * gotoDetailsTab
	 * gotoFieldsTab
	 *  · add new field
	 *  · edit field
	 *  · delete field
	 * gotoFiltersTab
	 * gotoSortingTab
	 * gotoActionsTab
	 *  · gotoItemActionsTab
	 *      · new item action
	 *      · edit item action
	 *      · delete item action
	 *  · gotoCreationActionsTab
	 *      · new creation action
	 * gotoPaginationTab
	 */

	async createTestDataSet({name = 'Data Set Test'}: {name?: string} = {}) {
		await this.goto();

		await this.page
			.getByRole('button', {
				name: 'New Data Set',
			})
			.first()
			.click();

		await expect(
			this.page.getByRole('heading', {name: 'New Data Set'})
		).toBeVisible();

		await this.page.getByLabel('Name').fill(name);
		await this.page.getByLabel('REST Application').click();
		await this.page
			.getByRole('option', {name: '/data-set-manager/fields'})
			.click();

		await expect(this.page.getByLabel('REST Schema')).toBeVisible();

		await this.page.getByRole('button', {name: 'Save'}).click();
	}

	async deleteDataSet({name = 'Data Set test'}: {name?: string} = {}) {
		await this.goto();

		const datasetTestRow = await this.page
			.locator('.data-set-content-wrapper .dnd-tbody .dnd-tr')
			.filter({hasText: name});

		await datasetTestRow
			.first()
			.getByRole('button', {name: 'Actions'})
			.click();

		await this.page.getByRole('menuitem', {name: 'Delete'}).click();

		const deleteModal = await this.page.getByRole('dialog');

		await deleteModal.getByRole('button', {name: 'Delete'}).click();
	}

	async gotoTestDataSet({name = 'Data Set Test'}: {name?: string} = {}) {
		await this.goto();

		await this.page
			.locator('.data-set-content-wrapper .dnd-tbody .dnd-tr')
			.filter({hasText: name})
			.first()
			.getByRole('link')
			.click();
	}

	async createTestDataSetView({
		dataSetName = 'Data Set Test',
	}: {dataSetName?: string} = {}) {
		await this.gotoTestDataSet({name: dataSetName});

		await this.page
			.getByRole('button', {
				name: 'New Data Set View',
			})
			.first()
			.click();

		await expect(
			this.page.getByRole('heading', {name: 'New Data Set View'})
		).toBeVisible();

		await this.page.getByLabel('Name').fill('Data Set View Test');

		await this.page.getByRole('button', {name: 'Save'}).click();
	}

	async gotoTestDataSetView({
		dataSetName = 'Data Set Test',
	}: {dataSetName?: string} = {}) {
		await this.gotoTestDataSet({name: dataSetName});

		await this.page.getByRole('link', {name: 'View Test'}).first().click();
	}

	async gotoDataSetDetailsTab() {
		await this.page.getByRole('button', {name: 'Details'}).click();
	}

	async gotoDataSetFieldsTab() {
		await this.page.getByRole('button', {name: 'Fields'}).click();
	}

	async gotoDataSetActionsTab() {
		await this.page.getByRole('button', {name: 'Actions'}).click();
	}

	async addNewField() {
		await this.ADD_FIELDS_BUTTON.first().click();
	}

	async addItemAction() {
		await this.ADD_ITEM_ACTION.first().click();
	}
}
