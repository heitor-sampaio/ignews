import { fireEvent, render, screen } from '@testing-library/react'
import { useRouter } from 'next/router'
// import { mocked } from 'jest-mock'
import { useSession, signIn } from 'next-auth/react'
import { SubscribeButton } from './index'

jest.mock('next-auth/react')

jest.mock('next/router')

describe('SubscribeButton component', () => {
  
  it('renders correctly', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({data: null, status: "unauthenticated"})

    render(
      <SubscribeButton />
    )
  
    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })  

  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = jest.mocked(signIn)
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({data: null, status: "unauthenticated"})

    render(<SubscribeButton/>)

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })

  it('redirects to posts when user already has a subscription', () => {
    const useRouterMocked = jest.mocked(useRouter)
    const pushMocked = jest.fn()
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: { user: { name: "John Doe", email: "John Doe"}, expires: "fake", activeSubscription: "fake"},
      status: "authenticated"
    })

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked
    } as any)

    render(<SubscribeButton/>)

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(pushMocked).toHaveBeenCalled()
  })
})

