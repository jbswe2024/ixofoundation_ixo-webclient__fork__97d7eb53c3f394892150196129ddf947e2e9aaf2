import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { deviceWidth } from '../../../../lib/commonData'

export const HeaderLink = styled(NavLink)`
	color: white;
	font-family: ${
    /* eslint-disable-line */ props => props.theme.fontRobotoCondensed
  };
	font-weight: 400;
	letter-spacing: 1px;
	text-transform: uppercase;
	border:1px solid #49bfe0;
	border-radius:3px;
	padding:5px 10px 5px;
	margin:0 10px 10px;
	font-size: 16px;

	:first-child {
		border:1px solid #49bfe0;
		font-weight: 400;
	}

	&:first-child.active {
		color: ${/* eslint-disable-line */ props => props.theme.fontBlueButtonHover};
		font-weight: 400;
	}

	transition:border 0.3s ease;

	:hover {
		text-decoration:none;
		&&{color: ${/* eslint-disable-line */ props => props.theme.fontBlue};}}
	}

	@media (min-width: ${deviceWidth.desktop}px) {
		margin: 0 10px;
		font-size: 13px;
	}
`

export const MenuHeaderContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  padding-bottom: 5px;
  :hover {
    background: #012233;
  }
`

export const MenuHeaderLink = styled(HeaderLink)`
  border: 0px solid #000000;
`

const HeaderAnchor = styled.a`
	color: white;
	font-family: ${
    /* eslint-disable-line */ props => props.theme.fontRobotoCondensed
  };
	font-size: 13px;
	font-weight: 400;
	letter-spacing: 1px;
	text-transform: uppercase;
	border-radius:3px;
	padding:5px 10px 5px;
	margin: 0 10px;

	transition:border 0.3s ease;

	:hover {
 		text-decoration:none;
 		&&{color: ${/* eslint-disable-line */ props => props.theme.fontBlue};}}
	}
`

export const MenuHeaderAnchor = styled(HeaderAnchor)`
  border: 0px solid #000000;
  padding: 5px 0px 5px;
  display: block;
  :hover {
    background: #012233;
  }

  font-size: 16px;
  margin: 3px 10px;
`

export const Main = styled.div`
  padding: 15px 20px;
  justify-content: flex-end;

  a:first-child {
    margin-right: auto;
  }

  @media (min-width: ${deviceWidth.tablet}px) {
    justify-content: flex-start;

    a:first-child {
      margin-right: inherit;
    }
  }

  a {
    text-decoration: none;
  }
`

export const IXOLogo = styled.img`
  margin-top: -6px;

  @media (min-width: 430px) {
    margin-right: 60px;
  }
`

export const NavItems = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;
  margin-right: 10px;

  @media (min-width: ${deviceWidth.desktop}px) {
    display: block;
    margin-right: 0px;
  }
`

export const Menu = styled.div`
  ${HeaderLink} {
    display: block;
  }
  @media (min-width: ${deviceWidth.desktop}px) {
    max-width: none;
    position: relative;
    top: auto;
    opacity: 1;
    right: auto;
    background: none;
    pointer-events: auto;
    ${HeaderLink} {
      display: inline;
    }
  }
`

export const MobileMenu = Menu.extend`
  &.openMenu {
    top: 64px;
    opacity: 1;
    pointer-events: auto;
  }
  transition: all 0.8s ease;
  position: absolute;
  top: -100%;
  opacity: 0;
  right: 0;
  background: #002c41;
  width: 100%;
  padding: 30px 2px 20px 30px;
  pointer-events: none;
  z-index: 1;
  border-radius: 0 0 5px 5px;
`

export const Burger = styled.div`
  position: relative;

  @media (min-width: ${deviceWidth.desktop}px) {
    display: none;
  }
  .bar1,
  .bar2,
  .bar3 {
    width: 35px;
    height: 2px;
    background-color: #fff;
    margin: 6px 0;
    transition: 0.4s;
  }
  .change .bar1 {
    transform: rotate(-45deg) translate(-6px, 6px);
    transform-origin: center;
  }
  .change .bar2 {
    opacity: 0;
  }
  .change .bar3 {
    transform: rotate(45deg) translate(-6px, -6px);
    transform-origin: center;
  }
`