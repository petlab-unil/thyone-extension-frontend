import Styled from 'styled-components';
import {FlowMerge} from '@styled-icons/typicons/FlowMerge';
import {UserShared} from '@styled-icons/remix-line/UserShared';
import React from 'react';

interface TabComponentsProps{
    flowChartenabled?: boolean;
    chatEnabled?: boolean;
}

export const TabContainer = Styled.div`
    width: 100%;
    height: 3em;
    display: grid | inline-grid;
    grid-template-columns: 150px 150px;
    grid-column-gap: 30px;
`;

export const FlowchartButton = Styled.div`
    height: 4em;
    width: 50%;
    line-height: 46px;
    float:left;
    cursor: pointer;
    text-align: center;
    padding-bottom: 2px;
    color: ${({flowChartenabled}: TabComponentsProps) => flowChartenabled ? '#FFF' : '#8e9298'};
    background-color: #010409;
    border-top: 1px solid #010409;
    border-right: 1px solid #010409;
    border-bottom:${({flowChartenabled}: TabComponentsProps) => flowChartenabled ? '5px solid #ff6e40' : ''};
    box-shadow: ${({flowChartenabled}: TabComponentsProps) => flowChartenabled ? 'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px;' : ''};

`;

export const FlowchartIcon = Styled(FlowMerge)`
    height: 20px;
    color: ${({flowChartenabled}: TabComponentsProps) => flowChartenabled ? '#FFF' : '#8e9298'};
    cursor: pointer;
    padding: 2px;
    margin: 5px;
    align-content: center;
    position: relative;
    top: -2px;
`;

export const ChatButton = Styled.div`
    height: 4em;
    width: 50%;
    line-height: 46px;
    float:right;
    cursor: pointer;
    text-align: center;
    padding-bottom: 2px;
    color: ${({chatEnabled}: TabComponentsProps) => chatEnabled ? '#FFF' : '#8e9298'};
    background-color: #010409;
    border-left: 1px solid #010409;
    border-top: 1px solid #010409;
    border-bottom:${({chatEnabled}: TabComponentsProps) => chatEnabled ? '5px solid #ff6e40' : ''};
    box-shadow: ${({chatEnabled}: TabComponentsProps) => chatEnabled ? 'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px;' : ''};
`;

export const PeerShareIcon = Styled(UserShared)`
    height: 20px;
    color: ${({chatEnabled}: TabComponentsProps) => chatEnabled ? '#FFF' : '#8e9298'};
    cursor: pointer;
    padding: 2px;
    margin: 5px;
    position: relative;
    top: -0.5px;
`;
