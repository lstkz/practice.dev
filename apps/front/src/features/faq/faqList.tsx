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
        title: 'What is practice.dev?',
        content: (
          <div>
            Practice.dev is a platform where programmers solve programming
            challenges from domains such as frontend and/or backend. All tasks
            reflect problems that you can face in real jobs.
          </div>
        ),
      },
      {
        slug: 'what-are-challenges',
        title: 'What are challenges?',
        content: (
          <div>
            A challenge is a short programming task, where a developer focuses
            only on a particular area. Challenges very often can be solved in a
            single file or a component.
            <br />
            We recommend solving challenges if you need to practice solving new
            problems or testing a new framework or a library.
          </div>
        ),
      },
      {
        slug: 'what-are-projects',
        title: 'What are projects?',
        content: (
          <div>
            A project is a fully functional application. Projects usually are
            split into many iterations, where each iteration adds new
            functionality. Projects require proper architecture because they
            consist of many files.
            <br /> We recommend solving projects if you need example projects to
            your portfolio.
          </div>
        ),
      },
    ],
  },
  {
    title: 'SOLVING CHALLENGES',
    items: [
      {
        slug: 'how-to-test-localhost-solution',
        title: 'How to test a localhost solution?',
        content: (
          <div>
            If you want to test your solution from the localhost directly, we
            recommend using{' '}
            <a href="https://ngrok.com/" target="_blank">
              ngrok.com
            </a>
            . However, ngrok has a slow bandwidth, and it can cause timeouts. We
            recommend building your application to production mode and using a
            proper region in ngrok (<code>--region</code> option).
          </div>
        ),
      },
      {
        slug: 'is-it-required-to-reuse-html-or-css-code',
        title: 'Is it required to reuse HTML or CSS code?',
        content: (
          <div>
            We recommended you reuse the provided code, but it's not required.{' '}
            <br />
            It's only required to provide the correct <code>
              data-test
            </code>{' '}
            attributes on HTML elements. <br />
            Also, it's required to use the correct tags for form elements:{' '}
            <code>{'input'}</code>, <code>{'textarea'}</code>,{' '}
            <code>{'select'}</code>.
          </div>
        ),
      },
      {
        slug: 'can-i-use-inline-styles',
        title: 'Can I use inline styles?',
        content: <div>Yes, feel free to refactor the provided CSS file.</div>,
      },
    ],
  },
  {
    title: 'SOLUTIONS',
    items: [
      {
        slug: 'what-are-solutions',
        title: 'What are solutions?',
        content: (
          <div>
            People can create solutions to demonstrate the approach and show how
            they solve the given problem.
            <br />
            All solutions contain GitHub/codesandbox link where you can view the
            full code.
          </div>
        ),
      },
      {
        slug: 'whats-the-license-for-solutions',
        title: 'What is the license for the solutions I post?',
        content: (
          <div>
            Any code snippets on practice.dev are distributed under the terms of{' '}
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
            >
              CC BY-SA 4.0
            </a>
            .<br />
            Your GitHub/codesandbox link must define the proper licence for your
            code.
          </div>
        ),
      },
    ],
  },
  {
    title: 'TESTING',
    items: [
      {
        slug: 'testing-environment',
        title: 'Testing environment',
        content: <div>Testing is based on Chromium 83.0.4103.0.</div>,
      },
    ],
  },
  {
    title: 'TUTORIALS',
    items: [
      {
        slug: 'solving-counter-on-codesandbox',
        title: 'Solving counter on codesandbox.io',
        content: (
          <div>
            The below video demonstrates how to solve the Counter challenge on{' '}
            <a href="https://codesandbox.io/" target="_blank">
              https://codesandbox.io/
            </a>
            .
            <video
              style={{ width: '100%', height: 400, outline: 'none' }}
              src={
                'https://practice.dev/assets/cs-demo.712d7df0d4e7d529a98cb7538622f07a.mp4'
              }
              controls
            ></video>
          </div>
        ),
      },
      {
        slug: 'solving-counter-on-localhost',
        title: 'Solving counter on localhost',
        content: (
          <div>
            The below video demonstrates how to solve the Counter challenge on{' '}
            localhost using{' '}
            <a href="https://ngrok.com/" target="_blank">
              https://ngrok.com/
            </a>
            .
            <br />
            The template is based on{' '}
            <a
              href="https://github.com/facebook/create-react-app"
              target="_blank"
            >
              https://github.com/facebook/create-react-app
            </a>
            .
            <video
              style={{ width: '100%', height: 400, outline: 'none' }}
              src={
                'https://practice.dev/assets/localhost-demo.181a756821fd1eb717ee3cfd2fbbb0d8.mp4'
              }
              controls
            ></video>
          </div>
        ),
      },
    ],
  },
];
