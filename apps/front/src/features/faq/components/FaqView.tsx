import React from 'react';
import { useFaqModule } from '../module';
import styled from 'styled-components';
import { Box } from 'src/components/Box';
import { Dashboard } from 'src/components/Dashboard';
import { Container } from 'src/components/Container';
import { Breadcrumb } from 'src/components/Breadcrumb';
import { FaqIcon } from 'src/icons/FaqIcon';
import { createUrl, getRouteParams, isRoute } from 'src/common/url';
import { Link } from 'src/components/Link';
import { TwoColLayout } from 'src/components/TwoColLayout';
import { FaqMenu } from './FaqMenu';
import { getRouterState } from 'typeless-router';
import { faqGroups } from '../faqList';
import { Title } from 'src/components/Title';

const Wrapper = styled(Box)`
  width: 100%;
  padding: 0;
  overflow: scroll;

  ${TwoColLayout} {
    min-width: 800px;
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const Desc = styled.div`
  margin-top: 10px;
`;

export function FaqView() {
  useFaqModule();
  const { location } = getRouterState.useState();
  const [slug, setSlug] = React.useState<null | string>(null);

  React.useEffect(() => {
    if (location && isRoute('faq', location)) {
      setSlug(getRouteParams('faq').slug);
    }
  }, [location]);

  const item = React.useMemo(() => {
    if (slug) {
      for (const group of faqGroups) {
        for (const item of group.items) {
          if (item.slug === slug) {
            return item;
          }
        }
      }
    }
    return faqGroups[0].items[0];
  }, [slug]);

  return (
    <Dashboard>
      <Container data-test="faq-page">
        <Breadcrumb
          icon={<FaqIcon />}
          url={createUrl({ name: 'faq' })}
          root="FAQs"
        />
        <Top>
          <Title>Frequently Asked Questions</Title>
          <div>
            Can’t find what you’re looking for?{' '}
            <Link href={createUrl({ name: 'contact-us' })}>Contact us</Link>
          </div>
        </Top>
        <Wrapper>
          <TwoColLayout
            width={270}
            relative
            left={<FaqMenu slug={item.slug} />}
            right={
              <>
                <Title data-test="faq-title">{item.title}</Title>
                <Desc data-test="faq-content">{item.content}</Desc>
              </>
            }
          />
        </Wrapper>
      </Container>
    </Dashboard>
  );
}
