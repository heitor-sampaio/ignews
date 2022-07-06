import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe.js'
import styles from './styles.module.scss'

export function SubscribeButton() {
  const { data } = useSession()
  const router = useRouter()
  
  async function HandleSubscribe() {
    if(!data) {
      signIn('github')
      return
    }

    if (data.activeSubscription) {
      router.push('/posts')
      return
    }

    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data

      const stripe = await getStripeJs()
      
      await stripe.redirectToCheckout({sessionId})
    } catch(err) {
      alert(err.message)
    }
    
  }

  return (
    <button type="button" className={styles.subscribeButton} onClick={HandleSubscribe}> Subscribe now </button>
  )
}