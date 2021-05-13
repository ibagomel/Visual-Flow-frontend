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

import {
    Grid,
    Typography,
    Checkbox,
    TableCell,
    withStyles
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { CalendarTodayRounded, EventRounded } from '@material-ui/icons';
import styles from './PipelineTitleCell.Styles';

const PipelineTitleCell = ({
    title,
    cron,
    lastRun,
    lastFinished,
    lastEdit,
    checked,
    onClick,
    classes
}) => {
    const { t } = useTranslation();

    const formatDate = date => date && moment(date).format('YYYY-MM-DD HH:mm:ss');

    const titleCell = () => (
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
                    <span className={classes.hint}>{t('pipelines:lastRun')}: </span>
                    {formatDate(lastRun) || t('main:N/A')}
                </span>
                <span className={classes.item}>
                    <span className={classes.hint}>
                        {t('pipelines:lastFinished')}:{' '}
                    </span>
                    {formatDate(lastFinished) || t('main:N/A')}
                </span>
                <span className={classes.item}>
                    <span className={classes.hint}>{t('pipelines:lastEdit')}: </span>
                    {formatDate(lastEdit) || t('main:N/A')}
                </span>
            </Typography>
        </Grid>
    );
    return (
        <TableCell component="th" scope="row" className={classes.cell}>
            <Grid container spacing={1} className={classes.root}>
                <Grid item xs={1} classes={{ root: classes.checkbox }}>
                    <Checkbox checked={checked} onChange={onClick} />
                </Grid>
                <Grid item xs={1} classes={{ root: classes.calendarIcon }}>
                    {cron ? <EventRounded /> : <CalendarTodayRounded />}
                </Grid>
                {titleCell()}
            </Grid>
        </TableCell>
    );
};

PipelineTitleCell.propTypes = {
    title: PropTypes.string,
    lastRun: PropTypes.string,
    lastFinished: PropTypes.string,
    lastEdit: PropTypes.string,
    checked: PropTypes.bool,
    onClick: PropTypes.func,
    classes: PropTypes.object,
    cron: PropTypes.bool
};

export default withStyles(styles, { name: 'PipelineTitleCell' })(PipelineTitleCell);
