/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {test as pwTest} from '@playwright/test';

import {DataSetManagerPage} from '../pages/data-set-manager/DataSetManager.page';

export const dataSetManagerPageTest = pwTest.extend({
	dataSetManagerPage: async ({page}, use) => {
		await use(new DataSetManagerPage(page));
	},
});
