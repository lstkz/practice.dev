import * as React from 'react';
import styled from 'styled-components';
import { SwaggerParameter } from 'src/types';
import { Tabs, Tab } from '../Tabs';
import { Theme } from 'src/Theme';

interface SwaggerParametersProps {
  className?: string;
  parameters: SwaggerParameter[];
}

const Table = styled.table`
  width: 100%;
  border-spacing: 0;

  td {
    padding: 0;
    padding-top: 10px;
    vertical-align: top;
  }
  th {
    padding: 10px 0;
    font-weight: normal;
    border: none;
    color: ${Theme.textDark};
    border-bottom: 1px solid ${Theme.gray3};
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 25%;
    strong {
      font-weight: 500;
      color: ${Theme.textDark};
    }
  }
  th:nth-child(2),
  td:nth-child(2) {
    width: 25%;
  }
  th:nth-child(3),
  td:nth-child(3) {
    width: 50%;
  }
`;

const Required = styled.span`
  color: ${Theme.red};
  vertical-align: super;
  font-size: 10px;
`;

const _SwaggerParameters = (props: SwaggerParametersProps) => {
  const { className, parameters } = props;
  const [selectedTab, setSelectedTab] = React.useState(0);

  const renderType = (title: string, type: 'path' | 'query') => {
    const params = parameters.filter(x => x.in === type);
    if (!params.length) {
      return null;
    }
    return (
      <Tab key={type} title={title}>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {params.map(item => (
              <tr key={item.name}>
                <td>
                  <strong>{item.name}</strong>
                  {item.required && <Required> *required</Required>}
                </td>
                <td>{item.schema.type}</td>
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Tab>
    );
  };

  return (
    <div className={className}>
      <Tabs
        type="minimal"
        selectedTab={selectedTab}
        onIndexChange={setSelectedTab}
      >
        {renderType('Path', 'path')}
        {renderType('Query', 'query')}
      </Tabs>
    </div>
  );
};

export const SwaggerParameters = styled(_SwaggerParameters)`
  display: block;
`;
