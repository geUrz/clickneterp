import { BasicLayout } from '@/layouts'
import styles from './clientes.module.css'
import { ClientesLista } from '@/components/Clientes'
import { ClientesRowHeadMain } from '@/components/Clientes/ClientesRowHead'
import { ProtectedRoute, Title } from '@/components/Layouts'
import { useState } from 'react'

export default function Clientes() {

  const [reload, setReload] = useState()

  const onReload = () => setReload((prevState) => !prevState)

  return (

    <ProtectedRoute>

      <BasicLayout relative onReload={onReload}>

        <Title title='Clientes' />

        <ClientesRowHeadMain rowMain />

        <ClientesLista reload={reload} onReload={onReload} />

      </BasicLayout>

    </ProtectedRoute>

  )
}
