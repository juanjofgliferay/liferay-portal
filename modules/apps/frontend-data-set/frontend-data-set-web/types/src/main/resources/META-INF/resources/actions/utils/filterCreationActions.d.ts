/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {CreationActionItem} from '../../management_bar/components/CreationMenu';
declare const filterCreationActions: (
	actions: Array<CreationActionItem>,
	itemData: any
) => Array<CreationActionItem>;
export default filterCreationActions;
