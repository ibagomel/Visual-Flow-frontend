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
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { fetchPipelineById, setFields } from '../../redux/actions/mxGraphActions';
import GraphDesigner from '../../mxgraph';
import { PageSkeleton } from '../../components/skeleton';
import { fetchParameters } from '../../redux/actions/settingsParametersActions';
import { fetchJobs } from '../../redux/actions/jobsActions';
import { PIPELINE } from '../../mxgraph/constants';

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
    const isValidName = value => {
        const reg = /^[a-z0-9]([\w\\.-]*[a-z0-9])?$/i;
        if (!value.trim()) {
            return t('main:validation.notBlank');
        }
        if (value.length < 3 || value.length > 40) {
            return t('main:validation.incorrectPipelineLength');
        }
        if (!reg.test(value)) {
            return t('main:validation.incorrectCharacters');
        }
        return null;
    };

    React.useEffect(() => {
        createFields({
            NAME: {
                label: t('pipelines:params.Name'),
                type: 'text',
                validate: isValidName
            }
        });

        projectId &&
            getPipeline(projectId, pipelineId, t) &&
            getParameters(projectId) &&
            getJobs(projectId);
    }, [projectId, pipelineId]);

    return loading || jobs.loading ? (
        <PageSkeleton />
    ) : (
        <GraphDesigner type={PIPELINE} projectId={projectId} />
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
