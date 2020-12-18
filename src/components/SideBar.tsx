import React, {Component} from 'react';
import Styled from 'styled-components';

const SideBarContainer = Styled.div`
    width: 400px;
    height: calc(100% - 130px);
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

export class SideBar extends Component<any, any> {
    render() {
        return <SideBarContainer>Hello world</SideBarContainer>;
    }
}
