import React from 'react';

interface FaqItem {
  slug: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const faqGroups: FaqGroup[] = [
  {
    title: 'GENERAL QUESTIONS',
    items: [
      {
        slug: 'whats-practice-dev',
        title: 'What Is practice.dev?',
        content: (
          <div>
            Practice.dev is a platform where programmers solve programming
            challenges from domains such as frontend and/or backend. All tasks
            reflect problems that you can face in real jobs.
          </div>
        ),
      },
      {
        slug: 'another-question-1',
        title: 'Another Question 1',
        content: <div>lorem ipsum 1</div>,
      },
      {
        slug: 'another-question-2',
        title: 'Another Question 2',
        content: <div>lorem ipsum 2</div>,
      },
      {
        slug: 'another-question-3',
        title: 'Another Question 3',
        content: <div>lorem ipsum 3</div>,
      },
    ],
  },
  {
    title: 'SOLUTIONS',
    items: [
      {
        slug: 'whats-the-license-for-solutions',
        title: 'What is the license for the solutions I post?',
        content: <div>lorem ipsum 1</div>,
      },
    ],
  },
  {
    title: 'OTHER QUESTIONS',
    items: [
      {
        slug: 'question-1',
        title: 'Question 1',
        content: <div>lorem ipsum 1</div>,
      },
      {
        slug: 'question-2',
        title: 'Question 2',
        content: <div>lorem ipsum 2</div>,
      },
    ],
  },
];
