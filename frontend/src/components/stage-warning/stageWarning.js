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
import ReportOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import { Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import schemas from '../../mxgraph/side-panel/schemas';
import useStyles from './stageWarning.Styles';
import { IMAGE_PULL_SECRET_TYPE } from '../../mxgraph/side-panel/constants/container';
import { findByProp } from '../helpers/JobsPipelinesTable';

const containerValidation = (stage, schemaStageLength) => {
    let stageLength = schemaStageLength || 0;
    if (!stage.mountProjectParams) {
        stageLength -= 1;
    }
    if (!stage.command) {
        stageLength -= 1;
    }
    switch (stage.imagePullSecretType) {
        case IMAGE_PULL_SECRET_TYPE.NEW.value:
            stageLength -= 1;
            break;
        case IMAGE_PULL_SECRET_TYPE.PROVIDED.value:
            stageLength -= 3;
            break;
        default:
            stageLength -= 4;
    }
    return stageLength;
};

const StageWarning = ({ stage, jobs, visibleLogsIcon }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const position = stage.name ? classes.stageWithName : classes.stageWithoutName;

    const stageNotFilled = () => {
        const stageLength = Object.keys(stage).length;
        let schemaStageLength =
            Object.keys(schemas[stage.operation]).length +
            Object.keys(schemas.COMMON_SCHEMA).length;

        if (jobs && stage.operation === 'JOB') {
            return !findByProp(jobs, stage.jobId, 'id');
        }

        if (stage.operation === 'CONTAINER') {
            schemaStageLength = containerValidation(stage, schemaStageLength);
        }

        return schemaStageLength > stageLength;
    };

    return stageNotFilled() ? (
        <Box
            title={t('main:validation.fieldsNotFilled')}
            className={classNames(position, {
                [classes.stageWithLogs]: stage.name && visibleLogsIcon
            })}
        >
            <ReportOutlinedIcon className={classes.icon} />
        </Box>
    ) : null;
};

StageWarning.propTypes = {
    stage: PropTypes.object,
    jobs: PropTypes.array,
    visibleLogsIcon: PropTypes.bool
};

export default StageWarning;
