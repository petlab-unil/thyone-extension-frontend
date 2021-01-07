import React, {useContext} from 'react';
import {MainContext} from '~contexts/mainContext';
import Styled from 'styled-components';

const ToggleButtonContainer = Styled.div`
        display: inline-block;
        height: 40px;
        cursor: pointer;
        right: 10px;
        top: 120px;
        position: fixed;
        background-color: #eeeeee;
        border: 1px solid #999;
        color: black;
        z-index: 100000;
        padding: 10px;
        border-radius: 10px;
`;

export const ToggleButton = () => {
    const {setToggled} = useContext(MainContext);

    return <ToggleButtonContainer onClick={() => setToggled(true)}>
        Toggle
    </ToggleButtonContainer>;
};
