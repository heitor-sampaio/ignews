import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import { getPrismicClient } from '../../services/prismic'
import Posts, { getStaticProps, Post } from '../../pages/posts'

jest.mock('next-auth/react')

jest.mock('next/router')

jest.mock('../../services/stripe')

jest.mock('../../services/prismic')

const posts = [
  { slug: 'fake-post', title: 'Fake Post', excerpt: 'Post excerpt', updatedAt: '10 de abril' }
] as Post[]

describe('Posts page', () => {
  
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({data: null, status: "unauthenticated"})

    render(<Posts posts={posts}/>)
  
    expect(screen.getByText('Fake Post')).toBeInTheDocument()
  }) 

  it('loads initial posts data', async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getByType: jest.fn().mockResolvedValueOnce(
        {
          results: [
            {
              uid: 'fake-post', 
              data: {
                title: [
                  {type: 'paragraph', text:'Fake Post', spans: []}
                ], 
                content: [
                  {type: 'paragraph', text: 'Post excerpt', spans: []}
                ]
              },
              last_publication_date: '04-01-2021'
            }
          ]
        }
      )
    } as any)

    const response = await getStaticProps({
      previewData: undefined
    })

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'fake-post',
              title: 'Fake Post',
              excerpt: 'Post excerpt',
              updatedAt: '01 de abril de 2021' 
            }
          ]
        }
      })
    )
  })
})
