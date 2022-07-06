import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { getPrismicClient } from '../../services/prismic'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { useRouter } from 'next/router'


jest.mock('next-auth/react')

jest.mock('next/router')

jest.mock('../../services/stripe')

jest.mock('../../services/prismic')

const post = { slug: 'fake-post', title: 'Fake Post', content: '<p>Post content</p>', updatedAt: '10 de abril' }


describe('Post preview page', () => {
  
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({activeSubscription: null} as any)

    render(<Post post={post}/>)
  
    expect(screen.getByText('Fake Post')).toBeInTheDocument()
    expect(screen.getByText('Post content')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  }) 

  it('redirects user to full post page when user is already authenticated', async () => {
    const useSessionMocked = jest.mocked(useSession)
    const useRouterMocked = jest.mocked(useRouter)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce({data:{activeSubscription: 'fake'}, status: 'authenticated'} as any)
    useRouterMocked.mockReturnValueOnce({push: pushMock} as any)

    render(<Post post={post}/>)

    expect(pushMock).toBeCalledWith('/posts/fake-post')
  })

  it('loads initial post data', async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient)

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

    const response = await getStaticProps({
      params: { slug: 'fake-post' }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'fake-post',
            title: 'Fake Post',
            content: '<p>Post content</p>',
            updatedAt: '01 de janeiro de 2023'
          }
        }
      })
    )
  })
})
