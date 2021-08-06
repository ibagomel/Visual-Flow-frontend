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
import { withTranslation } from 'react-i18next';
import { Divider, MenuItem, TextField } from '@material-ui/core';
import { get } from 'lodash';

import Db2Storage from './db2-storage/Db2Storage';
import CosStorage from './cos-storage/CosStorage';
import AwsStorage from './aws-storage/AwsStorage';
import ElasticStorage from './elastic-storage/ElasticStorage';
import { READ, DB2, COS, ELASTIC, STDOUT, AWS } from '../../constants';

export const storages = [
    {
        value: 'DB2',
        label: DB2
    },
    {
        value: 'cos',
        label: COS
    },
    {
        value: 's3',
        label: AWS
    },
    {
        value: 'elastic',
        label: ELASTIC
    },
    {
        value: 'STDOUT',
        label: STDOUT,
        hide: [READ]
    }
];

const ReadWriteConfiguration = ({ state, ableToEdit, onChange, t, openModal }) => {
    const getStorageComponent = name => {
        switch (name) {
            case 'DB2':
                return Db2Storage;
            case 'cos':
                return CosStorage;
            case 's3':
                return AwsStorage;
            case 'elastic':
                return ElasticStorage;
            case 'STDOUT':
                return () => null;
            default:
                throw new Error(`Unsupported storage: ${name}`);
        }
    };

    const renderStorageComponent = name => {
        const Comp = getStorageComponent(name);
        return (
            <Comp
                ableToEdit={ableToEdit}
                inputValues={state}
                handleInputChange={event =>
                    onChange(event.target.name, event.target.value)
                }
                openModal={openModal}
            />
        );
    };

    return (
        <>
            <TextField
                disabled={!ableToEdit}
                label={t('jobDesigner:readConfiguration.Storage')}
                placeholder={t('jobDesigner:readConfiguration.Storage')}
                variant="outlined"
                margin="normal"
                fullWidth
                select
                name="storage"
                value={state.storage || ''}
                onChange={event => onChange(event.target.name, event.target.value)}
            >
                {storages
                    .filter(
                        storage =>
                            !get(storage, 'hide', []).includes(state.operation)
                    )
                    .map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
            </TextField>
            <Divider />
            {state.storage && renderStorageComponent(state.storage)}
        </>
    );
};

ReadWriteConfiguration.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func,
    t: PropTypes.func,
    openModal: PropTypes.func
};

export default withTranslation()(ReadWriteConfiguration);
