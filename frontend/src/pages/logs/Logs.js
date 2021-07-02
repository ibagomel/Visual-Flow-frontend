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
import { Box, Grid } from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Skeleton from '@material-ui/lab/Skeleton';

import fetchLogs from '../../redux/actions/logsActions';
import LogsList from './LogsList';
import LogsPageHeader from '../../components/logs-page-header/LogsPageHeader';
import history from '../../utils/history';

const Logs = ({
    projId,
    jobName,
    jobId,
    logs: { data, loading },
    getLogs,
    modal
}) => {
    React.useEffect(() => {
        getLogs(projId, jobId);
    }, [projId, jobId]);

    const backTo = new URLSearchParams(history.location.search).get('backTo');

    const arrowLink = () => {
        switch (backTo) {
            case 'jobsTable':
                return `/${projId}/jobs`;
            case 'JD':
                return `/jobs/${projId}/${jobId}`;
            case undefined:
                return '/';
            // backTo here is just a pipelineId
            default:
                return `/pipelines/${projId}/${backTo}`;
        }
    };

    return (
        <Box p={3}>
            <Grid container>
                {!modal && (
                    <Grid item xs={12}>
                        {loading ? (
                            <Skeleton />
                        ) : (
                            <LogsPageHeader
                                title={jobName}
                                arrowLink={arrowLink()}
                            />
                        )}
                    </Grid>
                )}
                <Grid item xs={12}>
                    {loading ? (
                        <Skeleton />
                    ) : (
                        <LogsList
                            data={data}
                            modal={modal}
                            projId={projId}
                            jobId={jobId}
                        />
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

Logs.propTypes = {
    modal: PropTypes.bool,
    projId: PropTypes.string,
    jobName: PropTypes.string,
    jobId: PropTypes.string,
    logs: PropTypes.object,
    getLogs: PropTypes.func
};

const mapStateToProps = state => ({
    logs: state.pages.logs
});

const mapDispatchToProps = {
    getLogs: fetchLogs
};

export default connect(mapStateToProps, mapDispatchToProps)(Logs);
