import { FaClipboard, FaFileAlt, FaFileContract, FaFileInvoice, FaFileInvoiceDollar, FaPaperclip, FaUser, FaUsers } from 'react-icons/fa'
import styles from './panel.module.css'
import { BasicLayout } from '@/layouts'
import { ProtectedRoute, Title } from '@/components/Layouts'
import Link from 'next/link'

export default function Panel() {
  return (

    <ProtectedRoute>

      <BasicLayout relative>

        <Title title='panel' />

        <div className={styles.main}>
          <div className={styles.section}>
            <Link href='tareas' className={styles.boxContainer}>
              <FaPaperclip />
              <h1>Tareas</h1>
            </Link>
            <Link href='recibos' className={styles.boxContainer}>
              <FaFileInvoice />
              <h1>Recibos</h1>
            </Link>
            <Link href='servicios' className={styles.boxContainer}>
              <FaFileAlt />
              <h1>Servicios</h1>
            </Link>
            <Link href='cotizaciones' className={styles.boxContainer}>
              <FaFileContract />
              <h1>Cotizaciones</h1>
            </Link>
            <Link href='reportes' className={styles.boxContainer}>
              <FaClipboard />
              <h1>Reportes</h1>
            </Link>
            <Link href='contabilidad' className={styles.boxContainer}>
              <FaFileInvoiceDollar />
              <h1>Contabilidad</h1>
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
