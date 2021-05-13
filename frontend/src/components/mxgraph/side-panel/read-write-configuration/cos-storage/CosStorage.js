/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Divider, MenuItem } from '@material-ui/core';
import { withTranslation } from 'react-i18next';

import ReadTextFields from '../ReadWriteTextFields';
import WriteMode from '../WriteMode';
import { WRITE } from '../../../constants';

const fields = [
    { field: 'Endpoint' },
    { field: 'Access key' },
    { field: 'Secret key' },
    { field: 'Bucket' },
    { field: 'Path' }
];

const fileFormats = [
    {
        value: 'csv',
        label: 'CSV'
    },
    {
        value: 'json',
        label: 'JSON'
    },
    {
        value: 'parquet',
        label: 'Parquet'
    },
    {
        value: 'orc',
        label: 'ORC'
    },
    {
        value: 'text',
        label: 'Text'
    }
];

const csvHeader = [
    {
        value: 'true',
        label: 'True'
    },
    {
        value: 'false',
        label: 'False'
    }
];

const CosStorage = ({
    inputValues,
    handleInputChange,
    t,
    openModal,
    ableToEdit
}) => {
    const renderDropdownItems = options =>
        options.map(option => (
            <MenuItem key={option.value} value={option.value}>
                {option.label}
            </MenuItem>
        ));

    return (
        <>
            <ReadTextFields
                ableToEdit={ableToEdit}
                fields={fields}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                openModal={openModal}
            />
            {inputValues.operation === WRITE && (
                <WriteMode
                    disabled={!ableToEdit}
                    value={inputValues.writeMode}
                    onChange={handleInputChange}
                />
            )}
            <TextField
                disabled={!ableToEdit}
                label={t('jobDesigner:readConfiguration.Fileformat')}
                placeholder={t('jobDesigner:readConfiguration.Fileformat')}
                variant="outlined"
                margin="normal"
                fullWidth
                select
                name="format"
                value={inputValues.format || ''}
                onChange={handleInputChange}
            >
                {renderDropdownItems(fileFormats)}
            </TextField>
            {inputValues.format === 'csv' && (
                <>
                    <Divider />
                    <TextField
                        label={t('jobDesigner:writeConfiguration.Header')}
                        placeholder={t('jobDesigner:writeConfiguration.Header')}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        select
                        name="header"
                        value={inputValues.header || ''}
                        onChange={handleInputChange}
                    >
                        {renderDropdownItems(csvHeader)}
                    </TextField>
                    <TextField
                        label={t('jobDesigner:writeConfiguration.Delimiter')}
                        placeholder={t('jobDesigner:writeConfiguration.Delimiter')}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="delimiter"
                        value={inputValues.delimiter || ''}
                        onChange={handleInputChange}
                    />
                </>
            )}
        </>
    );
};

CosStorage.propTypes = {
    t: PropTypes.func,
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    openModal: PropTypes.func,
    ableToEdit: PropTypes.bool
};

export default withTranslation()(CosStorage);
