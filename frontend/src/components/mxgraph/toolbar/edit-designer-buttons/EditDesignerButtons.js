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
import { IconButton } from '@material-ui/core';
import { Undo, Redo, Delete, Refresh } from '@material-ui/icons';
import { has } from 'lodash';

const EditDesignerButtons = ({
    data,
    graph,
    reversible,
    refresh,
    editable,
    setSidePanel,
    sidePanelIsOpen,
    setDirty
}) => (
    <>
        {editable && (
            <>
                <IconButton
                    aria-label="undoIcon"
                    onClick={() => {
                        reversible.undo();
                    }}
                >
                    <Undo />
                </IconButton>
                <IconButton
                    aria-label="redoIcon"
                    onClick={() => {
                        reversible.redo();
                    }}
                >
                    <Redo />
                </IconButton>
                <IconButton
                    aria-label="deleteIcon"
                    onClick={() => {
                        if (graph.isEnabled()) {
                            sidePanelIsOpen && setSidePanel(false);
                            const currentNodes = graph.getSelectionCells();
                            graph.removeCells(currentNodes);
                            setDirty(true);
                        }
                    }}
                >
                    <Delete />
                </IconButton>
            </>
        )}
        {has(data, 'editable') && (
            <IconButton aria-label="refreshIcon" onClick={refresh}>
                <Refresh />
            </IconButton>
        )}
    </>
);

EditDesignerButtons.propTypes = {
    setSidePanel: PropTypes.func,
    sidePanelIsOpen: PropTypes.bool,
    data: PropTypes.object,
    setDirty: PropTypes.func,
    graph: PropTypes.object,
    reversible: PropTypes.object,
    refresh: PropTypes.func,
    editable: PropTypes.bool
};

export default EditDesignerButtons;
