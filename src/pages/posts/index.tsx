import Head from 'next/head'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { getPrismicClient } from '../../services/prismic'
import styles from './styles.module.scss'
import { asText } from '@prismicio/helpers'
import { debug } from 'console'

export type Post = {
  slug: string,
  title: string,
  excerpt: string,
  updatedAt: string
}

interface PostProps {
  posts: Post[]
}

export default function Posts({ posts }: PostProps) {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          { posts.map(post => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.getByType('post', {
    pageSize: 100
  })

  const posts = response.results.map(post => {
    const postExercpt = post.data.content.find(content => content.type === 'paragraph')
    const postExercptText = postExercpt?.text ?? '';

    const postTitleText = post.data.title[0]?.text

    return {
      slug: post.uid,
      title: postTitleText,
      excerpt: postExercptText,
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
    }
  })

  return {
    props: { posts }
  }
}