/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {apiHelpersTest} from '../../fixtures/apiHelpersTest';
import {featureFlagsTest} from '../../fixtures/featureFlagsTest';
import {isolatedSiteTest} from '../../fixtures/isolatedSiteTest';
import {loginTest} from '../../fixtures/loginTest';
import {liferayConfig} from '../../liferay.config';
import getRandomString from '../../utils/getRandomString';
import {actionsPageTest} from './fixtures/actionsPageTest';
import {dataSetManagerApiHelpersTest} from './fixtures/dataSetManagerApiHelpersTest';
import {fdsFragmentPageTest} from './fixtures/fdsFragmentPageTest';
import {DEFAULT_LABEL} from './utils/constants';

const LINK_CREATION_ACTION_NAME = 'Link creation action';
const MODAL_CREATION_ACTION_NAME = 'Modal creation action';
const MODAL_CREATION_ACTION_TITLE = 'Modal creation title';
const SIDE_PANEL_CREATION_ACTION_NAME = 'Side Panel creation action';
const SIDE_PANEL_CREATION_ACTION_TITLE = 'Side Panel creation title';

export const test = mergeTests(
	actionsPageTest,
	dataSetManagerApiHelpersTest,
	fdsFragmentPageTest,
	featureFlagsTest({
		'LPS-164563': true,
		'LPS-178052': true,
		'LPS-186871': true,
	}),
	loginTest()
);

let settingsDataSetERC: string;
let settingsDataSetViewERC: string;

test.beforeEach(async ({dataSetManagerApiHelpers}) => {
	settingsDataSetERC = getRandomString();
	settingsDataSetViewERC = getRandomString();

	await dataSetManagerApiHelpers.createDataSet({erc: settingsDataSetERC});
	await dataSetManagerApiHelpers.createDataSetView({
		erc: settingsDataSetViewERC,
		r_fdsEntryFDSViewRelationship_c_fdsEntryERC: settingsDataSetERC,
	});
});

test.afterEach(async ({dataSetManagerApiHelpers}) => {
	await dataSetManagerApiHelpers.deleteDataSet({erc: settingsDataSetERC});
});

test.describe('Creation Actions in the Data Set Manager', () => {
	test('There is a message if no Creation Action has been created', async ({
		actionsPage,
	}) => {
		await test.step('Navigate to the Actions tab', async () => {
			await actionsPage.goto({
				dataSetLabel: DEFAULT_LABEL.DATA_SET,
				viewLabel: DEFAULT_LABEL.VIEW,
			});

			await expect(actionsPage.creationActionsTab).toBeInViewport();
		});

		await test.step('Navigate to the Creation Actions tab', async () => {
			await actionsPage.creationActionsTab.click();
			await actionsPage.newCreationActionButton.waitFor();
		});

		await test.step('Assert no Creation Actions are created', async () => {
			await expect(actionsPage.noActionsWereCreatedMessage).toContainText(
				'No actions were created.'
			);
		});
	});

	test('Can create a Creation Action of type Link', async ({
		actionsPage,
		page,
	}) => {
		await test.step('Navigate to the Actions tab', async () => {
			await actionsPage.goto({
				dataSetLabel: DEFAULT_LABEL.DATA_SET,
				viewLabel: DEFAULT_LABEL.VIEW,
			});

			await expect(actionsPage.creationActionsTab).toBeInViewport();
		});

		await test.step('Navigate to the Creation Actions tab', async () => {
			await actionsPage.creationActionsTab.click();
			await actionsPage.newCreationActionButton.waitFor();
		});

		await test.step('Create a creation action', async () => {
			await actionsPage.createCreationAction({
				icon: 'arrow-right-full',
				name: LINK_CREATION_ACTION_NAME,
				type: 'link',
				url: liferayConfig.environment.baseUrl,
			});
		});

		await test.step('Check that the creation action is in the list', async () => {
			await expect(actionsPage.creationActionsTab).toBeInViewport();

			await expect(
				page.getByRole('cell', {
					exact: true,
					name: LINK_CREATION_ACTION_NAME,
				})
			).toBeVisible();
		});
	});

	test('Can create a Creation Action of type Modal', async ({
		actionsPage,
		page,
	}) => {
		await test.step('Navigate to the Actions tab', async () => {
			await actionsPage.goto({
				dataSetLabel: DEFAULT_LABEL.DATA_SET,
				viewLabel: DEFAULT_LABEL.VIEW,
			});

			await expect(actionsPage.creationActionsTab).toBeInViewport();
		});

		await test.step('Navigate to the Creation Actions tab', async () => {
			await actionsPage.creationActionsTab.click();
			await actionsPage.newCreationActionButton.waitFor();
		});

		await test.step('Create a creation action', async () => {
			await actionsPage.createCreationAction({
				icon: 'arrow-right-full',
				name: MODAL_CREATION_ACTION_NAME,
				title: MODAL_CREATION_ACTION_TITLE,
				type: 'modal',
				url: liferayConfig.environment.baseUrl,
				variant: 'sm',
			});
		});

		await test.step('Check that the creation action is in the list', async () => {
			await expect(actionsPage.creationActionsTab).toBeInViewport();

			await expect(
				page.getByRole('cell', {
					exact: true,
					name: MODAL_CREATION_ACTION_NAME,
				})
			).toBeVisible();
		});
	});

	test('Can create a Creation Action of type Side Panel', async ({
		actionsPage,
		page,
	}) => {
		await test.step('Navigate to the Actions tab', async () => {
			await actionsPage.goto({
				dataSetLabel: DEFAULT_LABEL.DATA_SET,
				viewLabel: DEFAULT_LABEL.VIEW,
			});

			await expect(actionsPage.creationActionsTab).toBeInViewport();
		});

		await test.step('Navigate to the Creation Actions tab', async () => {
			await actionsPage.creationActionsTab.click();
			await actionsPage.newCreationActionButton.waitFor();
		});

		await test.step('Create a creation action', async () => {
			await actionsPage.createCreationAction({
				icon: 'arrow-right-full',
				name: SIDE_PANEL_CREATION_ACTION_NAME,
				title: SIDE_PANEL_CREATION_ACTION_TITLE,
				type: 'sidePanel',
				url: liferayConfig.environment.baseUrl,
			});
		});

		await test.step('Check that the creation action is in the list', async () => {
			await expect(actionsPage.creationActionsTab).toBeInViewport();

			await expect(
				page.getByRole('cell', {
					exact: true,
					name: SIDE_PANEL_CREATION_ACTION_NAME,
				})
			).toBeVisible();
		});
	});
});

