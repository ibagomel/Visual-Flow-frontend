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
import { TextField, MenuItem } from '@material-ui/core';
import { withTranslation } from 'react-i18next';

const writeModes = [
    {
        value: 'Append',
        label: 'Append'
    },
    {
        value: 'Overwrite',
        label: 'Overwrite'
    },
    {
        value: 'ErrorIfExists',
        label: 'Error if exists'
    }
];

const WriteMode = ({ t, disabled, value, onChange }) => (
    <TextField
        disabled={disabled}
        label={t('jobDesigner:readConfiguration.writeMode')}
        placeholder={t('jobDesigner:readConfiguration.writeMode')}
        variant="outlined"
        margin="normal"
        fullWidth
        select
        name="writeMode"
        value={value || ''}
        onChange={onChange}
    >
        {writeModes.map(option => (
            <MenuItem key={option.value} value={option.value}>
                {option.label}
            </MenuItem>
        ))}
    </TextField>
);

WriteMode.propTypes = {
    t: PropTypes.func,
    disabled: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func
};

export default withTranslation()(WriteMode);
