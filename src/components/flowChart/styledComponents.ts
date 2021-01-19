import Styled from 'styled-components';

export const FlowChartGrid = Styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 100%;
    grid-row-gap: 30px;
    grid-template-rows: 100px auto;
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
    width: 25%;
    margin: 25px calc(25% / 6 - 4px);
    height: 48px;
    display: inline-block;
    line-height: 50px;
    text-align: center;
    border-radius: 3px;
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
