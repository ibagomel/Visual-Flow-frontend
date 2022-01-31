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

import ReadWriteConfiguration from './read-write-configuration';
import UnionConfiguration from './union-configuration';
import EdgeConfiguration from './edge-configuration';
import JoinConfiguration from './join-configuration';
import CDCConfiguration from './cdc-configuration';
import GroupByConfiguration from './groupby-configuration';
import RemoveDuplicatesConfiguration from './remove-duplicates-configuration';
import Configuration from './configuration';
import TransformConfiguration from './transform-configuration';
import FilterConfiguration from './filter-configuration';
import CacheConfiguration from './cache-configuration';

const checkReadWriteFields = ({ name, storage, anonymousAccess }) =>
    !name || !storage || (storage === 's3' && !anonymousAccess);

const RenderJobConfiguration = ({
    configuration,
    setPanelDirty,
    graph,
    ableToEdit,
    saveCell,
    swapEdges,
    selectedStorage
}) => {
    const jobsConfigurationComponents = {
        EDGE: {
            component: EdgeConfiguration,
            props: {
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                sourceAndTarget: graph.getSelectionCell
            }
        },
        READ: {
            component: Configuration,
            props: {
                Component: ReadWriteConfiguration,
                isDisabled: state => checkReadWriteFields(state),
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph,
                selectedStorage
            }
        },
        WRITE: {
            component: Configuration,
            props: {
                Component: ReadWriteConfiguration,
                isDisabled: state => checkReadWriteFields(state),
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph,
                selectedStorage
            }
        },
        GROUP: {
            component: Configuration,
            props: {
                Component: GroupByConfiguration,
                isDisabled: state => !state.name || !state.groupingColumns,
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph
            }
        },
        REMOVE_DUPLICATES: {
            component: Configuration,
            props: {
                Component: RemoveDuplicatesConfiguration,
                isDisabled: state => !state.name || !state.keyColumns,
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph
            }
        },
        JOIN: {
            component: Configuration,
            props: {
                Component: JoinConfiguration,
                isDisabled: state => !state.name || !state.joinType,
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                swapEdges,
                graph
            }
        },
        CDC: {
            component: Configuration,
            props: {
                Component: CDCConfiguration,
                isDisabled: state => !state.name,
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                swapEdges,
                graph
            }
        },
        UNION: {
            component: Configuration,
            props: {
                Component: UnionConfiguration,
                isDisabled: state => !state.name || !state.type,
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph
            }
        },
        TRANSFORM: {
            component: Configuration,
            props: {
                Component: TransformConfiguration,
                isDisabled: state => !state.name || !state.statement,
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph
            }
        },
        FILTER: {
            component: Configuration,
            props: {
                Component: FilterConfiguration,
                isDisabled: state => !state.name || !state.condition,
                ableToEdit,
                setPanelDirty,
                configuration,
                saveCell,
                graph
            }
        },
        CACHE: {
            component: Configuration,
            props: {
                Component: CacheConfiguration,
                isDisabled: state => !state.name,
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
            jobsConfigurationComponents[configuration.operation].component;
        return (
            <Component
                {...jobsConfigurationComponents[configuration.operation].props}
            />
        );
    }

    return null;
};

RenderJobConfiguration.propTypes = {
    configuration: PropTypes.object,
    setPanelDirty: PropTypes.func,
    graph: PropTypes.object,
    ableToEdit: PropTypes.bool,
    saveCell: PropTypes.func,
    swapEdges: PropTypes.func,
    selectedStorage: PropTypes.func
};

export default RenderJobConfiguration;
