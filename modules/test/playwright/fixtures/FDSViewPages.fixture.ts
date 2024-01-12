/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {test as pwTest} from '@playwright/test';

import {FDSViewPage} from '../pages/FDS/FDSView.page';

export const test = pwTest.extend({
	_FDSViewPage: async ({page}, use) => {
		await use(new FDSViewPage(page));
	},
});