export const fragmentTest = mergeTests(
	apiHelpersTest,
	dataSetManagerApiHelpersTest,
	featureFlagsTest({
		'LPS-164563': true,
		'LPS-178052': true,
	}),
	fdsFragmentPageTest,
	isolatedSiteTest
);

fragmentTest.describe('Creation Actions in the fragment', () => {
	fragmentTest(
		'Creation Action button does not appear if no creation action is defined',
		async ({apiHelpers, fdsFragmentPage, site}) => {
			const layout = await fragmentTest.step(
				'Create a new page',
				async () => {
					const pageLayout =
						await apiHelpers.headlessDelivery.createSitePage(
							site.id,
							getRandomString()
						);

					return pageLayout;
				}
			);

			await fragmentTest.step(
				'Configure Data Set in the page',
				async () => {
					await fdsFragmentPage.configureDataSetFragment({
						layout,
						site,
					});
				}
			);

			await fragmentTest.step(
				'Check that the Creation Action button is not present',
				async () => {
					await expect(
						fdsFragmentPage.creationMenuButton
					).not.toBeVisible();
				}
			);
		}
	);

	fragmentTest(
		'Show a simple button if only one Creation Action is defined',
		async ({
			apiHelpers,
			dataSetManagerApiHelpers,
			fdsFragmentPage,
			site,
		}) => {
			const actionLabel = 'Custom Creation Action';

			fragmentTest.step('Create Creation Action', async () => {
				dataSetManagerApiHelpers.createDataSetViewCreationAction({
					label_i18n: {en_US: actionLabel},
					r_fdsViewFDSCreationActionRelationship_c_fdsViewERC:
						settingsDataSetViewERC,
				});
			});

			const layout = await fragmentTest.step(
				'Create a new page',
				async () => {
					const pageLayout =
						await apiHelpers.headlessDelivery.createSitePage(
							site.id,
							getRandomString()
						);

					return pageLayout;
				}
			);

			await fragmentTest.step(
				'Configure Data Set in the page',
				async () => {
					await fdsFragmentPage.configureDataSetFragment({
						layout,
						site,
					});
				}
			);

			await fragmentTest.step(
				'Check that the Creation Action button is present',
				async () => {
					await expect(
						fdsFragmentPage.page.getByRole('button', {
							name: actionLabel,
						})
					).toBeVisible();
				}
			);
		}
	);

	fragmentTest(
		'Show the Creation Actions menu if more than one Creation Action is defined',
		async ({
			apiHelpers,
			dataSetManagerApiHelpers,
			fdsFragmentPage,
			site,
		}) => {
			const firstActionLabel = 'Custom Creation Action';
			const secondActionLabel = 'Another Creation Action';

			fragmentTest.step('Create Creation Actions', async () => {
				dataSetManagerApiHelpers.createDataSetViewCreationAction({
					label_i18n: {en_US: firstActionLabel},
					r_fdsViewFDSCreationActionRelationship_c_fdsViewERC:
						settingsDataSetViewERC,
				});

				dataSetManagerApiHelpers.createDataSetViewCreationAction({
					label_i18n: {en_US: secondActionLabel},
					r_fdsViewFDSCreationActionRelationship_c_fdsViewERC:
						settingsDataSetViewERC,
				});
			});

			const layout = await fragmentTest.step(
				'Create a new page',
				async () => {
					const pageLayout =
						await apiHelpers.headlessDelivery.createSitePage(
							site.id,
							getRandomString()
						);

					return pageLayout;
				}
			);

			await fragmentTest.step(
				'Configure Data Set in the page',
				async () => {
					await fdsFragmentPage.configureDataSetFragment({
						layout,
						site,
					});
				}
			);

			await fragmentTest.step(
				'Check that the Creation Action menu is present',
				async () => {
					await fdsFragmentPage.creationMenuButton.isVisible();

					const button = await fdsFragmentPage.creationMenuButton;

					const dropdownId = await button.evaluate((node) =>
						node.getAttribute('aria-controls')
					);

					await button.click();

					await fdsFragmentPage.page
						.locator(`#${dropdownId}`)
						.filter({has: fdsFragmentPage.page.getByRole('menu')})
						.waitFor();

					await expect(
						fdsFragmentPage.page
							.locator(`#${dropdownId}`)
							.getByRole('menuitem')
					).toHaveCount(2);

					// await expect(fdsFragmentPage.page.getByRole('button', {name: actionLabel})).toBeVisible();

				}
			);
		}
	);
});
