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
import { Typography } from '@material-ui/core';

import DescriptionIcon from '@material-ui/icons/Description';
import stageIcon from '../../sidebar/stage-icon/stageIcon';
import useStyles from './ContainerStage.Styles';
import { DRAFT, PENDING, SKIPPED } from '../../constants';
import StageWarning from '../../../components/stage-warning';
import makeTooltip from '../helpers/makeTooltip';

const ContainerStage = ({ stage, params }) => {
    const classes = useStyles();
    const visibleLogsIcon =
        stage.status && ![DRAFT, PENDING, SKIPPED].includes(stage.status);
    return (
        <div className={classes.root}>
            <Typography variant="body2" component="div" className={classes.title}>
                {stageIcon(stage.operation)}
                <span className={classes.name}>
                    {makeTooltip(stage.name, stage.name)}
                </span>
                {visibleLogsIcon && (
                    <DescriptionIcon id={stage.name} className={classes.logIcon} />
                )}
                <StageWarning stage={stage} params={params} />
            </Typography>
            <Typography variant="caption" component="div" className={classes.image}>
                {makeTooltip(stage.image, stage.image) || ''}
            </Typography>
        </div>
    );
};

ContainerStage.propTypes = {
    stage: PropTypes.object,
    params: PropTypes.array
};

export default ContainerStage;
