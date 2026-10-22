/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayForm from '@clayui/form';
import ClayLabel from '@clayui/label';
import ClayPanel from '@clayui/panel';
import {
	IDataSet,
	getDataSetResourceURL,
} from '@liferay/frontend-data-set-admin-web';
import {DEFAULT_FETCH_HEADERS} from '@liferay/frontend-data-set-web';
import {fetch} from 'frontend-js-web';
import React, {useEffect, useMemo, useState} from 'react';

import './DataSetConfigurationFields.scss';
import DataSetSelector from './components/DataSetSelector';
import SelectionFilterTokenMappingFields from './components/SelectionFilterTokenMappingFields';
import TokenMappingFields from './components/TokenMappingFields';
import {
	IAPIURLTokenDescriptor,
	TokenMapping,
	isTokenMappingCompleted,
} from './tokenMapping';

const EMPTY_API_URL_TOKEN_DESCRIPTOR: IAPIURLTokenDescriptor = {
	autoResolvedTokenNames: [],
	tokenNames: [],
	unresolvedTokenNames: [],
};

interface IDataSetWithSelectionFilters extends Partial<IDataSet> {
	dataSetToDataSetSelectionFilters?: {
		externalReferenceCode: string;
		label: string;
	}[];
}

interface IItemSelectorValue {
	className?: string;
	classPK?: number;
	externalReferenceCode?: string;
}

function getItemSelectorValue(
	className: string | undefined,
	dataSet: IDataSetWithSelectionFilters
): IItemSelectorValue {
	const {externalReferenceCode, id} = dataSet;

	if (!externalReferenceCode) {
		return {};
	}

	if (!className) {
		if (process.env.NODE_ENV === 'development') {
			console.error(
				'Unable to get the data set class name. The selection will not survive a page export.'
			);
		}

		return {externalReferenceCode};
	}

	return {
		className,
		classPK: Number(id),
		externalReferenceCode,
	};
}

function parseJSON<T>(json: string | undefined, defaultValue: T): T {
	try {
		return json ? JSON.parse(json) : defaultValue;
	}
	catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error(error);
		}

		return defaultValue;
	}
}

function TokenMappingStatus({completed}: {completed: boolean}) {
	return (
		<ClayForm.Group className="align-items-center d-flex justify-content-between">
			<label className="mb-0">{Liferay.Language.get('status')}</label>

			<ClayLabel
				className="text-uppercase"
				displayType={completed ? 'success' : 'warning'}
			>
				{completed
					? Liferay.Language.get('completed')
					: Liferay.Language.get('incomplete')}
			</ClayLabel>
		</ClayForm.Group>
	);
}

interface IConfigurationField {
	onValueSelect: (name: string, value: any) => void;
	values: {
		apiURLTokenDescriptors: string;
		apiURLTokenMappings: string;
		itemSelector: IItemSelectorValue;
		selectionFilterAPIURLTokenMappings: string;
	};
}

