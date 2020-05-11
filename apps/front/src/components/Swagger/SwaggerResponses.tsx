import * as React from 'react';
import styled from 'styled-components';
import { SwaggerMethod } from 'src/types';
import { Tabs, Tab } from '../Tabs';
import { SchemaViewer } from '../SchemaViewer/SchemaViewer';

interface SwaggerResponsesProps {
  className?: string;
  method: SwaggerMethod;
}

const _SwaggerResponses = (props: SwaggerResponsesProps) => {
  const { className, method } = props;
  const [selectedTab, setSelectedTab] = React.useState(0);
  const codes = React.useMemo(() => {
    return Object.keys(method.responses)
      .map(x => Number(x))
      .sort((a, b) => a - b);
  }, [method]);
  return (
    <div className={className}>
      <Tabs
        type="minimal"
        selectedTab={selectedTab}
        onIndexChange={setSelectedTab}
      >
        {codes.map(code => {
          const res = method.responses[code];
          return (
            <Tab title={code.toString()}>
              {res.description}
              <SchemaViewer
                name="PasswordValues"
                obj={{
                  type: 'object',
                  required: ['password'],
                  properties: { password: { type: 'string' } },
                }}
              />
            </Tab>
          );
        })}
      </Tabs>
    </div>
  );
};

export const SwaggerResponses = styled(_SwaggerResponses)`
  display: block;
`;
