/*
 * Copyright (c) 2021 IBA Group, a.s. All rights reserved.
 *
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
import { useTranslation } from 'react-i18next';

import { TextField } from '@material-ui/core';
import ReadTextFields from '../rw-text-fields';
import { READ, WRITE } from '../../../constants';
import WriteMode from '../helpers/WriteMode';
import getMenuItems from '../../helpers/getMenuItems';

const fields = [
    { field: 'Host' },
    { field: 'Port' },
    { field: 'Password' },
    { field: 'KeyColumn' }
];

const required = [
    {
        value: 'true',
        label: 'True'
    },
    {
        value: 'false',
        label: 'False'
    }
];

const model = [
    {
        value: 'binary',
        label: 'Binary'
    },
    {
        value: 'hash',
        label: 'Hash'
    }
];

const readMode = [
    {
        value: 'key',
        label: 'Key'
    },
    {
        value: 'pattern',
        label: 'Pattern'
    }
];
const RedisStorage = ({ inputValues, handleInputChange, openModal, ableToEdit }) => {
    const { t } = useTranslation();

    return (
        <>
            <ReadTextFields
                fields={fields}
                openModal={openModal}
                inputValues={inputValues}
                ableToEdit={ableToEdit}
                handleInputChange={handleInputChange}
            />
            <TextField
                disabled={!ableToEdit}
                label={t('jobDesigner:readConfiguration.SSL')}
                placeholder={t('jobDesigner:readConfiguration.SSL')}
                variant="outlined"
                margin="normal"
                fullWidth
                select
                name="ssl"
                value={inputValues.ssl || ''}
                onChange={handleInputChange}
            >
                {getMenuItems(required)}
            </TextField>
            <TextField
                disabled={!ableToEdit}
                label={t('jobDesigner:readConfiguration.Model')}
                placeholder={t('jobDesigner:readConfiguration.Model')}
                variant="outlined"
                margin="normal"
                fullWidth
                select
                name="model"
                value={inputValues.model || ''}
                onChange={handleInputChange}
            >
                {getMenuItems(model)}
            </TextField>
            {inputValues.operation === READ && (
                <>
                    <TextField
                        disabled={!ableToEdit}
                        label={t('jobDesigner:readConfiguration.ReadMode')}
                        placeholder={t('jobDesigner:readConfiguration.ReadMode')}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        select
                        name="readMode"
                        value={inputValues.readMode || ''}
                        onChange={handleInputChange}
                    >
                        {getMenuItems(readMode)}
                    </TextField>
                    {inputValues.readMode === 'pattern' && (
                        <ReadTextFields
                            fields={[{ field: 'KeysPattern' }]}
                            openModal={openModal}
                            inputValues={inputValues}
                            ableToEdit={ableToEdit}
                            handleInputChange={handleInputChange}
                        />
                    )}
                </>
            )}
            {(inputValues.readMode === 'key' || inputValues.operation === WRITE) && (
                <ReadTextFields
                    fields={[{ field: 'Table' }]}
                    openModal={openModal}
                    inputValues={inputValues}
                    ableToEdit={ableToEdit}
                    handleInputChange={handleInputChange}
                />
            )}
            {inputValues.operation === WRITE && (
                <>
                    <TextField
                        disabled={!ableToEdit}
                        label={t('jobDesigner:readConfiguration.ttl')}
                        placeholder={t('jobDesigner:readConfiguration.ttl')}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="ttl"
                        value={inputValues.ttl || ''}
                        type="number"
                        onChange={handleInputChange}
                    />
                    <WriteMode
                        disabled={!ableToEdit}
                        value={inputValues.writeMode}
                        onChange={handleInputChange}
                    />
                </>
            )}
        </>
    );
};

RedisStorage.propTypes = {
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    openModal: PropTypes.func,
    ableToEdit: PropTypes.bool
};

export default RedisStorage;
