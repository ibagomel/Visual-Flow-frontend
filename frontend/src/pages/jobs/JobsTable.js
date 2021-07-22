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
import { Grid } from '@material-ui/core';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import StopOutlinedIcon from '@material-ui/icons/StopOutlined';
import PaletteOutlinedIcon from '@material-ui/icons/PaletteOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import ExportIcon from '@material-ui/icons/Publish';
import { uniq } from 'lodash';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import TitleCell from '../../components/table/TitleCell';
import DividerCell from '../../components/table/DividerCell';
import StatusCell from '../../components/table/StatusCell';
import UtilizationCell from '../../components/table/UtilizationCell';
import ActionsCell from '../../components/table/ActionsCell';
import EnhancedTable from '../../components/table/EnhancedTable';
import toggleConfirmationWindow from '../../redux/actions/modalsActions';
import {
    DRAFT,
    SUCCEEDED,
    FAILED,
    PENDING
} from '../../components/mxgraph/constants';
import {
    deleteJob,
    runJob,
    stopJob,
    copyJob,
    setJobsLastRun,
    setJobsStatus
} from '../../redux/actions/jobsActions';
import { setCurrentTablePage } from '../../redux/actions/enhancedTableActions';
import withStyles from './JobsTable.Styles';
import timeRange from '../../utils/timeRangeOptions';
import DropdownFilter from '../../components/table/DropdownFilter';
import history from '../../utils/history';
import ExportModalWindow from '../../components/export-modal-window/ExportModalWindow';

const withRunAction = (act, getActions) =>
    act.runnable ? getActions(act).slice(0, 3) : getActions(act).slice(1, 3);

