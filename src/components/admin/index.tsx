import React from 'react';
import Styled from 'styled-components';

const AdminContainer = Styled.div`
    width: 100%;
    height: 100%;
`;
const PairAdminButton = Styled.div`
    height: 3em;
    width: 25%;
    line-height: 3em;
    cursor: pointer;
    text-align: center;
    padding-bottom: 2px;
    background-color: #ff6e40;
    color: #fff;
    position: absolute;
    top: 150px;
    left: 150px;
    border-radius: 50px;
`;

const AdminView = Styled.text`
    height: 7em;
    width: 100%;
    line-height: 4em;
    display: block;
    background: #f8f8f8;
    text-align: center;
    padding-bottom: 2px;
    color: #868686;
`;

export const AdminPage = () => {
    return (
        <AdminContainer>
            <AdminView>ADMIN PAGE</AdminView>
            <PairAdminButton>
                Pair Admin
            </PairAdminButton>
        </AdminContainer>
    );
};
