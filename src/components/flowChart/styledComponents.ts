import Styled from 'styled-components';
import {Add} from '@styled-icons/material/Add';
import {Remove} from '@styled-icons/material/Remove';
import {LinearScale} from '@styled-icons/material-outlined/LinearScale';
import {ShareBox} from '@styled-icons/remix-fill/ShareBox';

export const AddNodeIcon = Styled(Add)`
    height: 30px;
    cursor: pointer;
    color: #010409;
    padding: 2px;
    position: relative;
    top:-2px;
    left: -1px;
    vertical-align: middle;
`;

export const AddIconText = Styled.div`
    width: 20px;
    color: #010409;
    padding: 2px;
    position: relative;
    top: -7px;
    left: -7px;
`;

export const RemoveNodeIcon = Styled(Remove)`
    height: 30px;
    cursor: pointer;
    padding: 2px;
    position: relative;
    color: #010409;
    top: -2px;
    left: -1px;
    vertical-align: middle;
    ${({disabled}: ActionButtonProps) => disabled ? 'cursor: not-allowed;' :'cursor: pointer;'}
`;

export const RemoveIconText = Styled.div`
    width: 20px;
    color: #010409;
    padding: 2px;
    position: relative;
    top: -7px;
    left: -7px;
`;

export const ConnectNodeIcon = Styled(LinearScale)`
    height: 30px;
    cursor: pointer;
    padding: 2px;
    position: relative;
    color: #010409;
    top: -1px;
    left: -0.75px;
    vertical-align: middle;
    ${({disabled}: ActionButtonProps) => disabled ? 'cursor: not-allowed; pointer-events: none;' :'cursor: pointer;'}
`;

export const ConnectIconText = Styled.div`
    width: 20px;
    color: #010409;
    padding: 2px;
    position: relative;
    top: -7px;
    left: 0px;
`;

export const FlowChartGrid = Styled.div`
    width: 100%;
    height: calc(100% - 78px);
    display: grid;
    grid-template-columns: 100%;
    grid-row-gap: 30px;
    grid-template-rows: 180px auto 30px;
`;

export const FlowChartSVG = Styled.div`
    width: 100%;
    height: 100%;
`;

export const FlowChartButtonContainer = Styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 105px 105px 105px;
    grid-column-gap: 30px;
    justify-content: space-evenly;
    justify-items: center;
    align-content: space-around;
`;

export const EdgeActionButtonContainer = Styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 80px;
    row-gap: 15px;
`;

export const FlowChartForm = Styled.div`
    width: 100%;
    height: 100%;
    border: 1px solid #f8f8f8;
    display: grid;
    grid-template-row: 50% 50%;
    grid-row-gap: 15px;
    background: #f8f8f8;
`;

interface ActionButtonProps {
    disabled?: boolean
}

interface ConnectingTextProps {
    isVisible?: boolean
}

export const ActionButton = Styled.div`
    width: 30px;
    margin: 15px calc(25% / 6);
    height: 30px;
    display: inline-block;
    line-height: 30px;
    text-align: center;
    border-radius: 1000px;
    border: 1px solid lightgrey;
    ${({disabled}: ActionButtonProps) => disabled ? 'background-color: #e0e0e0; cursor: not-allowed; pointer-events: none;' :'cursor: pointer; &:hover {border: 1px solid #ff6e40;}'}
`;

export const LonelyActionButton = Styled.div`
    width: 30px;
    height: 30px;
    margin: 25px auto;
    display: block;
    line-height: 30px;
    text-align: center;
    border-radius: 1000px;
    border: 1px solid lightgrey;
    cursor: pointer;

    &:hover {
       border: 1px solid #ff6e40;
    }
`;

export const LonelyActionButtonIcon = Styled(Remove)`
    height: 30px;
    cursor: pointer;
    padding: 2px;
    position: relative;
    color: #010409;
    top: -2px;
    left: -0.5px;
    vertical-align: middle;
 `;

export const LonelyActionButtonIconText = Styled.div`
    width: 150px;
    color: #010409;
    padding: 2px;
    position: relative;
    top: -7px;
    left: -58px;
`;

export const ConnectingText = Styled.div`
    width: 50%;
    margin: -40px auto;
    height: 0px;
    display: block;
    line-height: 85px;
    text-align: center;
    border-radius: 100px;
    color: #ff6e40;
    visibility:  ${({isVisible}: ConnectingTextProps) => isVisible ? 'visible' : 'hidden'};
`;

export const ActionInput = Styled.input`
    width: calc(100% - 25% / 3);
    padding: 5px;
    text-align: center;
    margin-left: calc(25% / 6);
    border: 1px solid lightgrey;
    border-radius: 3px;
    position: relative;
    bottom: 0px;
    &:focus {
    outline: none;
    border-color: #ff6e40;
  }
  ::placeholder {
    color: #00000033;
    font-style: italic;
  }
`;

export const FlowchartShareIcon = Styled(ShareBox)`
    height: 25px;
    cursor: pointer;
    padding: 2px;
    position: relative;
    color: #010409;
    top: 0px;
    left: -0.5px;
    vertical-align: middle;
`;

export const FlowchartShareButton = Styled.button`
    width: 70%;
    position: relative;
    bottom: 30px;
    margin: auto;
    background-color: #f8f8f8;
    border: 0.5px solid lightgrey;
    border-radius: 20px;
    &:hover {
       border: 0.5px solid #ff6e40;
    }
`;

export const EdgeActionInput = Styled.input`
    width: calc(100% - 25% / 3);
    height: 50px;
    padding: 5px;
    text-align: center;
    margin-left: calc(25% / 6);
    border: 1px solid lightgrey;
    border-radius: 3px;
    position: relative;
    bottom: 0px;
    &:focus {
    outline: none;
    border-color: #ff6e40;
  }
  ::placeholder {
    color: #00000033;
    font-style: italic;
  }
`;
