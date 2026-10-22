/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayDropDown from '@clayui/drop-down';
import ClayForm from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import {useId} from 'frontend-js-components-web';
import React, {useEffect, useState} from 'react';

import {
	IAPIURLTokenDescriptor,
	TokenMapping,
	isTokenMappingCompleted,
} from '../tokenMapping';
import TokenMappingFields from './TokenMappingFields';

function StatusLabel({completed}: {completed: boolean}) {
	return (
		<ClayLabel
			className="data-set-token-status ml-2 mt-0 text-uppercase"
			displayType={completed ? 'success' : 'warning'}
		>
			{completed
				? Liferay.Language.get('completed')
				: Liferay.Language.get('incomplete')}
		</ClayLabel>
	);
}

interface IProps {
	apiURLTokenDescriptors: IAPIURLTokenDescriptor[];
	labels: Record<string, string>;
	onTokenMappingsChange: (
		selectionFilterTokenMappings: Record<
			string,
			Record<string, TokenMapping>
		>
	) => void;
	selectionFilterTokenMappings: Record<string, Record<string, TokenMapping>>;
}

export default function SelectionFilterTokenMappingFields({
	apiURLTokenDescriptors,
	labels,
	onTokenMappingsChange,
	selectionFilterTokenMappings,
}: IProps) {
	const filterSelectId = useId();

	const [isFilterDropdownActive, setIsFilterDropdownActive] = useState(false);
	const [selectedExternalReferenceCode, setSelectedExternalReferenceCode] =
		useState('');

	useEffect(() => {
		const externalReferenceCodes = apiURLTokenDescriptors.map(
			(apiURLTokenDescriptor) =>
				apiURLTokenDescriptor.externalReferenceCode
		);

		if (externalReferenceCodes.length === 1) {
			if (selectedExternalReferenceCode !== externalReferenceCodes[0]) {
				setSelectedExternalReferenceCode(
					externalReferenceCodes[0] as string
				);
			}
		}
		else if (
			selectedExternalReferenceCode &&
			!externalReferenceCodes.includes(selectedExternalReferenceCode)
		) {
			setSelectedExternalReferenceCode('');
		}
	}, [apiURLTokenDescriptors, selectedExternalReferenceCode]);

	const getLabel = (externalReferenceCode: string) =>
		labels[externalReferenceCode] || externalReferenceCode;

	const isCompleted = (apiURLTokenDescriptor: IAPIURLTokenDescriptor) =>
		isTokenMappingCompleted(
			apiURLTokenDescriptor,
			selectionFilterTokenMappings[
				apiURLTokenDescriptor.externalReferenceCode as string
			] ?? {}
		);

	const selectedAPIURLTokenDescriptor = apiURLTokenDescriptors.find(
		(apiURLTokenDescriptor) =>
			apiURLTokenDescriptor.externalReferenceCode ===
			selectedExternalReferenceCode
	);

	return (
		<>
			<ClayForm.Group>
				<label htmlFor={filterSelectId}>
					{Liferay.Language.get('filter')}
				</label>

				<ClayDropDown
					active={isFilterDropdownActive}
					onActiveChange={setIsFilterDropdownActive}
					trigger={
						<ClayButton
							className="align-items-center btn-sm d-flex justify-content-between w-100"
							displayType="secondary"
							id={filterSelectId}
						>
							{selectedAPIURLTokenDescriptor ? (
								<>
									<span className="data-set-token-name text-truncate">
										{getLabel(
											selectedExternalReferenceCode
										)}
									</span>

									<span className="align-items-center d-flex data-set-token-status">
										<StatusLabel
											completed={isCompleted(
												selectedAPIURLTokenDescriptor
											)}
										/>

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
						{apiURLTokenDescriptors.map((apiURLTokenDescriptor) => {
							const externalReferenceCode =
								apiURLTokenDescriptor.externalReferenceCode as string;

							return (
								<ClayDropDown.Item
									active={
										externalReferenceCode ===
										selectedExternalReferenceCode
									}
									className="p-2"
									key={externalReferenceCode}
									onClick={() => {
										setSelectedExternalReferenceCode(
											externalReferenceCode
										);
										setIsFilterDropdownActive(false);
									}}
								>
									<span className="align-items-center d-flex justify-content-between">
										<span className="data-set-token-name text-truncate">
											{getLabel(externalReferenceCode)}
										</span>

										<StatusLabel
											completed={isCompleted(
												apiURLTokenDescriptor
											)}
										/>
									</span>
								</ClayDropDown.Item>
							);
						})}
					</ClayDropDown.ItemList>
				</ClayDropDown>
			</ClayForm.Group>

			{selectedAPIURLTokenDescriptor && (
				<TokenMappingFields
					apiURLTokenDescriptor={selectedAPIURLTokenDescriptor}
					key={selectedExternalReferenceCode}
					onTokenMappingsChange={(tokenMappings) =>
						onTokenMappingsChange({
							...selectionFilterTokenMappings,
							[selectedExternalReferenceCode]: tokenMappings,
						})
					}
					tokenMappings={
						selectionFilterTokenMappings[
							selectedExternalReferenceCode
						] ?? {}
					}
				/>
			)}
		</>
	);
}
