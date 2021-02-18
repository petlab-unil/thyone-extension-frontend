import React, {useContext} from 'react';
import Styled from 'styled-components';
import {MainContext} from '~contexts/mainContext';

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
    const {queueStatus, socket} = useContext(MainContext);
    const pairAdmin = () => {
        socket?.emit('adminPair');
    };
    return (
        <AdminContainer>
            <AdminView>ADMIN PAGE</AdminView>
            <PairAdminButton onClick={pairAdmin}>
                Pair Admin
            </PairAdminButton>
            <table>
                <tr key="___titles">
                    <th>User</th>
                    <th>Paired with</th>
                </tr>
                {queueStatus.pairs.map(([u1, u2]) => <tr key={`${u1}+${u2}`}>
                    <td>{u1}</td>
                    <td>{u2}</td>
                </tr>)}
            </table>
        </AdminContainer>
    );
};
