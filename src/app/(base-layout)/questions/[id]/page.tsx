import { executeQuery } from '@/lib/datocms/executeQuery';
import { graphql } from '@/lib/datocms/graphql';
import { revalidateTag } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Markdown from 'react-markdown';

export const metadata = {
  title: 'Spurningakerfið',
};

const query = graphql(
  /* GraphQL */ `
    query Question($id: ItemId!) {
      question(filter: { id: { eq: $id } }) {
        title
        flokkur {
          title
        }
        authors {
          name
          uppahaldsSpurningaflokkur {
            title
          }
        }
        spurning
      }
    }
  `,
  [],
);

export default async function QuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  //Ekki góð leið til, en þetta virkar í development
  revalidateTag('datocms');

  const { id } = await params;
  console.log(id);

  const { question } = await executeQuery(query, { variables: { id } });

  if (!question) {
    notFound();
  }

  return (
    <>
      <h3>{question.title}</h3>
      <p>Úr flokknum {question.flokkur.title}</p>
      <div>
        <h2>Spurning: </h2>
        <Markdown>{question.spurning}</Markdown>
      </div>
      <div>
        <h3>Höfundar spurningar:</h3>
        <p>{question.authors.length > 0
              ? question.authors.map((author) => author.name).join(', ')
              : 'Spurning hefur ekki höfund'}
        </p>

        <p>{question.authors.length > 0
              ? "Þeirra uppáhalds flokkar eru: " + question.authors.map((author) => author.uppahaldsSpurningaflokkur?.title).join(', ')
              : ''}</p>
      </div>
      <Link href="/questions">Til baka</Link>
    </>
  );
}
