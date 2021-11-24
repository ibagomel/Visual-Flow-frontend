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
import { useTranslation } from 'react-i18next';
import {
    Checkbox,
    Divider,
    FormControlLabel,
    IconButton,
    TextField
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { TuneOutlined } from '@material-ui/icons';
import useStyles from './ContainerConfiguration.Styles';
import getMenuItems from '../helpers/getMenuItems';
import CustomTextField from '../../../components/custom-text-field';
import { CPU, IMAGE_PULL_POLICY, LIMITS, MEMORY } from '../constants/container';
import ImagePullSecretType from './ImagePullSecretType';

const ContainerConfiguration = ({ state, ableToEdit, onChange, openModal }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    return (
        <>
            <Divider />
            {state.name && (
                <>
                    <TextField
                        disabled={!ableToEdit}
                        label={t('pipelineDesigner:containerConfiguration.Image')}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        multiline
                        name="image"
                        value={state.image || ''}
                        onChange={event =>
                            onChange(event.target.name, event.target.value)
                        }
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    className={classes.button}
                                    onClick={() => openModal('image')}
                                >
                                    <TuneOutlined />
                                </IconButton>
                            )
                        }}
                    />
                    <TextField
                        disabled={!ableToEdit}
                        label={t(
                            'pipelineDesigner:containerConfiguration.ImagePullPolicy'
                        )}
                        placeholder={t(
                            'pipelineDesigner:containerConfiguration.ImagePullPolicy'
                        )}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        select
                        name="imagePullPolicy"
                        value={state.imagePullPolicy || ''}
                        onChange={event =>
                            onChange(event.target.name, event.target.value)
                        }
                    >
                        {getMenuItems(IMAGE_PULL_POLICY)}
                    </TextField>
                    {LIMITS.map(item => (
                        <CustomTextField
                            disabled={!ableToEdit}
                            value={state[item] || ''}
                            selectValues={
                                item.toLowerCase().includes('cpu')
                                    ? Object.values(CPU)
                                    : Object.values(MEMORY)
                            }
                            defaultValue={
                                item.toLowerCase().includes('cpu')
                                    ? CPU.MILICORES.value
                                    : MEMORY.MB.value
                            }
                            textLabel={t(
                                `pipelineDesigner:containerConfiguration.${item}`
                            )}
                            selectLabel={t(
                                'pipelineDesigner:containerConfiguration.units'
                            )}
                            key={item}
                            name={item}
                            onChange={event =>
                                onChange(event.target.name, event.target.value)
                            }
                        />
                    ))}
                    <FormControlLabel
                        control={
                            <Checkbox
                                disabled={!ableToEdit}
                                onChange={event => {
                                    onChange(
                                        'mountProjectParams',
                                        event.target.checked.toString()
                                    );
                                }}
                                name="mountProjectParams"
                                checked={
                                    state.mountProjectParams === true ||
                                    state.mountProjectParams === 'true' ||
                                    false
                                }
                            />
                        }
                        label={t(
                            'pipelineDesigner:containerConfiguration.MountProjectParams'
                        )}
                    />
                    <ImagePullSecretType
                        state={state}
                        onChange={onChange}
                        openModal={openModal}
                        ableToEdit={ableToEdit}
                        t={t}
                    />
                    <TextField
                        disabled={!ableToEdit}
                        label={t('pipelineDesigner:containerConfiguration.Command')}
                        placeholder={t(
                            'pipelineDesigner:containerConfiguration.Command'
                        )}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        multiline
                        rows={8}
                        name="command"
                        value={state.command || ''}
                        onChange={event =>
                            onChange(event.target.name, event.target.value)
                        }
                    />
                </>
            )}
        </>
    );
};

ContainerConfiguration.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func,
    openModal: PropTypes.func
};

export default ContainerConfiguration;