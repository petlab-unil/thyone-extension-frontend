import React, {useContext} from 'react';
import Styled from 'styled-components';
import {MainContext} from '~contexts/mainContext';

const AdminContainer = Styled.div`
    width: 100%;
    height: 100%;
`;
const PairAdminButton = Styled.div`
    height: 3em;
    width: 50%;
    line-height: 3em;
    cursor: pointer;
    text-align: center;
    padding-bottom: 2px;
    background-color: #ff8059;
    color: #fff;
    position: absolute;
    top: 150px;
    left: 100px;
    border-radius: 50px;
     &:hover {
       background-color: #ff6e40;
    }
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

const AdminTable = Styled.table`
   position: relative;
   top: 100px;
   left: 42px;
   width: 80%;
   th {
    width: calc(100% * 0.5);
    border: solid 1px #ffe7e0;
    background-color: #ffe7e0;
    color: #02040a;
   }
   td {
    border-bottom: solid 1px #ffe7e0;
   }
    th, td {
      padding: 15px;
      text-align: center;
    }
`;

const TableDesc = Styled.div`
   position: relative;
   bottom: 10px;
   left: 100px;
   font-style: oblique;
   color: #ff6f3f;
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
                Get Paired with User
            </PairAdminButton>
            <AdminTable>
                <tr><TableDesc> Current Active Users </TableDesc></tr>
                <tr key="___titles">
                    <th>User</th>
                    <th>Paired with</th>
                </tr>
                {queueStatus.pairs.map(([u1, u2]) => <tr key={`${u1}+${u2}`}>
                    <td>{u1}</td>
                    <td>{u2}</td>
                </tr>)}
            </AdminTable>
        </AdminContainer>
    );
};
