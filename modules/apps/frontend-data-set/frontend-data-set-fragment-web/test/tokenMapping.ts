/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	EMappingMode,
	IAPIURLTokenDescriptor,
	TokenMapping,
	isTokenMapped,
	isTokenMappingCompleted,
} from '../src/main/resources/META-INF/resources/js/tokenMapping';

const mainEndpointAPIURLTokenDescriptor: IAPIURLTokenDescriptor = {
	autoResolvedTokenNames: ['scopeKey'],
	tokenNames: ['scopeKey', 'universityId'],
	unresolvedTokenNames: ['universityId'],
};

const selectionFilterAPIURLTokenDescriptor: IAPIURLTokenDescriptor = {
	autoResolvedTokenNames: [],
	externalReferenceCode: 'filter-erc',
	tokenNames: ['scopeKey'],
	unresolvedTokenNames: ['scopeKey'],
};

describe('isTokenMapped', () => {
	it('treats a token without a mapping as mapped only when it can be resolved automatically', () => {
		expect(
			isTokenMapped(mainEndpointAPIURLTokenDescriptor, {}, 'scopeKey')
		).toBe(true);
		expect(
			isTokenMapped(mainEndpointAPIURLTokenDescriptor, {}, 'universityId')
		).toBe(false);
	});

	it('treats a blank literal value as unmapped', () => {
		expect(
			isTokenMapped(
				mainEndpointAPIURLTokenDescriptor,
				{universityId: '  '},
				'universityId'
			)
		).toBe(false);
		expect(
			isTokenMapped(
				mainEndpointAPIURLTokenDescriptor,
				{universityId: '42'},
				'universityId'
			)
		).toBe(true);
	});

	it('treats a selected entity as mapped once its identifier field has a value', () => {
		const tokenMapping: TokenMapping = {
			className: 'com.liferay.object.model.ObjectEntry',
			classPK: '',
			externalReferenceCode: 'university-erc',
			fieldId: 'externalReferenceCode',
			mappingMode: EMappingMode.CONTENT,
		};

		expect(
			isTokenMapped(
				mainEndpointAPIURLTokenDescriptor,
				{universityId: tokenMapping},
				'universityId'
			)
		).toBe(true);
		expect(
			isTokenMapped(
				mainEndpointAPIURLTokenDescriptor,
				{universityId: {...tokenMapping, fieldId: 'classPK'}},
				'universityId'
			)
		).toBe(false);
	});
});

describe('isTokenMappingCompleted', () => {
	it('computes the status of each URL from its own tokens', () => {
		const tokenMappings = {universityId: '42'};

		expect(
			isTokenMappingCompleted(
				mainEndpointAPIURLTokenDescriptor,
				tokenMappings
			)
		).toBe(true);
		expect(
			isTokenMappingCompleted(
				selectionFilterAPIURLTokenDescriptor,
				tokenMappings
			)
		).toBe(false);
	});

	it('treats a URL without tokens as completed', () => {
		expect(
			isTokenMappingCompleted(
				{
					autoResolvedTokenNames: [],
					tokenNames: [],
					unresolvedTokenNames: [],
				},
				{}
			)
		).toBe(true);
	});
});
