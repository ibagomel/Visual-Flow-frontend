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
import { compose } from 'redux';
import { Toolbar, Divider } from '@material-ui/core';
import mxgraph from 'mxgraph';
import { withStyles } from '@material-ui/styles';

import styles from './DesignerToolbar.Styles';
import Zoom from './zoom/Zoom';
import addPropsToChildren from '../../../utils/addPropsToChildren';

const { mxEvent, mxUndoManager } = mxgraph();

class DesignerToolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            undoManager: {}
        };
    }

    componentDidUpdate(prevProps) {
        const { graph } = this.props;
        if (prevProps.graph !== graph) {
            const undoManager = new mxUndoManager();
            const listener = (sender, event) =>
                undoManager.undoableEditHappened(event.getProperty('edit'));
            graph.getModel().addListener(mxEvent.UNDO, listener);
            graph.getView().addListener(mxEvent.UNDO, listener);
            this.setState({ undoManager });
        }
    }

    renderChildren = () => {
        const { graph, children } = this.props;
        const { undoManager: reversible } = this.state;

        return addPropsToChildren(children, { graph, reversible });
    };

    render() {
        const { graph, classes, zoom } = this.props;

        return (
            <Toolbar disableGutters className={classes.toolbar}>
                <Zoom zoom={zoom} graph={graph} />
                <Divider orientation="vertical" flexItem />
                {this.renderChildren()}
            </Toolbar>
        );
    }
}

DesignerToolbar.propTypes = {
    graph: PropTypes.object,
    classes: PropTypes.object,
    children: PropTypes.array,
    zoom: PropTypes.func
};

export default compose(withStyles(styles))(DesignerToolbar);
