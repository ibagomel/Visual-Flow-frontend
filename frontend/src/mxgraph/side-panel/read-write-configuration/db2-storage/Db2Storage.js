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
import { TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ReadTextFields from '../rw-text-fields';
import WriteMode from '../helpers/WriteMode';
import { READ, WRITE } from '../../../constants';
import getMenuItems from '../../helpers/getMenuItems';

const customSql = [
    {
        value: 'true',
        label: 'True'
    },
    {
        value: 'false',
        label: 'False'
    }
];

const customFields = [{ field: 'Schema' }, { field: 'Table' }];

const fields = [{ field: 'JDBC URL' }, { field: 'User' }, { field: 'Password' }];

const Db2Storage = ({ inputValues, handleInputChange, openModal, ableToEdit }) => {
    const { t } = useTranslation();
    return (
        <>
            <ReadTextFields
                ableToEdit={ableToEdit}
                fields={fields}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                openModal={openModal}
            />
            {inputValues.operation === READ && (
                <TextField
                    disabled={!ableToEdit}
                    label={t('jobDesigner:readConfiguration.CustomSql')}
                    placeholder={t('jobDesigner:readConfiguration.CustomSql')}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    select
                    name="customSql"
                    value={inputValues.customSql || ''}
                    onChange={handleInputChange}
                >
                    {getMenuItems(customSql)}
                </TextField>
            )}
            {inputValues.customSql === 'false' && (
                <ReadTextFields
                    ableToEdit={ableToEdit}
                    fields={customFields}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
                />
            )}
            {inputValues.customSql === 'true' && (
                <ReadTextFields
                    ableToEdit={ableToEdit}
                    fields={[{ field: 'option.dbtable', rows: 6 }]}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
                    nameWIthPoint
                />
            )}
            {inputValues.operation === WRITE && (
                <>
                    <ReadTextFields
                        ableToEdit={ableToEdit}
                        fields={customFields}
                        inputValues={inputValues}
                        handleInputChange={handleInputChange}
                        openModal={openModal}
                    />
                    <WriteMode
                        disabled={!ableToEdit}
                        value={inputValues.writeMode}
                        onChange={handleInputChange}
                    />
                </>
            )}
            <ReadTextFields
                ableToEdit={ableToEdit}
                fields={[{ field: 'Cert Data', rows: 6 }]}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                openModal={openModal}
            />
        </>
    );
};

Db2Storage.propTypes = {
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    openModal: PropTypes.func,
    ableToEdit: PropTypes.bool
};

export default Db2Storage;