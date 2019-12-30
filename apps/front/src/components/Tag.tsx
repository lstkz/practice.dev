import styled from 'styled-components';

export const Tag = styled.a`
  font-size: 80%;
  font-weight: 700;
  line-height: 1;
  display: inline-block;
  padding: 4px 8px;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  text-align: center;
  vertical-align: baseline;
  white-space: nowrap;
  border-radius: 6px;

  color: #fff;
  background-color: #273444;

  &:hover {
    cursor: pointer;
  }
`;
