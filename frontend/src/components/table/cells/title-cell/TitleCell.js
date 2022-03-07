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

import {
    Checkbox,
    Typography,
    TableCell,
    Tooltip,
    withStyles,
    Grid
} from '@material-ui/core';
import TimelineIcon from '@material-ui/icons/Timeline';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import styles from './TitleCell.Styles';
import { DATE_FORMAT_UTC } from '../../../../globalConstants';

const NA = 'filters:N/A';

const TitleCell = ({
    hasInstance,
    title,
    pipelineId,
    pipelines,
    lastRun,
    lastFinished,
    lastEdit,
    checked,
    onClick,
    classes
}) => {
    const { t } = useTranslation();

    const formatDate = date =>
        date && moment(date, DATE_FORMAT_UTC).format(DATE_FORMAT_UTC);

    return (
        <TableCell component="th" scope="row" className={classes.cell}>
            <Grid container spacing={1} className={classes.root}>
                <Grid item xs={1} classes={{ root: classes.checkbox }}>
                    <Checkbox
                        disabled={hasInstance}
                        checked={checked}
                        onChange={onClick}
                    />
                </Grid>
                <Grid item xs={1} classes={{ root: classes.pipelineIcon }}>
                    {!!pipelineId && (
                        <Tooltip
                            title={
                                pipelines?.find(item => item.id === pipelineId)
                                    ?.name || ''
                            }
                            arrow
                        >
                            <TimelineIcon />
                        </Tooltip>
                    )}
                </Grid>
                <Grid item xs={10}>
                    <Typography variant="h5" className={classes.title}>
                        {title}
                    </Typography>
                    <Typography
                        component="div"
                        variant="body2"
                        color="textSecondary"
                        className={classes.subtitle}
                    >
                        <span className={classes.item}>
                            <span className={classes.hint}>
                                {t('filters:lastRun')}:{' '}
                            </span>
                            {formatDate(lastRun) || t(NA)}
                        </span>
                        <span className={classes.item}>
                            <span className={classes.hint}>
                                {t('filters:lastFinished')}:{' '}
                            </span>
                            {formatDate(lastFinished) || t(NA)}
                        </span>
                        <span className={classes.item}>
                            <span className={classes.hint}>
                                {t('filters:lastEdit')}:{' '}
                            </span>
                            {formatDate(lastEdit) || t(NA)}
                        </span>
                    </Typography>
                </Grid>
            </Grid>
        </TableCell>
    );
};

TitleCell.propTypes = {
    hasInstance: PropTypes.bool,
    title: PropTypes.string,
    pipelines: PropTypes.array,
    lastRun: PropTypes.string,
    lastFinished: PropTypes.string,
    lastEdit: PropTypes.string,
    checked: PropTypes.bool,
    onClick: PropTypes.func,
    classes: PropTypes.object,
    pipelineId: PropTypes.string
};

export default withStyles(styles, { name: 'CellTitle' })(TitleCell);
