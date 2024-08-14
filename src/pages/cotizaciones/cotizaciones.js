import { BasicLayout } from '@/layouts'
import styles from './cotizaciones.module.css'
import { ProtectedRoute, Title } from '@/components/Layouts'
import { CotLista, CotRowHeadMain } from '@/components/Cotizaciones'

export default function Cotizaciones() {
  return (

    <ProtectedRoute>
    
      <BasicLayout relative>

        <Title title='cotizaciones' />

        <CotRowHeadMain rowMain />

        <CotLista />

      </BasicLayout>

    </ProtectedRoute>

  )
}
