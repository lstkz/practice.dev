import * as React from 'react';
import styled from 'styled-components';
import { SwaggerObjectType } from 'src/types';
import { Caret } from './Caret';
import { VoidLink } from '../VoidLink';

interface ObjectTypeProps {
  className?: string;
  name: string;
  obj: SwaggerObjectType;
}

const Content = styled.div`
  margin-left: 6px;
`;

const Top = styled(VoidLink)`
  font-weight: bold;
  display: flex;
  align-items: center;
  color: inherit;
  &:hover {
    text-decoration: none;
  }
  ${Caret} {
    margin-right: 3px;
  }
`;
const Bottom = styled.div`
  font-weight: bold;
`;

const FieldTable = styled.table`
  td {
    padding: 3px 5px 3px 10px;
  }
  td:first-child {
    padding-right: 20px;
    font-weight: normal;
    border-left: 1px solid rgb(73, 72, 62);
  }
`;

const _ObjectType = (props: ObjectTypeProps) => {
  const { className, name, obj } = props;
  const [isExpanded, setIsExpanded] = React.useState(true);
  if (isExpanded) {
    return (
      <div className={className}>
        <Top onClick={() => setIsExpanded(!isExpanded)}>
          <Caret dir={isExpanded ? 'bottom' : 'right'} /> {name} {'{'}
        </Top>
        <Content>
          <FieldTable>
            <tbody>
              {Object.keys(obj.properties).map(key => (
                <tr key={key}>
                  <td>{key}:</td>
                  <td>{obj.properties[key].type}</td>
                </tr>
              ))}
            </tbody>
          </FieldTable>
        </Content>
        <Bottom>}</Bottom>
      </div>
    );
  } else {
    return (
      <div className={className}>
        <Top onClick={() => setIsExpanded(!isExpanded)}>
          <Caret dir={isExpanded ? 'bottom' : 'right'} /> {name} {'{...}'}
        </Top>
      </div>
    );
  }
};

export const ObjectType = styled(_ObjectType)`
  display: block;
`;
