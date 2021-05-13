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
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import CardActions from '@material-ui/core/CardActions';
import classNames from 'classnames';
import { isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';
import useStyles from './FormButtons.Styles';
import { isEmpty, isValidationPassed } from './validations';

const FormButtons = ({ project, card, editMode, onSubmit, onCancel }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const isSaveBtnDisabled = () =>
        isEmpty(card) || !isValidationPassed(card) || isEqual(project, card);

    return (
        (!project || editMode) && (
            <CardActions className={classes.buttonsGroup}>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={onSubmit}
                    disabled={isSaveBtnDisabled()}
                >
                    {t('main:button.Save')}
                </Button>
                <Button
                    className={classNames(classes.button, classes.cancelBtn)}
                    variant="contained"
                    onClick={onCancel}
                >
                    {t('main:button.Cancel')}
                </Button>
            </CardActions>
        )
    );
};

FormButtons.propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    project: PropTypes.object,
    card: PropTypes.object,
    editMode: PropTypes.bool
};

export default FormButtons;
