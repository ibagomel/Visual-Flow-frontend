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
import { withTranslation } from 'react-i18next';
import { IconButton, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { TuneOutlined } from '@material-ui/icons';
import useStyles from './ContainerConfiguration.Styles';
import getMenuItems from '../helpers/getMenuItems';
import { IMAGE_PULL_SECRET_TYPE } from '../constants/container';

const ImagePullSecretType = ({ ableToEdit, state, onChange, t, openModal }) => {
    const classes = useStyles();
    return (
        <>
            <TextField
                disabled={!ableToEdit}
                label={t(
                    'pipelineDesigner:containerConfiguration.ImagePullSecretType'
                )}
                placeholder={t(
                    'pipelineDesigner:containerConfiguration.ImagePullSecretType'
                )}
                variant="outlined"
                margin="normal"
                fullWidth
                select
                name="imagePullSecretType"
                value={state.imagePullSecretType || ''}
                onChange={event => onChange(event.target.name, event.target.value)}
            >
                {getMenuItems(Object.values(IMAGE_PULL_SECRET_TYPE))}
            </TextField>
            {state.imagePullSecretType === IMAGE_PULL_SECRET_TYPE.NEW.value && (
                <>
                    <TextField
                        disabled={!ableToEdit}
                        label={t('pipelineDesigner:containerConfiguration.Username')}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        multiline
                        name="username"
                        value={state.username || ''}
                        onChange={event =>
                            onChange(event.target.name, event.target.value)
                        }
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    className={classes.button}
                                    onClick={() => openModal('username')}
                                >
                                    <TuneOutlined />
                                </IconButton>
                            )
                        }}
                    />
                    <TextField
                        disabled={!ableToEdit}
                        label={t('pipelineDesigner:containerConfiguration.Password')}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        multiline
                        name="password"
                        value={state.password || ''}
                        onChange={event =>
                            onChange(event.target.name, event.target.value)
                        }
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    className={classes.button}
                                    onClick={() => openModal('password')}
                                >
                                    <TuneOutlined />
                                </IconButton>
                            )
                        }}
                    />
                    <TextField
                        disabled={!ableToEdit}
                        label={t('pipelineDesigner:containerConfiguration.Registry')}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        multiline
                        name="registry"
                        value={state.registry || ''}
                        onChange={event =>
                            onChange(event.target.name, event.target.value)
                        }
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    className={classes.button}
                                    onClick={() => openModal('registry')}
                                >
                                    <TuneOutlined />
                                </IconButton>
                            )
                        }}
                    />
                </>
            )}
            {state.imagePullSecretType === IMAGE_PULL_SECRET_TYPE.PROVIDED.value && (
                <TextField
                    disabled={!ableToEdit}
                    label={t(
                        'pipelineDesigner:containerConfiguration.ImagePullSecretName'
                    )}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    multiline
                    name="imagePullSecretName"
                    value={state.imagePullSecretName || ''}
                    onChange={event =>
                        onChange(event.target.name, event.target.value)
                    }
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                className={classes.button}
                                onClick={() => openModal('imagePullSecretName')}
                            >
                                <TuneOutlined />
                            </IconButton>
                        )
                    }}
                />
            )}
        </>
    );
};

ImagePullSecretType.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func,
    openModal: PropTypes.func,
    t: PropTypes.func
};

export default withTranslation()(ImagePullSecretType);
