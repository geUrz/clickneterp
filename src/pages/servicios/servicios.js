import { BasicLayout } from '@/layouts'
import styles from './servicios.module.css'
import { ProtectedRoute, Title } from '@/components/Layouts'

export default function Servicios() {
  return (

    <ProtectedRoute>

      <BasicLayout relative>

        <Title title='cotizaciones' />

      </BasicLayout>

    </ProtectedRoute>

  )
}
