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

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';
import InputBase from '@material-ui/core/InputBase';
import { isEmpty } from 'lodash';
import history from '../../utils/history';
import { fetchProjects } from '../../redux/actions/projectsActions';
import useStyles from './SelectProject.Styles';

const SelectProject = ({ projects, getProjects, loading, projectId }) => {
    const classes = useStyles();
    useEffect(() => {
        if (isEmpty(projects)) {
            getProjects();
        }
    }, [getProjects]);

    const selectedProject = projects?.projects?.find(({ id }) => id === projectId);
    const [valueSelected, setValueSelected] = useState(selectedProject);

    useEffect(() => {
        setValueSelected(selectedProject);
    }, [selectedProject]);

    const defaultText = loading ? 'Loading...' : '';

    return (
        <Autocomplete
            id="combo-box"
            options={projects?.projects || []}
            getOptionLabel={option => option.name}
            value={valueSelected || { name: defaultText }}
            loading={loading}
            disableClearable
            onChange={(event, newValue) => {
                setValueSelected(newValue);
                history.push(`/${newValue?.id}/overview`);
            }}
            classes={{ root: classes.root }}
            renderInput={params => (
                <div ref={params.InputProps.ref} className={classes.search}>
                    <InputBase
                        {...params.inputProps}
                        placeholder="Switch projects"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput
                        }}
                        inputProps={{ 'aria-label': 'Switch projects' }}
                    />
                </div>
            )}
        />
    );
};

SelectProject.propTypes = {
    projects: PropTypes.object,
    loading: PropTypes.bool,
    getProjects: PropTypes.func,
    projectId: PropTypes.string
};

const mapStateToProps = state => ({
    projects: state.projects.data,
    loading: state.projects.loading,
    projectId: state.projects.currentProject
});

const mapDispatchToProps = {
    getProjects: fetchProjects
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectProject);
