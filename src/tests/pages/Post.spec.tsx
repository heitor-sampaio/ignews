import { render, screen } from '@testing-library/react'
import { getSession } from 'next-auth/react'
import { getPrismicClient } from '../../services/prismic'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'


jest.mock('next-auth/react')

jest.mock('next/router')

jest.mock('../../services/stripe')

jest.mock('../../services/prismic')

const post = { slug: 'fake-post', title: 'Fake Post', content: '<p>Post content</p>', updatedAt: '10 de abril' }


describe('Post page', () => {
  
  it('renders correctly', () => {
    render(<Post post={post}/>)
  
    expect(screen.getByText('Fake Post')).toBeInTheDocument()
    expect(screen.getByText('Post content')).toBeInTheDocument()
  }) 

  it('redirects user if no subscription was found', async () => {
    const getSessionMocked = jest.mocked(getSession)

    getSessionMocked.mockReturnValueOnce({activeSubscription: null} as any)

    const response = await getServerSideProps({ params: { slug: 'fake-post' } } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: {
          destination: '/',
          permanent: false
        }
      })
    )
  })

  it('loads initial post data', async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient)
    const getSessionMocked = jest.mocked(getSession)

    getSessionMocked.mockReturnValueOnce({activeSubscription: 'fake'} as any)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce(
        {
          data: {
              title: [
                {type: 'paragraph', text: 'Fake Post', spans: []}
              ], 
              content: [
                {type: 'paragraph', text: 'Post content', spans: []}
              ]
          },
          last_publication_date: '01-01-2023'
        }
      )
    } as any)

    const response = await getServerSideProps({
      params: { slug: 'fake-post' }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'fake-post',
            title: 'Fake Post',
            content: 'Post content',
            updatedAt: '01 de janeiro de 2023'
          }
        }
      })
    )
  })
})
