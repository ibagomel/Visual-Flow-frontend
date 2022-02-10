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
import { useTranslation } from 'react-i18next';
import InfoModal from '../info';

const TransformerModal = props => {
    const { t } = useTranslation();
    const content = [
        {
            title: t('transformer:note.name'),
            paragraph1: t('transformer:note.value1'),
            paragraph2: t('transformer:note.value2'),
            paragraph3: t('transformer:note.value3'),
            paragraph4: `${t('transformer:note.firstText')} 
                         ${t('transformer:note.boldText')} 
                         ${t('transformer:note.lastText')}   
            `,
            link1: {
                title: t('transformer:note.value4.title'),
                link: t('transformer:note.value4.link')
            }
        },
        {
            title: t('transformer:name.name'),
            paragraph: t('transformer:name.value')
        },
        {
            title: t('transformer:output.name'),
            paragraph1: t('transformer:output.value1'),
            paragraph2: t('transformer:output.value2'),
            paragraph3: t('transformer:output.value3'),
            paragraph4: t('transformer:output.value4'),
            paragraph5: t('transformer:output.value5'),
            link2: {
                title: t('transformer:output.value6.title'),
                link: t('transformer:output.value6.link')
            },
            paragraph6: t('transformer:output.value7'),
            example1: t('transformer:output.value8'),
            paragraph7: t('transformer:output.value9'),
            example2: t('transformer:output.value10'),
            example3: t('transformer:output.value11'),
            example4: t('transformer:output.value12'),
            example5: t('transformer:output.value13'),
            example6: t('transformer:output.value14')
        }
    ];
    return <InfoModal content={content} {...props} />;
};

export default TransformerModal;
