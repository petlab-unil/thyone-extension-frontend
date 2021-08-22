import React, {useContext, useEffect, useState} from 'react';
import Styled from 'styled-components';
import {MainContext} from '~contexts/mainContext';

const Background = Styled.div`
    position: fixed;
    z-index: 100001;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.4);
`;

const Modal = Styled.div`
    width: 500px;
    top: 50%;
    left: 50%;
    margin-top: -100px; /* Negative half of height. */
    margin-left: -250px; /* Negative half of width. */
    position: fixed;
    background: white;
    border: 1px solid #ccc;
    transition: 1.1s ease-out;
    box-shadow: -2rem 2rem 2rem rgba(black, 0.2);
    filter: blur(0);
    transform: scale(1);
    opacity: 1;
    visibility: visible;
`;

const Title = Styled.h2`
    border-bottom: 1px solid #ccc;
    padding: 1rem;
    margin: 0;
`;

const Content = Styled.div`
    padding: 1rem;
`;

const Action = Styled.div`
    border-top: 1px solid #ccc;
    background: #eee;
    padding: 0.5rem 1rem;
`;

const Button = Styled.button`
    border: 0;
    background: #78f89f;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    line-height: 1;
`;

interface UserSchema {
    _id: string;
    agreement: boolean;
}

export const Agreement = () => {
    const {userName} = useContext(MainContext);
    const [show, setShow] = useState(false);

    useEffect(() => {
        (async function () {
            try {
                const res = await fetchAgreement(userName);
                if (!res.agreement) setShow(true);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);

    const checkBadStatus = (res: Response) => {
        if (res.status >= 300) {
            const messages = ['Bad Request', 'Server Error'];
            const index = res.status >= 500;

            throw new Error(`${messages[Number(index)]}: ${res.status}`);
        }
    };

    const fetchAgreement = async (userName: string): Promise<UserSchema> => {
        try {
            const fetchOptions = {
                method: 'GET',
            };
            const res = await fetch(`${process.env.BACKEND_HTTP}/users/agreement/one/${userName}`, fetchOptions);
            checkBadStatus(res);
            return await res.json();
        } catch (err) {
            return err;
        }
    };

    const updateAgreement = async (userName: string): Promise<Response> => {
        try {
            const fetchOptions = {
                method: 'PUT',
            };
            const res = await fetch(`${process.env.BACKEND_HTTP}/users/agreement/update/${userName}`, fetchOptions);
            checkBadStatus(res);
            return await res.json();
        } catch (err) {
            return err;
        }
    };

    const acceptAgreement = async () => {
        await updateAgreement(userName);
        setShow(false);
    };

    return show
        ? <Background>
            <Modal>
                <Title>Modal Window</Title>
                <Content>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis deserunt corrupti,
                    ut fugit magni qui quasi nisi amet repellendus non fuga omnis a sed impedit
                    explicabo accusantium nihil doloremque consequuntur.</Content>
                <Action>
                    <Button onClick={acceptAgreement}> Accept </Button>
                </Action>
            </Modal>
        </Background>
        : <></>;
};
