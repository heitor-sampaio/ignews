import { render, screen } from '@testing-library/react'
// import { mocked } from 'jest-mock'
import { useSession } from 'next-auth/react'
import { SignInButton } from '.'

jest.mock('next-auth/react')

describe('Header component', () => {
  
  it('renders correctly when use is not authenticated', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({data: null, status: "unauthenticated"})

    render(
      <SignInButton />
    )
  
    expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument()
  })  

  it('renders correctly when use is authenticated', () => {
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: { user: { name: "John Doe", email: "John Doe"}, expires: "fake"},
      status: "authenticated"
    })

    render(<SignInButton />)
  
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })  
})

