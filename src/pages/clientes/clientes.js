import { BasicLayout } from '@/layouts'
import styles from './clientes.module.css'
import { ClientesLista } from '@/components/Clientes'

export default function Clientes() {
  return (
    
    <BasicLayout relative>

      <ClientesLista />

    </BasicLayout>

  )
}
