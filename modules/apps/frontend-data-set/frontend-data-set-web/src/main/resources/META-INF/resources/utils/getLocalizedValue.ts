/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

interface ILocalizedItemDetails {
	rootPropertyName: string;
	value: string;
	valuePath: Array<string>;
}

function getLanguageKey(data: any, canUseFallbackLanguageId?: boolean): string {

	// Need to move these const here to be able to overwrite them with the tests

	const defaultLanguageId = Liferay.ThemeDisplay.getDefaultLanguageId();
	const BCP47LanguageId = Liferay.ThemeDisplay.getBCP47LanguageId();
	const languageId = Liferay.ThemeDisplay.getLanguageId();

	// Use a flag to know if fallback is needed (Objects case)

	let languageKey = canUseFallbackLanguageId ? 'en_US' : '';

	if (data[languageId]) {
		languageKey = languageId as string;
	}
	else if (data[BCP47LanguageId]) {
		languageKey = BCP47LanguageId;
	}
	else if (data[defaultLanguageId]) {
		languageKey = defaultLanguageId;
	}

	return languageKey;
}

export function getLocalizedValue(
	item: any,
	fieldName: string | Array<string>
): ILocalizedItemDetails | null {
	if (!fieldName) {
		return null;
	}

	const rootPropertyName =
		typeof fieldName === 'string' ? fieldName : fieldName[0];
	let navigatedValue = item;
	const valuePath = [];

	/**
	 * Check Array existence first, otherwise it will always find the object with
	 * i18n keys due to line 72 item[fieldName][getLanguageKey(item[fieldName], true)]
	 *
	 */
	if (Array.isArray(fieldName)) {
		fieldName.forEach((property) => {
			let formattedProperty = property;

			if (property === 'LANG') {
				formattedProperty = getLanguageKey(navigatedValue, false);
			}

			valuePath.push(formattedProperty);

			if (navigatedValue) {
				navigatedValue = navigatedValue[formattedProperty];
			}
		});
	}
	else if (
		typeof fieldName === 'string' &&
		item[fieldName] &&
		item[fieldName][getLanguageKey(item[fieldName], true)]
	) {
		valuePath.push(fieldName);
		navigatedValue =
			navigatedValue[fieldName][getLanguageKey(item[fieldName], true)];
	}
	else {
		valuePath.push(fieldName);
		navigatedValue = navigatedValue[fieldName];
	}

	return {
		rootPropertyName,
		value: navigatedValue,
		valuePath,
	};
}

export function getLocalizedValueV2(
	item: any,
	fieldName: string | Array<string>
): ILocalizedItemDetails | null {
	if (!fieldName) {
		return null;
	}

	const defaultLanguageId = Liferay.ThemeDisplay.getDefaultLanguageId();
	const BCP47LanguageId = Liferay.ThemeDisplay.getBCP47LanguageId();
	const languageId = Liferay.ThemeDisplay.getLanguageId();

	const rootPropertyName =
		typeof fieldName === 'string' ? fieldName : fieldName[0];
	let navigatedValue = item;
	const valuePath = [];

	/**
	 * Check Array existence first, otherwise it will always find the object with
	 * i18n keys due to line 72 item[fieldName][getLanguageKey(item[fieldName], true)]
	 *
	 */
	if (Array.isArray(fieldName)) {
		fieldName.forEach((property) => {
			let formattedProperty = property;

			if (property === 'LANG') {
				if (navigatedValue[languageId]) {
					formattedProperty = languageId;
				}
				else if (navigatedValue[BCP47LanguageId]) {
					formattedProperty = BCP47LanguageId;
				}
				else {
					formattedProperty = defaultLanguageId;
				}
			}

			valuePath.push(formattedProperty);

			if (navigatedValue) {
				navigatedValue = navigatedValue[formattedProperty];
			}
		});
	}
	else if (
		typeof fieldName === 'string' &&
		item[fieldName] &&

		/**
		 * Check if the item[fieldName] object contains any i18n key
		 */
		Object.keys(Liferay.Language.available).includes(
			Object.keys(item[fieldName])[0]
		)
	) {
		let languageKey = 'en_US';

		if (item[fieldName][languageId]) {
			languageKey = languageId as string;
		}
		else if (item[fieldName][defaultLanguageId]) {
			languageKey = defaultLanguageId;
		}

		valuePath.push(fieldName);
		navigatedValue = navigatedValue[fieldName][languageKey];
	}
	else {
		valuePath.push(fieldName);
		navigatedValue = navigatedValue[fieldName];
	}

	return {
		rootPropertyName,
		value: navigatedValue,
		valuePath,
	};
}
