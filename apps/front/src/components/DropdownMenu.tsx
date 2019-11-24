import styled from 'styled-components';
import { Theme } from 'src/common/Theme';

export const DropdownHeader = styled.h6`
  font-size: 0.875rem;
  display: block;
  margin-bottom: 0;
  padding: 6px 16px;
  white-space: nowrap;
  color: #c0ccda;
  margin: 0;
`;

export const DropdownItem = styled.a`
  font-weight: 400;
  display: block;
  clear: both;
  width: 100%;
  padding: 4px 16px;
  text-align: inherit;
  white-space: nowrap;
  color: #8492a6;
  border: 0;
  background-color: transparent;
  cursor: pointer;

  &:hover,
  &:focus {
    text-decoration: none;
    color: #0c66ff;
    background-color: transparent;
  }

  > i {
    font-size: 1rem;
    margin-right: 16px;
    color: ${Theme.bgPrimary};
  }
`;

export const DropdownMenu = styled.div`
  font-size: 0.875rem;
  position: absolute;
  z-index: 1000;
  top: 100%;
  left: 0;
  z-index: 10;
  float: left;
  min-width: 192px;
  margin: 2px 0 0;
  padding: 6px 0;
  list-style: none;
  text-align: left;
  color: #8492a6;
  border: 1px solid #eff2f7;
  border-radius: 8px;
  background-color: #fff;
  background-clip: padding-box;
  box-shadow: 0 0 2px rgba(31, 45, 61, 0.08);
`;

export const DropdownDivider = styled.div`
  overflow: hidden;
  height: 0;
  margin: 8px 0;
  border-top: 1px solid #eff2f7;
`;
