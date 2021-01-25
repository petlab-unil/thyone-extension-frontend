import Styled from 'styled-components';
import {NodePlusFill} from '@styled-icons/bootstrap/NodePlusFill';
import {NodeMinusFill} from '@styled-icons/bootstrap/NodeMinusFill';
import {LinearScale} from '@styled-icons/material-outlined/LinearScale';

export const AddNodeIcon = Styled(NodePlusFill)`
    height: 43px;
    cursor: pointer;
    padding: 2px;
    position: relative;
    top: 4px;
    left: -6px;
    vertical-align: middle;
`;

export const RemoveNodeIcon = Styled(NodeMinusFill)`
    height: 43px;
    cursor: pointer;
    padding: 2px;
    position: relative;
    top: 4px;
    left: -6px;
    vertical-align: middle;
`;

export const ConnectNodeIcon = Styled(LinearScale)`
    height: 43px;
    cursor: pointer;
    padding: 2px;
    position: relative;
    top: 4px;
    left: 0px;
    vertical-align: middle;
`;

export const FlowChartGrid = Styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 100%;
    grid-row-gap: 30px;
    grid-template-rows: 150px auto;
`;

export const FlowChartSVG = Styled.div`
    width: 100%;
    height: 100%;
`;

export const FlowChartForm = Styled.div`
    width: 100%;
    height: 100%;
    border: 1px solid lightgrey;
`;

interface ActionButtonProps {
    disabled?: boolean
}

export const ActionButton = Styled.div`
    width: 60px;
    margin: 15px calc(25% / 6);
    height: 60px;
    vertical-align: text-top;
    display: inline-block;
    line-height: 50px;
    text-align: center;
    border-radius: 1000px;
    border: 1px solid lightgrey;
    ${({disabled}: ActionButtonProps) => disabled ? 'background-color: grey;' :'cursor: pointer;'}

    transition: .6s;

    &:hover {
        background-color: black;
        color: white;
    }
`;

export const LonelyActionButton = Styled.div`
    width: 50%;
    margin: 25px auto;
    height: 48px;
    display: block;
    line-height: 50px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid lightgrey;
    transition: .6s;
    cursor: pointer;

    &:hover {
        background-color: black;
        color: white;
    }
`;

export const ConnectingText = Styled.div`
    width: 50%;
    margin: 25px auto;
    height: 48px;
    display: block;
    line-height: 50px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid lightgrey;
`;

export const ActionInput = Styled.input`
    width: calc(100% - 25% / 3);
    padding: 5px;
    text-align: center;
    margin-left: calc(25% / 6);
    border: 1px solid lightgrey;
    border-radius: 3px;
`;
