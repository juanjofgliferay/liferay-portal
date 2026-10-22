/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import '@testing-library/jest-dom';

// eslint-disable-next-line @liferay/portal/no-cross-module-deep-import
import {checkAccessibility} from '@liferay/layout-js-components-web/test/__lib__/index';

import SelectionFilterTokenMappingFields from '../../src/main/resources/META-INF/resources/js/components/SelectionFilterTokenMappingFields';
import {IAPIURLTokenDescriptor} from '../../src/main/resources/META-INF/resources/js/tokenMapping';

const resolvedAPIURLTokenDescriptor: IAPIURLTokenDescriptor = {
	autoResolvedTokenNames: ['siteId'],
	externalReferenceCode: 'resolved-filter-erc',
	tokenNames: ['siteId'],
	unresolvedTokenNames: [],
};

const unresolvedAPIURLTokenDescriptor: IAPIURLTokenDescriptor = {
	autoResolvedTokenNames: [],
	externalReferenceCode: 'unresolved-filter-erc',
	tokenNames: ['taxonomyVocabularyId'],
	unresolvedTokenNames: ['taxonomyVocabularyId'],
};

const labels = {
	'resolved-filter-erc': 'Vocabularies',
	'unresolved-filter-erc': 'Categories',
};

describe('SelectionFilterTokenMappingFields', () => {
	it('shows the status of each filter in the filter dropdown', async () => {
		render(
			<SelectionFilterTokenMappingFields
				apiURLTokenDescriptors={[
					resolvedAPIURLTokenDescriptor,
					unresolvedAPIURLTokenDescriptor,
				]}
				labels={labels}
				onTokenMappingsChange={jest.fn()}
				selectionFilterTokenMappings={{}}
			/>
		);

		await userEvent.click(screen.getByRole('button', {name: 'filter'}));

		expect(
			screen.getByRole('menuitem', {name: /Vocabularies/})
		).toHaveTextContent('completed');
		expect(
			screen.getByRole('menuitem', {name: /Categories/})
		).toHaveTextContent('incomplete');
	});

	it('selects the only filter and saves its mapping under its external reference code', async () => {
		const onTokenMappingsChange = jest.fn();

		render(
			<SelectionFilterTokenMappingFields
				apiURLTokenDescriptors={[unresolvedAPIURLTokenDescriptor]}
				labels={labels}
				onTokenMappingsChange={onTokenMappingsChange}
				selectionFilterTokenMappings={{}}
			/>
		);

		expect(screen.getByRole('button', {name: 'filter'})).toHaveTextContent(
			'Categories'
		);

		await userEvent.type(screen.getByLabelText('token-value'), '42');
		await userEvent.tab();

		expect(onTokenMappingsChange).toHaveBeenCalledWith({
			'unresolved-filter-erc': {taxonomyVocabularyId: '42'},
		});
	});

	it('has no accessibility violations', async () => {
		const {container} = render(
			<SelectionFilterTokenMappingFields
				apiURLTokenDescriptors={[unresolvedAPIURLTokenDescriptor]}
				labels={labels}
				onTokenMappingsChange={jest.fn()}
				selectionFilterTokenMappings={{}}
			/>
		);

		await checkAccessibility({bestPractices: true, context: container});
	});
});
