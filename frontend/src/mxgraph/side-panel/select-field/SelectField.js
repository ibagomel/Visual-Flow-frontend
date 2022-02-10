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
import { TextField, Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ClearButton from '../helpers/ClearButton';
import useStyles from './SelectField.Styles';
import getMenuItems from '../helpers/getMenuItems';
import { READWRITE } from '../../constants';

const SelectField = ({
    ableToEdit,
    label,
    name,
    value,
    handleInputChange,
    menuItems,
    type
}) => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <Box className={classes.wrapper}>
            <TextField
                disabled={!ableToEdit}
                label={t(label)}
                placeholder={t(label)}
                variant="outlined"
                margin="normal"
                fullWidth
                select
                name={name}
                value={value || ''}
                onChange={
                    type === READWRITE
                        ? handleInputChange
                        : event =>
                              handleInputChange(
                                  event.target.name,
                                  event.target.value
                              )
                }
            >
                {getMenuItems(menuItems)}
            </TextField>
            <ClearButton
                name={name}
                value={value}
                ableToEdit={ableToEdit}
                handleInputChange={handleInputChange}
                type={type}
            />
        </Box>
    );
};

SelectField.propTypes = {
    ableToEdit: PropTypes.bool,
    label: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.any,
    handleInputChange: PropTypes.func,
    menuItems: PropTypes.array,
    type: PropTypes.string
};

export default SelectField;
