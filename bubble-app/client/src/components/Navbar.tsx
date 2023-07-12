import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
    background: black;
    height: 30px;
    display: flex;
    justify-content: space-between;
    padding: 0.2rem calc((100vw - 1000px) / 2);
    z-index: 12;
`;

const NavLink = styled(Link)`
    color: white;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;
    &.active {
        color: #4d4dff;
    }
`;

const Bars = styled.div`
  display: none;
  color: #808080;
  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 75%);
    font-size: 1.8rem;
    cursor: pointer;
`;
 
const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-right: -24px;
  /* Second Nav */
  /* margin-right: 24px; */
  /* Third Nav */
  /* width: 100vw;
white-space: nowrap; */
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Navbar = () => {
    return (
        <>
            <Nav>
                <NavMenu>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/custom">Custom Algorithm</NavLink>
                    <NavLink to="/yolo2">YOLO2</NavLink>
                    <NavLink to="/yolo3">YOLO3</NavLink>
                </NavMenu>
            </Nav>
        </>
    )
}

export default Navbar;