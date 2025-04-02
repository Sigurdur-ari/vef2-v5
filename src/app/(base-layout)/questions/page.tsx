import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import { revalidateTag } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Spurningakerfið',
};

const query = graphql(
  /* GraphQL */ `
    query Questions {
      allQuestions {
        title
        id
        authors {
          name
        }
      }
    }
  `,
  [],
);

export default async function QuestionsPage() {
  //Ekki góð leið til, en þetta virkar í development
  revalidateTag('datocms');

  const { allQuestions } = await executeQuery(query, {});

  if (!allQuestions) {
    notFound();
  }

  return (
    <>
      <h3>Hér eru spurningarnar, endilega veldu eina til að skoða!!</h3>

      <ul>
        {allQuestions.map((question) => (
          <li key={question.id}>
            <Link href={`/questions/${question.id}`}>{question.title}</Link>
            {question.authors.length > 0
              ? ' eftir: ' + question.authors.map((author) => author.name).join(', ')
              : ''}
          </li>
        ))}
      </ul>
      <Link href="/">Til baka</Link>
    </>
  );
}
