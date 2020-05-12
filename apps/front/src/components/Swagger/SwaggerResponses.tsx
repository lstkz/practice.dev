import * as React from 'react';
import styled from 'styled-components';
import { SwaggerMethod, SchemaRef, SwaggerRefType } from 'src/types';
import { Tabs, Tab } from '../Tabs';
import { SchemaViewer } from '../SchemaViewer/SchemaViewer';
import { SwaggerContext } from './SwaggerContext';

interface SwaggerResponsesProps {
  className?: string;
  method: SwaggerMethod;
}

function getJsonSchemaResponse(
  content: Record<string, SchemaRef> | SchemaRef
): SwaggerRefType {
  if ('schema' in content) {
    return content.schema as SwaggerRefType;
  }
  const res = content['application/json'];
  if (!res) {
    throw new Error('application/json missing in response');
  }
  return res.schema;
}

const _SwaggerResponses = (props: SwaggerResponsesProps) => {
  const { className, method } = props;
  const spec = React.useContext(SwaggerContext);
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
                schemas={spec.components.schemas}
                type={getJsonSchemaResponse(res.content)}
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
