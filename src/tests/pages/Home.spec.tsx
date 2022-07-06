import { fireEvent, render, screen } from '@testing-library/react'
import { useRouter } from 'next/router'
// import { mocked } from 'jest-mock'
import { useSession, signIn } from 'next-auth/react'
import { stripe } from '../../services/stripe'
import Home, { getStaticProps } from '../../pages'

jest.mock('next-auth/react')

jest.mock('next/router')

jest.mock('../../services/stripe')

describe('Home page', () => {
  
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({data: null, status: "unauthenticated"})

    render(<Home product={{priceId: 'fake', amount: '$10,00'}}/>)
  
    expect(screen.getByText('for $10,00/month')).toBeInTheDocument()
  }) 

  it('loads initial user data', async () => {
    const retrieveStripePricesMocked = jest.mocked(stripe.prices.retrieve)

    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake',
      unit_amount: 1000
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake',
            amount: '$10.00'
          }
        }
      })
    )
  })
})
