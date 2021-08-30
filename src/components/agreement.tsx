import React, {useContext, useEffect, useState} from 'react';
import Styled from 'styled-components';
import {MainContext} from '~contexts/mainContext';
import {updateAgreement} from '~components/request';

const Background = Styled.div`
    position: fixed;
    z-index: 100001;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.4);
    font-size: 13px;
`;

const Modal = Styled.div`
    width: 1000px;
    top: 50%;
    left: 50%;
    margin-top: -350px; /* Negative half of height. */
    margin-left: -500px; /* Negative half of width. */
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

const Title = Styled.h3`
    border-bottom: 1px solid #ccc;
    padding: 1rem;
    margin: 0;
    color: #2b669a;
`;

const Header = Styled.u`
    padding: 1rem;
    margin: 0;
`;

const Content = Styled.p`
    padding: 1rem;
`;

const Red = Styled.span`
    color: #b22222;
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
    line-height: 1;
`;

interface ArgumentProps {
    hideExtension: () => void;
    agreement: boolean;
}

export const Agreement = (Props: ArgumentProps) => {
    const {userName, showExtension} = useContext(MainContext);
    const [show, setShow] = useState(false);

    useEffect(() => {
        {
            if (showExtension && !Props.agreement) setShow(true);
        }
    }, []);

    const acceptAgreement = async () => {
        await updateAgreement(userName);
        setShow(false);
    };

    const declineAgreement = () => {
        setShow(false);
        Props.hideExtension();
    };

    return show
        ? <Background>
            <Modal>
                <Title><b>CONSENT FORM A: CONSENT FORM FOR USING JUPYTERHUB IN THE COURSE BACHELOR’S ELÉMENTS DE
                    PROGRAMMATION 2021</b></Title>
                <Header><b>I . The Course</b></Header>
                <Content>As the course Elément de Programmation 2021 is going to be held online, HEC Lausanne is trying
                    to incorporate teaching practices that will help in delivering a pedagogically rich learning
                    experience to you all. For this reason, we have introduced a change in the course structure which is
                    explained in Section II.</Content>
                <Header><b>II . Conduct of The Course</b></Header>
                <Content>This year the course has been structured to give you the opportunity to receive bonus points
                    for the activities that you will do in the class (online or onsite). During the in-class exercises,
                    your activities will be assessed by us. Based on this, we will provide you with bonus points
                    (maximum of 0.5), which will be added on top of your final grades at the end of the
                    semester.
                </Content>
                <Content>When you use UNIL’s Jupyter Notebooks[1], we will collect your personal data and interaction
                    data with the notebooks.
                    <br/>
                    The personal data will include : (i) your full name , (ii) UNIL email address and (iii)
                    Jupyterhub username.
                    <br/>
                    The interaction data will include your activity events within UNIL’s Jupyter Notebooks ,
                    eg., (i) execution of cells, (ii) change in cells, (ii) adding or deleting content, (iii)
                    opening or closing of notebooks
                </Content>
                <Content>We need to process your personal and interaction data with the UNIL’s Jupyter Notebooks in
                    order to <b>identify, validate and evaluate your participation in the online in-class activities</b>.
                    This method has been adapted from <a
                        href="https://moodle.unil.ch/admin/tool/policy/viewall.php?returnurl=https%3A%2F%2Fmoodle.unil.ch%2Flogin%2Findex.php#policy-2"
                        target="_blank">Moodle’s policy of processing data</a> .
                    This data will only be used to determine your bonus points, and will not be used to determine your
                    final grades. However you should be aware that if you do not participate during the in-class
                    exercises and do not interact much with the notebooks, you may lose the opportunity to receive
                    activity bonus points.
                </Content>
                <Header><b>III. Confidentiality and Treatment of your data</b></Header>
                <Content>This data will be protected by access restriction and will be available to the Professors of
                    the course,
                    <b>Prof. Mauro Cherubini</b>, <b>Prof. Thibault Estier</b>, and <b>Dr. Alexandre Métrailler</b> in a
                    confidential and secure manner.
                    Any personally identifiable data will be deleted after the final grades have been settled for all
                    the students.
                </Content>
                <Header><b>IV. Your Rights</b></Header>
                <Content>You can exercise your rights of access, rectification, opposition, limitation or deletion of
                    your personal data by
                    contacting <b>Prof. Mauro Cherubini</b> (<a href="mailto:Mauro.Cherubini@unil.ch"
                                                                target="_blank">Mauro.Cherubini@unil.ch</a>) and <b>Prof.
                        Thibault Estier</b> (<a href="mailto:Thibault.Estier@unil.ch"
                                                target="_blank">Thibault.Estier@unil.ch</a>)
                    You can exercise these rights as long as the administrative team has data that allow you to be
                    identified after your grades have been settled.
                </Content>
                <Header><b>V. Conditions of participation in the course</b></Header>
                <Content>By signing <Red><b>(By clicking on "Yes")</b></Red> this form, you
                    certify that you have read the above information and accept it.
                    <br/>
                    You also confirm that you agree to collection of interaction data with Jupyter Notebooks for
                    administrative purposes, as mentioned in the consent form.
                    <br/>In case of decline, you will be allowed to use UNIL’s Jupyter Notebooks but without the extension.
                </Content>
                <Action>
                    <Button onClick={acceptAgreement}> Yes, I agree </Button>
                    <div style={{float:'right'}}><Button onClick={declineAgreement}> No, I do not agree </Button></div>
                </Action>
            </Modal>
        </Background>
        :
        <></>
        ;
};
