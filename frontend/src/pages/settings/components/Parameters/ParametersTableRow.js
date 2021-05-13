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
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { IconButton, TableCell, TableRow, TextField } from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';

import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PasswordInput from '../../../../components/password-input/PasswordInput';

import useStyles from './ParametersTableRow.Styles';
import toggleConfirmationWindow from '../../../../redux/actions/modalsActions';

const ParametersTableRow = ({
    editMode,
    index,
    handleRemoveParameter,
    handleChangeParameter,
    parameter: { key, value, secret },
    confirmationWindow
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const inputValueProps = (parameterValue, parameterIndex) => ({
        disabled: !editMode,
        onChange: event => handleChangeParameter(event, parameterIndex, 'value'),
        fullWidth: true,
        placeholder: t('setting:parameter.Value'),
        value: parameterValue
    });

    return (
        <TableRow>
            <TableCell className={classNames(classes.cell, classes.keyCell)}>
                <TextField
                    disabled={!editMode}
                    variant="outlined"
                    value={key}
                    onChange={event => handleChangeParameter(event, index, 'key')}
                    placeholder={t('setting:parameter.Name')}
                />
            </TableCell>
            <TableCell className={classNames(classes.cell, classes.valueCell)}>
                {secret ? (
                    <PasswordInput {...inputValueProps(value, index)} />
                ) : (
                    <TextField
                        {...inputValueProps(value, index)}
                        variant="outlined"
                    />
                )}
            </TableCell>
            <TableCell className={classes.cell}>
                <IconButton
                    className={classNames({
                        [classes.hidden]: !editMode
                    })}
                    onClick={() =>
                        confirmationWindow({
                            body: `${t('main:confirm.sure')} '${key}'?`,
                            callback: () => handleRemoveParameter(index)
                        })
                    }
                >
                    <DeleteOutline color="action" />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

ParametersTableRow.propTypes = {
    editMode: PropTypes.bool,
    index: PropTypes.number,
    parameter: PropTypes.object,
    handleRemoveParameter: PropTypes.func,
    handleChangeParameter: PropTypes.func,
    confirmationWindow: PropTypes.func.isRequired
};
const mapDispatchToProps = {
    confirmationWindow: toggleConfirmationWindow
};

export default connect(null, mapDispatchToProps)(ParametersTableRow);