export default function DataSetConfigurationFields({
	onValueSelect,
	values,
}: IConfigurationField) {
	const [apiURLTokenMappings, setApiURLTokenMappings] = useState<
		Record<string, TokenMapping>
	>(() => parseJSON(values?.apiURLTokenMappings, {}));
	const [
		selectionFilterAPIURLTokenMappings,
		setSelectionFilterAPIURLTokenMappings,
	] = useState<Record<string, Record<string, TokenMapping>>>(() =>
		parseJSON(values?.selectionFilterAPIURLTokenMappings, {})
	);

	const className = values.itemSelector?.className;
	const externalReferenceCode = values.itemSelector?.externalReferenceCode;

	const [dataSet, setDataSet] = useState<IDataSetWithSelectionFilters>({});

	useEffect(() => {
		if (!externalReferenceCode) {
			setDataSet({});

			return;
		}

		if (dataSet.externalReferenceCode === externalReferenceCode) {
			return;
		}

		let cancelled = false;

		const getDataSet = async () => {
			try {
				const response = await fetch(
					getDataSetResourceURL({
						dataSetERC: externalReferenceCode,
						params: {
							nestedFields: 'dataSetToDataSetSelectionFilters',
						},
					}),
					{headers: DEFAULT_FETCH_HEADERS}
				);

				const responseJSON = await response.json();

				if (!cancelled && responseJSON?.id) {
					setDataSet(responseJSON);
				}
			}
			catch (error) {
				if (process.env.NODE_ENV === 'development') {
					console.error(error);
				}
			}
		};

		getDataSet();

		return () => {
			cancelled = true;
		};
	}, [dataSet.externalReferenceCode, externalReferenceCode]);

	const apiURLTokenDescriptors = useMemo(
		() =>
			parseJSON<IAPIURLTokenDescriptor[]>(
				values.apiURLTokenDescriptors,
				[]
			),
		[values.apiURLTokenDescriptors]
	);

	const apiURLTokenDescriptor =
		apiURLTokenDescriptors.find(
			(apiURLTokenDescriptor) =>
				!apiURLTokenDescriptor.externalReferenceCode
		) ?? EMPTY_API_URL_TOKEN_DESCRIPTOR;

	const selectionFilterAPIURLTokenDescriptors = useMemo(
		() =>
			apiURLTokenDescriptors.filter(
				(apiURLTokenDescriptor) =>
					apiURLTokenDescriptor.externalReferenceCode
			),
		[apiURLTokenDescriptors]
	);

	const selectionFilterLabels = useMemo(
		() =>
			Object.fromEntries(
				(dataSet.dataSetToDataSetSelectionFilters ?? []).map(
					({externalReferenceCode, label}) => [
						externalReferenceCode,
						label,
					]
				)
			),
		[dataSet.dataSetToDataSetSelectionFilters]
	);

	const tokenKeys = apiURLTokenDescriptor.tokenNames;

	const isCompleted = isTokenMappingCompleted(
		apiURLTokenDescriptor,
		apiURLTokenMappings
	);

	const isSelectionFilterTokenMappingCompleted =
		selectionFilterAPIURLTokenDescriptors.every(
			(selectionFilterAPIURLTokenDescriptor) =>
				isTokenMappingCompleted(
					selectionFilterAPIURLTokenDescriptor,
					selectionFilterAPIURLTokenMappings[
						selectionFilterAPIURLTokenDescriptor.externalReferenceCode as string
					] ?? {}
				)
		);

	return (
		<>
			<DataSetSelector
				onChange={(selectedDataSet) => {
					setDataSet(selectedDataSet);

					onValueSelect(
						'itemSelector',
						getItemSelectorValue(className, selectedDataSet)
					);
				}}
				value={dataSet}
			/>

			{Liferay.FeatureFlags['LPD-38564'] && !!tokenKeys.length && (
				<ClayPanel
					className="w-100"
					collapsable
					defaultExpanded
					displayTitle={Liferay.Language.get('url-token-mapping')}
					displayType="unstyled"
					showCollapseIcon
				>
					<ClayPanel.Body>
						<TokenMappingStatus completed={isCompleted} />

						<TokenMappingFields
							apiURLTokenDescriptor={apiURLTokenDescriptor}
							onTokenMappingsChange={(tokenMappings) => {
								setApiURLTokenMappings(tokenMappings);

								onValueSelect(
									'apiURLTokenMappings',
									JSON.stringify(tokenMappings)
								);
							}}
							tokenMappings={apiURLTokenMappings}
						/>
					</ClayPanel.Body>
				</ClayPanel>
			)}

			{Liferay.FeatureFlags['LPD-38564'] &&
				!!selectionFilterAPIURLTokenDescriptors.length && (
					<ClayPanel
						className="w-100"
						collapsable
						defaultExpanded
						displayTitle={Liferay.Language.get(
							'filters-token-mapping'
						)}
						displayType="unstyled"
						showCollapseIcon
					>
						<ClayPanel.Body>
							<TokenMappingStatus
								completed={
									isSelectionFilterTokenMappingCompleted
								}
							/>

							<SelectionFilterTokenMappingFields
								apiURLTokenDescriptors={
									selectionFilterAPIURLTokenDescriptors
								}
								labels={selectionFilterLabels}
								onTokenMappingsChange={(
									selectionFilterTokenMappings
								) => {
									setSelectionFilterAPIURLTokenMappings(
										selectionFilterTokenMappings
									);

									onValueSelect(
										'selectionFilterAPIURLTokenMappings',
										JSON.stringify(
											selectionFilterTokenMappings
										)
									);
								}}
								selectionFilterTokenMappings={
									selectionFilterAPIURLTokenMappings
								}
							/>
						</ClayPanel.Body>
					</ClayPanel>
				)}
		</>
	);
}