const JobsTable = ({
    projectId,
    data,
    pipelines,
    remove,
    confirmationWindow,
    run,
    stop,
    copy,
    ableToEdit,
    lastRun,
    setLastRun,
    status,
    setStatus,
    setCurrentPage
}) => {
    const { t } = useTranslation();
    const classes = withStyles();
    const [showModal, setShowModal] = React.useState(false);
    const [selectedJobs, setSelectedJobs] = React.useState([]);

    const byId = id => data.find(item => item.id === id);
    const projId = projectId;

    const resolveStatus = value => ({
        value,
        label: t(`main:status.${value}`) || value
    });

    const statuses = uniq(data?.map(v => v.status)).map(resolveStatus);

    const getActions = icon => [
        [DRAFT, FAILED, SUCCEEDED].includes(icon.status)
            ? {
                  title: t('jobs:tooltip.Play'),
                  Icon: PlayArrowOutlinedIcon,
                  disable: !icon.runnable,
                  onClick: () => {
                      run(projectId, icon.id);
                  }
              }
            : {
                  title: t('jobs:tooltip.Stop'),
                  Icon: StopOutlinedIcon,
                  disable: !!icon.pipelineId,
                  onClick: () => {
                      stop(projectId, icon.id);
                  }
              },
        {
            title: t('jobs:tooltip.jobDesigner'),
            Icon: PaletteOutlinedIcon,
            onClick: () => {
                history.push(
                    `/jobs/${projectId}/${
                        icon.pipelineInstances === null
                            ? data.find(
                                  dataItem =>
                                      dataItem.name === icon.name && !icon.runnable
                              ).id
                            : icon.id
                    }`
                );
            }
        },
        {
            title: t('jobs:tooltip.Logs'),
            Icon: DescriptionOutlinedIcon,
            disable: icon.status === PENDING || !icon.startedAt,
            onClick: () =>
                history.push(
                    `/jobs/${icon.id}/logs/${projId}/${icon.name}/?backTo=jobsTable`
                )
        },
        {
            title: t('jobs:tooltip.Copy'),
            Icon: FileCopyOutlinedIcon,
            disable: !!icon.pipelineId,
            onClick: () => copy(projectId, icon.id)
        },
        {
            title: t('jobs:tooltip.Remove'),
            Icon: DeleteOutlinedIcon,
            disable: icon.pipelineInstances?.length !== 0,
            onClick: () =>
                confirmationWindow({
                    body: t('jobs:confirm.delete', { name: icon.name }),
                    callback: () => remove(projectId, [icon.id])
                })
        }
    ];

    const getGlobalActions = () => [
        {
            title: t('jobs:tooltip.Remove selected'),
            Icon: DeleteIcon,
            onClick: selected =>
                confirmationWindow({
                    body: t('jobs:confirm.delete', {
                        name: selected?.map(id => byId(id)?.name).join(', ')
                    }),
                    callback: () => remove(projectId, selected)
                })
        },
        {
            title: t('jobs:tooltip.Export selected'),
            Icon: ExportIcon,
            onClick: selected => {
                setShowModal(true);
                setSelectedJobs(selected);
            }
        }
    ];

    const filterData = () =>
        data?.filter(
            item =>
                (!status || item.status === status) &&
                (!timeRange[lastRun] ||
                    timeRange[lastRun](
                        moment(item.startedAt, 'YYYY-MM-DD HH:mm:ss').format(
                            'YYYY-MM-DD HH:mm:ss'
                        )
                    ))
        );

    return (
        <EnhancedTable
            data={filterData()}
            actions={ableToEdit ? getGlobalActions() : getGlobalActions().slice(-1)}
            orderColumns={[
                { id: 'name', name: t('main:form.Name') },
                { id: 'startedAt', name: t('jobs:lastRun') },
                { id: 'status', name: t('jobs:Status') }
            ]}
            filter={
                <>
                    <ExportModalWindow
                        display={showModal}
                        projectId={projectId}
                        selectedJobs={selectedJobs}
                        onClose={() => setShowModal(false)}
                    />
                    <Grid item className={classes.status}>
                        <DropdownFilter
                            items={statuses}
                            label={t('jobs:Status')}
                            value={status}
                            onChange={event => {
                                setStatus(event.target.value);
                                setCurrentPage(0);
                            }}
                        />
                    </Grid>
                    <Grid item className={classes.utilization}>
                        <DropdownFilter
                            items={Object.keys(timeRange).map(value => ({
                                value,
                                label: t(`jobs:timeRange.${value}`) || value
                            }))}
                            label={t('jobs:lastRun')}
                            value={lastRun}
                            onChange={event => setLastRun(event.target.value)}
                        />
                    </Grid>
                </>
            }
        >
            {({ item, checked, onClick }) => (
                <>
                    <TitleCell
                        hasInstance={item.pipelineInstances?.length !== 0}
                        checked={checked}
                        onClick={onClick}
                        title={item.name}
                        pipelineId={item.pipelineId}
                        pipelines={pipelines}
                        lastRun={item.startedAt}
                        lastFinished={item.finishedAt}
                        lastEdit={item.lastModified}
                    />

                    <DividerCell />

                    <StatusCell
                        classes={{ cell: classes.status }}
                        status={item.status}
                    />

                    <DividerCell />

                    <UtilizationCell
                        classes={{ cell: classes.utilization }}
                        cpu={item.usage?.cpu}
                        memory={item.usage?.memory}
                    />
                    <DividerCell />
                    <ActionsCell
                        actions={
                            ableToEdit
                                ? getActions(item)
                                : withRunAction(item, getActions)
                        }
                    />
                </>
            )}
        </EnhancedTable>
    );
};

JobsTable.propTypes = {
    data: PropTypes.array,
    pipelines: PropTypes.array,
    projectId: PropTypes.string,
    remove: PropTypes.func,
    run: PropTypes.func,
    stop: PropTypes.func,
    copy: PropTypes.func,
    lastRun: PropTypes.string,
    setLastRun: PropTypes.func,
    status: PropTypes.string,
    setStatus: PropTypes.func,
    confirmationWindow: PropTypes.func,
    ableToEdit: PropTypes.bool,
    setCurrentPage: PropTypes.func
};

const mapStateToProps = state => ({
    lastRun: state.pages.jobs.lastRun,
    status: state.pages.jobs.status
});

const mapDispatchToProps = {
    run: runJob,
    stop: stopJob,
    remove: deleteJob,
    copy: copyJob,
    setLastRun: setJobsLastRun,
    setStatus: setJobsStatus,
    setCurrentPage: setCurrentTablePage,
    confirmationWindow: toggleConfirmationWindow
};

export default connect(mapStateToProps, mapDispatchToProps)(JobsTable);
