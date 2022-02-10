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

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { TextField, Box } from '@material-ui/core';

import { READWRITE } from '../../../constants';
import ClearButton from '../../helpers/ClearButton';
import useStyles from '../ReadWriteConfiguration.Styles';

const DEFAULT_QUANTITY = 10;
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 2147483631;

const StdoutStorage = ({ inputValues, handleInputChange, ableToEdit }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    useEffect(() => {
        if (!inputValues.quantity) {
            const event = {
                target: {
                    name: 'quantity',
                    value: DEFAULT_QUANTITY
                }
            };
            handleInputChange(event);
        }
    }, []);

    return (
        <Box className={classes.wrapper}>
            <TextField
                disabled={!ableToEdit}
                label={t('jobDesigner:readConfiguration.quantity')}
                placeholder={t('jobDesigner:readConfiguration.quantity')}
                variant="outlined"
                margin="normal"
                InputProps={{
                    inputProps: {
                        min: MIN_QUANTITY,
                        max: MAX_QUANTITY
                    }
                }}
                fullWidth
                name="quantity"
                value={inputValues.quantity || ''}
                type="number"
                onChange={handleInputChange}
                error={
                    inputValues.quantity < MIN_QUANTITY ||
                    inputValues.quantity > MAX_QUANTITY
                }
            />
            <ClearButton
                name="quantity"
                value={inputValues.quantity}
                ableToEdit={ableToEdit}
                handleInputChange={handleInputChange}
                type={READWRITE}
            />
        </Box>
    );
};

StdoutStorage.propTypes = {
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    ableToEdit: PropTypes.bool
};

export default StdoutStorage;
