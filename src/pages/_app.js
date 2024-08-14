import { AuthProvider } from '@/contexts/AuthContext'
import 'semantic-ui-css/semantic.min.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import '@/styles/globals.css'

export default function App(props) {

  const { Component, pageProps } = props

  return(
  
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>

  ) 
}