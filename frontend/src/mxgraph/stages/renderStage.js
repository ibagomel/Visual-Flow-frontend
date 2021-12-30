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
import ReadWriteStage from './read-stage';
import GroupByStage from './groupby-stage';
import RemoveDuplicatesStage from './remove-duplicates-stage';
import TransformStage from './transform-stage';
import FilterStage from './filter-stage';
import stageIcon from '../sidebar/stage-icon/stageIcon';

import UnionStage from './union-stage';
import JoinStage from './join-stage';
import CDCStage from './cdc-stage';
import EdgeStage from './edge-stage';
import JobStage from './job-stage';
import NotificationStage from './notification-stage';
import ContainerStage from './container-stage';
import CacheStage from './cache-stage';
import {
    READ,
    WRITE,
    UNION,
    GROUP,
    REMOVE_DUPLICATES,
    JOIN,
    CDC,
    EDGE,
    TRANSFORM,
    FILTER,
    JOB,
    NOTIFICATION,
    CONTAINER,
    CACHE
} from '../constants';

// eslint-disable-next-line complexity
const renderStage = (stage, t) => {
    // if have only stage.type (on first drag-and-drop)
    if (Object.keys(stage).length === 1) {
        return (
            <div>
                {stageIcon(stage.operation)}
                &nbsp;
                {t(`jobDesigner:palette.${stage.operation}`)}
            </div>
        );
    }

    switch (stage.operation) {
        case READ:
        case WRITE:
            return <ReadWriteStage stage={stage} />;
        case UNION:
            return <UnionStage stage={stage} />;
        case GROUP:
            return <GroupByStage stage={stage} />;
        case REMOVE_DUPLICATES:
            return <RemoveDuplicatesStage stage={stage} />;
        case JOIN:
            return <JoinStage stage={stage} />;
        case CDC:
            return <CDCStage stage={stage} />;
        case EDGE:
            return <EdgeStage stage={stage} />;
        case TRANSFORM:
            return <TransformStage stage={stage} />;
        case FILTER:
            return <FilterStage stage={stage} />;
        case JOB:
            return <JobStage stage={stage} />;
        case NOTIFICATION:
            return <NotificationStage stage={stage} />;
        case CONTAINER:
            return <ContainerStage stage={stage} />;
        case CACHE:
            return <CacheStage stage={stage} />;
        default:
            return null;
    }
};

export default renderStage;
