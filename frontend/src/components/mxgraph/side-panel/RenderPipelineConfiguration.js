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

import NotificationConfiguration from './notification-configuration/NotificationConfiguration';
import JobConfiguration from './job-configuration/JobConfiguration';
import Configuration from './Configuration';

const RenderPipelineConfiguration = ({
    configuration,
    setPanelDirty,
    ableToEdit,
    saveCell,
    graph
}) => {
    const pipelinesConfigurationComponents = {
        NOTIFICATION: {
            component: Configuration,
            props: {
                Component: NotificationConfiguration,
                isDisabled: state => !state.message || !state.addressees,
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph
            }
        },
        JOB: {
            component: JobConfiguration,
            props: {
                isDisabled: inputValues => !inputValues.name,
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph
            }
        }
    };

    if (configuration.operation) {
        const Component =
            pipelinesConfigurationComponents[configuration.operation].component;
        return (
            <Component
                {...pipelinesConfigurationComponents[configuration.operation].props}
            />
        );
    }

    return null;
};

RenderPipelineConfiguration.propTypes = {
    configuration: PropTypes.object,
    setPanelDirty: PropTypes.func,
    ableToEdit: PropTypes.bool,
    saveCell: PropTypes.func,
    graph: PropTypes.object
};

export default RenderPipelineConfiguration;
