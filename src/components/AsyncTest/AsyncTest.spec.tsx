import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { AsyncTest } from '.'

test('renders correctly', async () => {
  render(<AsyncTest/>)
  
  expect(screen.getByText('Hello World')).toBeInTheDocument()
  expect(await screen.findByText('Button')).toBeInTheDocument() // apenas para render de componentes

  await waitFor(() => { // para qualquer tipo de resposta
    return expect(screen.getByText('Button')).toBeInTheDocument()
  })

  // await waitForElementToBeRemoved(screen.queryByText('Button')) // aguarda um elemento ser removido da tela
})