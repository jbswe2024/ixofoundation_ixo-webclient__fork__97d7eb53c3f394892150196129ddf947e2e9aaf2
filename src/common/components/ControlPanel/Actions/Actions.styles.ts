import styled from 'styled-components'
import { deviceWidth } from '../../../../lib/commonData'

export const ActionLinksWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  margin: 0 -0.5rem;
  width: 100%;
  > div {
    width: 50% !important;
  }
  a {
    background: #ffffff;
    border-radius: 0.75rem;
    font-weight: normal;
    font-size: 0.75rem;
    line-height: 1.2;
    display: flex;
    align-items: center;
    width: calc(100% - 1rem) !important;
    padding: 0.5rem 0.75rem;
    margin: 0.5rem;
    color: #47568c;
    transition: all 0.3s;
    border: 1px solid transparent;
    cursor: pointer;
    min-height: 2.25rem;
    svg {
      fill: #47568c;
      margin-right: 1rem;
      min-width: 0.8rem;
    }
    &:hover {
      color: #47568c;
      text-decoration: none;
      border: 1px solid ${(props: any): string => props.theme.ixoBlue};
    }
    &:focus {
      outline: none;
    }

    &.active {
      border: 1px solid ${(props: any): string => props.theme.ixoBlue};
    }
  }
`

export const AssistantContentWrapper = styled.div`
  height: 100%;
  background: white;
`

export const SummaryWrapper = styled(AssistantContentWrapper)`
  position: relative;
`

export const ActionWrapper = styled.div`
  background: #dfe7f4;
  position: absolute;
  width: 375px;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  border-right: 1px solid white;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
  border-top-left-radius: 3px;
  padding: 15px;
  transform: translateX(0);
  transition: all 0.5s;
  z-index: -1;
  overflow: hidden auto;
  &.open {
    @keyframes openSection {
      0% {
        opacity: 0;
        transform: translateX(100%);
      }
      50% {
        opacity: 0;
        transform: translateX(-20%);
      }
      75% {
        opacity: 1;
      }
      100% {
        transform: translateX(-100%);
      }
    }
    animation: openSection 1s ease;
    opacity: 1;
    transform: translateX(-100%);
  }
  &.summary {
    width: calc(200% + 60px);
    @keyframes fadeInSummary {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 0;
      }
      90% {
      }
      100% {
        opacity: 1;
      }
    }
    ${SummaryWrapper} > * {
      animation: fadeInSummary 1s ease-in-out;
    }
  }

  @media (max-width: ${deviceWidth.desktop}px) {
    background: white;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    width: 100vw;
    height: 100vh;
    transform: translateX(0);
    border-radius: 0;
    &.open {
      transform: translateX(0);
    }
    &.summary {
      width: 100vw;
    }
  }
`

export const AssistantWrapper = styled.div`
  position: fixed;
  height: calc(100% - 72px);
  background: rgb(240, 243, 249);
  width: inherit;
  display: flex;
  box-shadow: inset 0px -1px 30px 11px rgba(0, 0, 0, 0.03);
  flex-direction: column;
  .rw-conversation-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-weight: 400;
    box-shadow: none;
    padding-top: 1rem;

    .rw-message {
      display: flex;
      position: relative;
      flex-wrap: wrap;
      line-height: 1;
      padding-left: 1.5rem;
      padding-right: 1.5rem;

      .rw-response {
        color: #090C0E;
        margin-bottom: 12px;
        box-shadow: 0px 2px 15px rgba(212, 221, 232, 0.4);
        background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFD 112.49%);
        padding: 13px 15px;
        max-width: 85%;
        border-radius: 0 15px 15px 15px;
      }

      .rw-client {
        color: #fff;
        margin-bottom: 12px;
        box-shadow: 0px 2px 15px rgba(212, 221, 232, 0.4);
        background: linear-gradient(180deg, #10597B 0%, #1B6E90 93.09%);
        border-radius: 15px 0px 15px 15px;
        padding: 13px 15px;
        margin-left: auto;
        overflow-wrap: break-word;
        max-width: 85%;
      }
    }
  }
  .assistant-container {
    height: calc(100% - 30px);
  }
  .rw-messages-container {
    overflow-y: auto;
    max-height: calc(100% - 70px) !important;
    height: calc(100% - 70px) !important;
    background-color: transparent;

    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-thumb {
      background: #C1CBD0;
      border-radius: 8px;
    }

    .rw-from-response {
      display: flex;
      flex-direction: column;
    }
  }
  .rw-sender {
    margin-top: auto;
    height: 4rem;
    background: white;
    display: flex;
    align-items: center;
    padding-left: 1.5rem;
    padding-right: 1.5rem;

    .rw-send {
      outline: none;
      border: none;
      background: transparent;
      transition: 1s;
      background: #49BFE0;
      border-radius: 50%;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;

      &:disabled {
        opacity: 0;
      }
    }
    .rw-send .rw-send-icon-ready {
      fill: #125D7F;
    }
    input {
      background: white;
      border: none;
      outline: none;
      height: 100%;
      border-radius: 2.5rem;
      padding-left: 0;
      padding-right: 0;

      ::placeholder {
        color: #A5ADB0;
      }
    }
  }
  .rw-message.rw-typing-indication {
    .rw-response {
      height: 2.375rem;
    }
  }
`

export const AssistantHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  margin-top: 0.3rem;
  margin-bottom: 0.8rem;
  h3.assistant-heading {
    color: #436779;
    margin: 0;
    font-size: 18px;
  }
  .close-icon {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #FFFFFF;
    box-shadow: 0px 1px 8px rgba(0, 42, 63, 0.1);
    cursor: pointer;

    svg {
      width: 13px;
      height: 13px;
    }
  }
  .back-icon {
    transform: rotate(180deg);
  }
`

export const AssistantProgress = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h2 {
    font-size: 2.25rem;
    line-height: 1.2;
    letter-spacing: 0.3px;
    color: black;
  }
  .icon-pulse-wrapper {
    padding: 1rem;
    border-radius: 50%;
    position: relative;
    z-index: 1;
    background: white;
    @keyframes iconPulse {
      0% {
        transform: scale(1.1);
        opacity: 1;
      }
      100% {
        transform: scale(1.5);
        opacity: 0;
      }
    }
    &:after {
      content: '';
      display: block;
      position: absolute;
      z-index: -1;
      top: -1px;
      left: -1px;
      width: calc(100% + 2px);
      height: calc(100% + 2px);
      border-radius: 50%;
      border: 2px solid #dfe3e8;
      opacity: 0;
      animation-delay: 1s;
      animation: iconPulse 1s ease-in-out;
      transform-origin: center;
    }
    &.repeat:after {
      animation-delay: 0;
      animation: iconPulse 1s infinite ease-in-out;
    }
  }

  .error {
    color: firebrick;
  }

  .close-button,
  button {
    background: none;
    border: none;
    outline: none !important;
    font-weight: bold;
    font-size: 16px;
    line-height: 1.2;
    color: #a5adb0;
    text-decoration: none;
  }
`
