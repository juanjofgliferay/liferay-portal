/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayDropDown from '@clayui/drop-down';
import ClayForm, {ClaySelectWithOption} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import {useId} from 'frontend-js-components-web';
import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {
	EMappingMode,
	IAPIURLTokenDescriptor,
	IdentifierField,
	TokenMapping,
	getMappingMode,
	isAutoResolved,
	isContentMapped,
	isMappedTokenValue,
	isTokenMapped as isTokenMappedInDescriptor,
} from '../tokenMapping';
import EntitySelectorRow from './EntitySelectorRow';
import LiteralInput from './LiteralInput';

function isOnDisplayPageTemplate(): boolean {
	return !!document.getElementById('infoItemSelectorContainer');
}

interface IProps {
	apiURLTokenDescriptor: IAPIURLTokenDescriptor;
	onTokenMappingsChange: (
		tokenMappings: Record<string, TokenMapping>
	) => void;
	tokenMappings: Record<string, TokenMapping>;
}

export default function TokenMappingFields({
	apiURLTokenDescriptor,
	onTokenMappingsChange,
	tokenMappings,
}: IProps) {
	const tokenSelectId = useId();
	const mappingSelectId = useId();
	const fieldInputId = useId();

	const tokenKeys = apiURLTokenDescriptor.tokenNames;

	const [selectedTokenKey, setSelectedTokenKey] = useState('');

	useEffect(() => {
		if (tokenKeys.length === 1) {
			if (selectedTokenKey !== tokenKeys[0]) {
				setSelectedTokenKey(tokenKeys[0]);
			}
		}
		else if (selectedTokenKey && !tokenKeys.includes(selectedTokenKey)) {
			setSelectedTokenKey('');
		}
	}, [tokenKeys, selectedTokenKey]);

	const isCurrentTokenAutoResolved =
		apiURLTokenDescriptor.autoResolvedTokenNames.includes(selectedTokenKey);

	const isTokenMapped = useCallback(
		(tokenKey: string): boolean =>
			isTokenMappedInDescriptor(
				apiURLTokenDescriptor,
				tokenMappings,
				tokenKey
			),
		[apiURLTokenDescriptor, tokenMappings]
	);

	const [isTokenDropdownActive, setIsTokenDropdownActive] = useState(false);

	const currentTokenMapping: TokenMapping = useMemo(
		() =>
			tokenMappings[selectedTokenKey] ??
			(isCurrentTokenAutoResolved
				? {mappingMode: EMappingMode.AUTO_RESOLVED}
				: ''),
		[tokenMappings, isCurrentTokenAutoResolved, selectedTokenKey]
	);

	const currentMappingMode = getMappingMode(currentTokenMapping);

	const displayPageTemplate = isOnDisplayPageTemplate();

	const mappingOptions = [
		{
			label: Liferay.Language.get('input-token-value'),
			value: EMappingMode.LITERAL,
		},
		{
			label: Liferay.Language.get('map-to-selected-entity'),
			value: EMappingMode.CONTENT,
		},
		...(displayPageTemplate
			? [
					{
						label: Liferay.Language.get(
							'map-to-page-context-entity'
						),
						value: EMappingMode.CONTEXT,
					},
				]
			: []),
		...(isCurrentTokenAutoResolved
			? [
					{
						label: Liferay.Language.get('resolve-automatically'),
						value: EMappingMode.AUTO_RESOLVED,
					},
				]
			: []),
	];

	const updateTokenMapping = useCallback(
		(tokenKey: string, tokenMapping: TokenMapping) => {
			onTokenMappingsChange({
				...tokenMappings,
				[tokenKey]: tokenMapping,
			});
		},
		[onTokenMappingsChange, tokenMappings]
	);

	const changeMappingMode = useCallback(
		(mappingMode: EMappingMode) => {
			if (mappingMode === currentMappingMode) {
				return;
			}

			if (mappingMode === EMappingMode.LITERAL) {
				updateTokenMapping(selectedTokenKey, '');

				return;
			}

			if (mappingMode === EMappingMode.AUTO_RESOLVED) {
				updateTokenMapping(selectedTokenKey, {
					mappingMode: EMappingMode.AUTO_RESOLVED,
				});

				return;
			}

			const existingFieldId =
				isMappedTokenValue(currentTokenMapping) &&
				!isAutoResolved(currentTokenMapping)
					? currentTokenMapping.fieldId
					: '';

			if (mappingMode === EMappingMode.CONTEXT) {
				updateTokenMapping(selectedTokenKey, {
					fieldId: existingFieldId,
					mappingMode: EMappingMode.CONTEXT,
				});

				return;
			}

			updateTokenMapping(selectedTokenKey, {
				className: '',
				classPK: '',
				externalReferenceCode: '',
				fieldId: '',
				mappingMode: EMappingMode.CONTENT,
			});
		},
		[
			currentTokenMapping,
			currentMappingMode,
			selectedTokenKey,
			updateTokenMapping,
		]
	);

	return (
		<>
			<ClayForm.Group>
				<label htmlFor={tokenSelectId}>
					{Liferay.Language.get('token')}
				</label>

				<ClayDropDown
					active={isTokenDropdownActive}
					onActiveChange={setIsTokenDropdownActive}
					trigger={
						<ClayButton
							className="align-items-center btn-sm d-flex justify-content-between w-100"
							displayType="secondary"
							id={tokenSelectId}
						>
							{selectedTokenKey ? (
								<>
									<span className="data-set-token-name text-truncate">{`{${selectedTokenKey}}`}</span>

									<span className="align-items-center d-flex data-set-token-status">
										<ClayLabel
											className="text-uppercase"
											displayType={
												isTokenMapped(selectedTokenKey)
													? 'success'
													: 'info'
											}
										>
											{isTokenMapped(selectedTokenKey)
												? Liferay.Language.get('mapped')
												: Liferay.Language.get(
														'unmapped'
													)}
										</ClayLabel>

										<ClayIcon
											className="ml-2"
											symbol="caret-bottom"
										/>
									</span>
								</>
							) : (
								<>
									<span>
										{Liferay.Language.get(
											'select-an-option'
										)}
									</span>

									<ClayIcon symbol="caret-bottom" />
								</>
							)}
						</ClayButton>
					}
				>
					<ClayDropDown.ItemList>
						{tokenKeys.map((key) => {
							const mapped = isTokenMapped(key);

							return (
								<ClayDropDown.Item
									active={key === selectedTokenKey}
									className="p-2"
									key={key}
									onClick={() => {
										setSelectedTokenKey(key);
										setIsTokenDropdownActive(false);
									}}
								>
									<span className="align-items-center d-flex justify-content-between">
										<span className="data-set-token-name text-truncate">{`{${key}}`}</span>

										<ClayLabel
											className="data-set-token-status ml-2 mt-0 text-uppercase"
											displayType={
												mapped ? 'success' : 'info'
											}
										>
											{mapped
												? Liferay.Language.get('mapped')
												: Liferay.Language.get(
														'unmapped'
													)}
										</ClayLabel>
									</span>
								</ClayDropDown.Item>
							);
						})}
					</ClayDropDown.ItemList>
				</ClayDropDown>
			</ClayForm.Group>

			{selectedTokenKey && (
				<>
					<ClayForm.Group>
						<label htmlFor={mappingSelectId}>
							{Liferay.Language.get('mapping[content]')}
						</label>

						<ClaySelectWithOption
							id={mappingSelectId}
							onChange={(event) =>
								changeMappingMode(
									event.target.value as EMappingMode
								)
							}
							options={mappingOptions}
							sizing="sm"
							value={currentMappingMode}
						/>
					</ClayForm.Group>

					{isContentMapped(currentTokenMapping) && (
						<EntitySelectorRow
							entity={currentTokenMapping}
							onEntityChange={(entity) =>
								updateTokenMapping(selectedTokenKey, entity)
							}
							onEntityRemove={() =>
								updateTokenMapping(selectedTokenKey, {
									className: '',
									classPK: '',
									externalReferenceCode: '',
									fieldId: '',
									mappingMode: EMappingMode.CONTENT,
								})
							}
						/>
					)}

					{currentMappingMode !== EMappingMode.AUTO_RESOLVED && (
						<ClayForm.Group>
							<label htmlFor={fieldInputId}>
								{currentMappingMode === EMappingMode.LITERAL
									? Liferay.Language.get('token-value')
									: Liferay.Language.get('field')}
							</label>

							{currentMappingMode === EMappingMode.LITERAL ? (
								<LiteralInput
									inputId={fieldInputId}
									onCommit={(value) =>
										updateTokenMapping(
											selectedTokenKey,
											value
										)
									}
									value={
										typeof currentTokenMapping === 'string'
											? currentTokenMapping
											: ''
									}
								/>
							) : (
								<ClaySelectWithOption
									disabled={
										isContentMapped(currentTokenMapping) &&
										!currentTokenMapping.className
									}
									id={fieldInputId}
									onChange={(event) => {
										if (
											!isMappedTokenValue(
												currentTokenMapping
											) ||
											isAutoResolved(currentTokenMapping)
										) {
											return;
										}

										updateTokenMapping(selectedTokenKey, {
											...currentTokenMapping,
											fieldId: event.target.value as
												| IdentifierField
												| '',
										});
									}}
									options={[
										{
											label: `-- ${Liferay.Language.get(
												'unmapped'
											)} --`,
											value: '',
										},
										{
											label: Liferay.Language.get('id'),
											value: 'classPK',
										},
										{
											label: Liferay.Language.get(
												'external-reference-code'
											),
											value: 'externalReferenceCode',
										},
									]}
									sizing="sm"
									value={
										isMappedTokenValue(
											currentTokenMapping
										) &&
										!isAutoResolved(currentTokenMapping) &&
										!(
											isContentMapped(
												currentTokenMapping
											) && !currentTokenMapping.className
										)
											? currentTokenMapping.fieldId
											: ''
									}
								/>
							)}
						</ClayForm.Group>
					)}
				</>
			)}
		</>
	);
}
