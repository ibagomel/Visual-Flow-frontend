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
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { storages } from '../../side-panel/read-write-configuration/ReadWriteConfiguration';

import stageIcon from '../../sidebar/palette/stageIcon';
import useStyles from './ReadWriteStage.Styles';

const ReadWriteStage = ({ stage, t }) => {
    const classes = useStyles();

    const renderStorageData = () => {
        switch (stage.storage) {
            case 'DB2':
                return (
                    <>
                        <Typography
                            variant="caption"
                            component="div"
                            className={classes.schema}
                            color="textSecondary"
                        >
                            {t('jobDesigner:readConfiguration.Schema')}:{' '}
                            {stage.schema}
                        </Typography>
                        <Typography
                            variant="caption"
                            component="div"
                            className={classes.table}
                            color="textSecondary"
                        >
                            {t('jobDesigner:readConfiguration.Table')}: {stage.table}
                        </Typography>
                    </>
                );
            case 'cos':
                return (
                    <>
                        <Typography
                            variant="caption"
                            component="div"
                            className={classes.bucket}
                            color="textSecondary"
                        >
                            {t('jobDesigner:readConfiguration.Bucket')}:{' '}
                            {stage.bucket}
                        </Typography>
                        <Typography
                            variant="caption"
                            component="div"
                            className={classes.pathInBucket}
                            color="textSecondary"
                        >
                            {t('jobDesigner:Path')}: {stage.path}
                        </Typography>
                    </>
                );
            case 'elastic':
                return (
                    <>
                        <Typography
                            variant="caption"
                            component="div"
                            className={classes.bucket}
                            color="textSecondary"
                        >
                            {t('jobDesigner:readConfiguration.Index')}: {stage.index}
                        </Typography>
                    </>
                );
            case 'STDOUT':
                return null;
            default:
                throw new Error(`Unsupported storage: ${stage.storage}`);
        }
    };
    return (
        <div className={classes.root}>
            <Typography variant="body2" component="div" className={classes.name}>
                {stageIcon(stage.operation)}
                {stage.name}
            </Typography>
            {stage.storage && renderStorageData()}
            <Typography
                variant="caption"
                component="div"
                className={classes.storage}
            >
                {storages.find(({ value }) => value === stage.storage)?.label}
            </Typography>
        </div>
    );
};

ReadWriteStage.propTypes = {
    t: PropTypes.func,
    stage: PropTypes.object
};

export default withTranslation()(ReadWriteStage);
