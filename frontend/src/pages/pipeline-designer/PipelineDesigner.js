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
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { fetchPipelineById, setFields } from '../../redux/actions/mxGraphActions';
import GraphDesigner from '../../components/mxgraph/GraphDesigner';
import { PageSkeleton } from '../../components/skeleton';
import { fetchParameters } from '../../redux/actions/settingsParametersActions';
import { fetchJobs } from '../../redux/actions/jobsActions';
import { PIPELINE } from '../../components/mxgraph/constants';

const PipelineDesigner = ({
    projectId,
    pipelineId,
    loading,
    getPipeline,
    createFields,
    getParameters,
    getJobs,
    t,
    jobs
}) => {
    const isNotBlank = value =>
        value.trim() ? null : t('main:validation.notBlank');

    React.useEffect(() => {
        createFields({
            NAME: {
                label: t('pipelines:params.Name'),
                type: 'text',
                validate: isNotBlank
            }
        });

        projectId &&
            getPipeline(projectId, pipelineId) &&
            getParameters(projectId) &&
            getJobs(projectId);
    }, [projectId, pipelineId]);

    return loading || jobs.loading ? (
        <PageSkeleton />
    ) : (
        <GraphDesigner type={PIPELINE} />
    );
};

PipelineDesigner.propTypes = {
    projectId: PropTypes.string,
    pipelineId: PropTypes.string,
    loading: PropTypes.bool,
    getPipeline: PropTypes.func,
    createFields: PropTypes.func,
    getParameters: PropTypes.func,
    getJobs: PropTypes.func,
    t: PropTypes.func,
    jobs: PropTypes.object
};

const mapStateToProps = state => ({
    loading: state.mxGraph.loading,
    jobs: state.pages.jobs
});

const mapDispatchToProps = {
    getPipeline: fetchPipelineById,
    createFields: setFields,
    getParameters: fetchParameters,
    getJobs: fetchJobs
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation()(PipelineDesigner));
