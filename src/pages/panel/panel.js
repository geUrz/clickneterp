import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { FaClipboard, FaFileAlt, FaFileContract, FaFileInvoice, FaFileInvoiceDollar, FaUser, FaUsers } from 'react-icons/fa'
import { BasicLayout } from '@/layouts'
import { Title } from '@/components/Layouts'
import Link from 'next/link'
import styles from './panel.module.css'

export default function Panel() {
  return (

    <ProtectedRoute>

      <BasicLayout relative>

        <Title title='panel' />

        <div className={styles.main}>
          <div className={styles.section}>
            <Link href='recibos' className={styles.boxContainer}>
              <FaFileInvoice />
              <h1>Recibos</h1>
            </Link>
            <Link href='ordenesdeservicio' className={styles.boxContainer}>
              <FaFileAlt />
              <h1>Órdenes de Servicio</h1>
            </Link>
            <Link href='cotizaciones' className={styles.boxContainer}>
              <FaFileContract />
              <h1>Cotizaciones</h1>
            </Link>
            <Link href='reportes' className={styles.boxContainer}>
              <FaClipboard />
              <h1>Reportes</h1>
            </Link>
            <Link href='cuentas' className={styles.boxContainer}>
              <FaFileInvoiceDollar />
              <h1>Cuentas</h1>
            </Link>
            <Link href='clientes' className={styles.boxContainer}>
              <FaUsers />
              <h1>Clientes</h1>
            </Link>
            <Link href='usuarios' className={styles.boxContainer}>
              <FaUser />
              <h1>Usuarios</h1>
            </Link>
          </div>
        </div>

      </BasicLayout>

    </ProtectedRoute>

  )
}
