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
import classNames from 'classnames';
import { TextField, MenuItem } from '@material-ui/core';
import useStyles from './CustomTextFiled.Styles';

const CustomTextField = ({
    className,
    classNameText,
    classNameSelect,
    onChangeText,
    onChangeSelect,
    textValue,
    selectedValue,
    selectValues,
    textLabel,
    textPlaceholder,
    selectLabel,
    selectPlaceholder,
    textType,
    disabled
}) => {
    const classes = useStyles();

    return (
        <div className={classNames(classes.root, className)}>
            <TextField
                className={classNames(classes.text, classNameText)}
                variant="outlined"
                disabled={disabled}
                value={textValue}
                onChange={onChangeText}
                label={textLabel}
                placeholder={textPlaceholder}
                type={textType}
            />
            <TextField
                className={classNames(classes.select, classNameSelect)}
                select
                disabled={disabled}
                value={selectedValue || ''}
                onChange={onChangeSelect}
                variant="outlined"
                label={selectLabel}
                placeholder={selectPlaceholder}
            >
                {selectValues.map(option => (
                    <MenuItem key={option.key || option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        </div>
    );
};

CustomTextField.propTypes = {
    className: PropTypes.string,
    classNameText: PropTypes.string,
    classNameSelect: PropTypes.string,
    onChangeText: PropTypes.func,
    onChangeSelect: PropTypes.func,
    textLabel: PropTypes.string,
    textPlaceholder: PropTypes.string,
    selectLabel: PropTypes.string,
    selectPlaceholder: PropTypes.string,
    textValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    selectedValue: PropTypes.string,
    selectValues: PropTypes.arrayOf(PropTypes.object),
    textType: PropTypes.string,
    disabled: PropTypes.bool
};

export default CustomTextField;
