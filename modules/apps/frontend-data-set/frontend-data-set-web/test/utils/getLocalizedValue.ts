/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	getLocalizedValue,
	getLocalizedValueV2,
} from '../../src/main/resources/META-INF/resources/utils/getLocalizedValue';

const item = {
	name: {
		en_US: 'The name',
		fr_FR: 'Le nom',
	},
	title: 'Just a title',
};

function setupLanguage({
	defaultLanguageId,
	languageId,
}: {
	defaultLanguageId: string;
	languageId: string;
}) {
	Liferay.ThemeDisplay.getDefaultLanguageId = () => defaultLanguageId;
	Liferay.ThemeDisplay.getLanguageId = () => languageId;
}

describe('getLocalizedValue', () => {
	beforeEach(() => {
		setupLanguage({defaultLanguageId: 'en_US', languageId: 'en_US'});
	});

	it('extracts the localized value using default "en_US" if it does not match other language id', () => {
		setupLanguage({defaultLanguageId: 'pt_BR', languageId: 'pt_BR'});

		const simpleLocalizedFieldName = 'name';
		const result = getLocalizedValue(item, simpleLocalizedFieldName);

		expect(result!.value).toBe('The name');
	});

	it('extracts localized value from using the user LanguageId if present', () => {
		setupLanguage({defaultLanguageId: 'en_US', languageId: 'fr_FR'});

		const simpleLocalizedFieldName = 'name';
		const result = getLocalizedValue(item, simpleLocalizedFieldName);

		expect(result!.value).toBe('Le nom');
	});

	it('extracts the value from an object property', () => {
		const simpleFieldName = 'title';
		const result = getLocalizedValue(item, simpleFieldName);

		expect(result!.value).toBe('Just a title');
	});

	it('extracts localized value from a localization object when a compose field name is used', () => {
		const complexFieldName = ['name', 'LANG'];
		const result = getLocalizedValue(item, complexFieldName);

		expect(result!.value).toBe('The name');
	});

	it('returns undefined if there is no match for the available languages when a compose field name used', () => {
		setupLanguage({defaultLanguageId: 'pt_BR', languageId: 'pt_BR'});
		const complexFieldName = ['name', 'LANG'];
		const result = getLocalizedValue(item, complexFieldName);

		expect(result!.value).toBeUndefined();
	});
});

describe('getLocalizedValueV2', () => {
	beforeEach(() => {
		setupLanguage({defaultLanguageId: 'en_US', languageId: 'en_US'});
	});

	it('extracts the localized value using default "en_US" if it does not match other language id', () => {
		setupLanguage({defaultLanguageId: 'pt_BR', languageId: 'pt_BR'});

		const simpleLocalizedFieldName = 'name';
		const result = getLocalizedValueV2(item, simpleLocalizedFieldName);

		expect(result!.value).toBe('The name');
	});

	it('extracts localized value from using the user LanguageId if present', () => {
		setupLanguage({defaultLanguageId: 'en_US', languageId: 'fr_FR'});

		const simpleLocalizedFieldName = 'name';
		const result = getLocalizedValueV2(item, simpleLocalizedFieldName);

		expect(result!.value).toBe('Le nom');
	});

	it('extracts the value from an object property', () => {
		const simpleFieldName = 'title';
		const result = getLocalizedValueV2(item, simpleFieldName);

		expect(result!.value).toBe('Just a title');
	});

	it('extracts localized value from a localization object when a compose field name is used', () => {
		const complexFieldName = ['name', 'LANG'];
		const result = getLocalizedValueV2(item, complexFieldName);

		expect(result!.value).toBe('The name');
	});

	it('returns undefined if there is no match for the available languages when a compose field name used', () => {
		setupLanguage({defaultLanguageId: 'pt_BR', languageId: 'pt_BR'});
		const complexFieldName = ['name', 'LANG'];
		const result = getLocalizedValueV2(item, complexFieldName);

		expect(result!.value).toBeUndefined();
	});
});
