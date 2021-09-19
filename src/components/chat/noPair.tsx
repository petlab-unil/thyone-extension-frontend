import Styled from 'styled-components';
import {Warning} from '@styled-icons/typicons/Warning';

export const NoPair = Styled.div`
    height: 40px;
    line-height: 30px;
    width: 250px;
    text-align: center;
    background: #f8f8f8;
    border-radius: 100px;
    border: 2px solid #cc444b;
    position: relative;
    top: -24px;
    left: 75px;
    color: #cc444b;
    margin-top: 40px;
`;

export const NoPairIcon = Styled(Warning)`
    height: 25px;
    color: #cc444b;
    padding: 2px;
    margin: 2px;
`;
