import * as React from 'react';
import styled from 'styled-components';
import { SwaggerObjectType } from 'src/types';
import { Caret } from './Caret';
import { VoidLink } from '../VoidLink';
import { SwitchType } from './SwitchType';

interface ObjectTypeProps {
  className?: string;
  name?: string;
  schema: SwaggerObjectType;
  schemas: Record<string, SwaggerObjectType>;
  depth: number;
}

const Content = styled.div`
  margin-left: 6px;
`;

const Top = styled(VoidLink)`
  display: inline-flex;
  font-weight: bold;
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
  display: inline-block;
  padding-left: 3px;
  font-weight: bold;
`;

const FieldTable = styled.table`
  td {
    padding: 0px 5px 0px 10px;
    vertical-align: top;
  }
  td:first-child {
    padding-right: 20px;
    font-weight: normal;
  }
`;

export function ObjectType(props: ObjectTypeProps) {
  const { name, schema, schemas, depth } = props;
  const [isExpanded, setIsExpanded] = React.useState(depth < 2);

  if (isExpanded) {
    return (
      <>
        <Top onClick={() => setIsExpanded(!isExpanded)}>
          <Caret dir={isExpanded ? 'bottom' : 'right'} /> {name} {'{'}
        </Top>
        <Content>
          <FieldTable>
            <tbody>
              {Object.keys(schema.properties).map(key => (
                <tr key={key}>
                  <td>{key}:</td>
                  <td>
                    <SwitchType
                      depth={depth + 1}
                      schemas={schemas}
                      type={schema.properties[key]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </FieldTable>
        </Content>
        <Bottom>{'}'}</Bottom>
      </>
    );
  } else {
    return (
      <Top onClick={() => setIsExpanded(!isExpanded)}>
        <Caret dir={isExpanded ? 'bottom' : 'right'} /> {name} {'{...}'}
      </Top>
    );
  }
}
