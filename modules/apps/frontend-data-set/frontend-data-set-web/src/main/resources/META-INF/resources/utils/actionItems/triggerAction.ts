/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {navigate} from 'frontend-js-web';

import {IFrontendDataSetContext} from '../../FrontendDataSetContext';
import {CreationActionItem} from '../../management_bar/components/CreationMenu';
import {OPEN_MODAL, OPEN_SIDE_PANEL} from '../eventsDefinitions';
import {resolveModalSize} from '../modals/resolveModalSize';
import {ACTION_ITEM_TARGETS} from './constants';

const {
	BLANK,
	EVENT,
	MODAL,
	MODAL_FULL_SCREEN,
	MODAL_LARGE,
	MODAL_SMALL,
	SIDE_PANEL,
} = ACTION_ITEM_TARGETS;

export function triggerAction(
	item: CreationActionItem,
	context: IFrontendDataSetContext
): void {
	const {href: actionTargetURL, target: actionTarget} = item;
	const {loadData, modalId, sidePanelId} = context;

	switch (actionTarget) {
		case BLANK:
			window.open(actionTargetURL);
			break;
		case MODAL:
		case MODAL_FULL_SCREEN:
		case MODAL_LARGE:
		case MODAL_SMALL:
			Liferay.fire(OPEN_MODAL, {
				id: modalId,
				onClose: loadData,
				size: item.data?.size || resolveModalSize(actionTarget),
				title: item.data?.title,
				url: actionTargetURL,
			});
			break;
		case SIDE_PANEL:
			Liferay.fire(OPEN_SIDE_PANEL, {
				id: sidePanelId,
				onAfterSubmit: loadData,
				url: actionTargetURL,
			});
			break;
		case EVENT:
			Liferay.fire(actionTargetURL);
			break;
		default:
			navigate(actionTargetURL);
			break;
	}
}
