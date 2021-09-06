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
import { IconButton } from '@material-ui/core';
import { PlayArrow, Stop } from '@material-ui/icons';

const RunStopButtons = ({
    isNotRunning,
    runnable,
    run,
    stopable,
    stop,
    changesNotSaved
}) => {
    const PlayArrowColor = !runnable || changesNotSaved ? 'lightgrey' : 'green';
    const StopColor = stopable ? 'red' : 'lightgrey';
    const Tip = changesNotSaved ? 'Please save your changes to run the job' : null;
    return isNotRunning ? (
        <div title={Tip}>
            <IconButton
                disabled={!runnable || changesNotSaved}
                aria-label="playArrowIcon"
                onClick={run}
            >
                <PlayArrow htmlColor={PlayArrowColor} />
            </IconButton>
        </div>
    ) : (
        <IconButton disabled={!stopable} aria-label="stopIcon" onClick={stop}>
            <Stop htmlColor={StopColor} />
        </IconButton>
    );
};

RunStopButtons.propTypes = {
    isNotRunning: PropTypes.bool,
    runnable: PropTypes.bool,
    run: PropTypes.func,
    stop: PropTypes.func,
    stopable: PropTypes.bool,
    changesNotSaved: PropTypes.bool
};

export default RunStopButtons;
