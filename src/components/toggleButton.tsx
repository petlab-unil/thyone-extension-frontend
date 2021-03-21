import React, {useContext} from 'react';
import {MainContext} from '~contexts/mainContext';
import Styled from 'styled-components';
import {Maximize} from'@styled-icons/feather/Maximize';

const MaximizeIcon = Styled(Maximize)`
    height: 2em;
    width: 2.15em;
    color: #fff;
    cursor: pointer;
    padding: 2px;
    stroke-width: 2px;
`;

interface ToggleButtonProps {
    notifications: boolean
}

const ToggleButtonContainer = Styled.div`
        display: inline-block;
        height: 3em;
        width: 3em;
        cursor: pointer;
        right: 10px;
        top: 120px;
        position: fixed;
        background: ${(props: ToggleButtonProps) => props.notifications ? '#ff6e40' : '#010409'};
        border: 1px solid #242038;
        color: #fff;
        z-index: 100000;
        padding: 5px;
        border-radius: 5px;
        align-items: center;
        &hover: {
            opacity: 0.5;
    };
`;

export const ToggleButton = () => {
    const {setToggled, notifications} = useContext(MainContext);

    return <ToggleButtonContainer notifications={notifications} onClick={() => setToggled(true)}>
        <MaximizeIcon/>
    </ToggleButtonContainer>;
};
