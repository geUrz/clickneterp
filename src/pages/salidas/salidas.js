import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { BasicLayout } from '@/layouts'
import { Add, Loading, Title, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { FaArrowDown, FaDollarSign } from 'react-icons/fa'
import { formatCurrency } from '@/helpers'
import axios from 'axios'
import { CuentasLista } from '@/components/Cuentas'
import styles from './salidas.module.css'

export default function Salidas() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [conceptosSal, setConceptosSal] = useState(null)

  const [cuentas, setCuentas] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/cuentas/cuentas')
        const resSal = res.data.filter(salida => salida.tipo === 'Salida')
        setCuentas(resSal)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

  const sumTotalPrice = () => {
    if (!conceptosSal) return 0;
    return conceptosSal.reduce((total, concepto) => total + (concepto.precio || 0), 0);
  }

  const totalPriceSal = sumTotalPrice()

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/cuentas/conceptos')
        const resSal = res.data.filter(salida => salida.tipo_doc === 'Salida')
        setConceptosSal(resSal)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

  const [toastSuccess, setToastSuccessReportes] = useState(false)
  const [toastSuccessMod, setToastSuccessReportesMod] = useState(false)
  const [toastSuccessDel, setToastSuccessReportesDel] = useState(false)

  const onToastSuccess = () => {
    setToastSuccessReportes(true)
    setTimeout(() => {
      setToastSuccessReportes(false)
    }, 3000)
  }

  const onToastSuccessMod = () => {
    setToastSuccessReportesMod(true)
    setTimeout(() => {
      setToastSuccessReportesMod(false)
    }, 3000)
  }

  const onToastSuccessDel = () => {
    setToastSuccessReportesDel(true)
    setTimeout(() => {
      setToastSuccessReportesDel(false)
    }, 3000)
  }

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <ProtectedRoute>

      <BasicLayout relative onReload={onReload}>

        {toastSuccess && <ToastSuccess contain='Creado exitosamente' onClose={() => setToastSuccessReportes(false)} />}

        {toastSuccessMod && <ToastSuccess contain='Modificado exitosamente' onClose={() => setToastSuccessReportesMod(false)} />}

        {toastSuccessDel && <ToastDelete contain='Eliminado exitosamente' onClose={() => setToastSuccessReportesDel(false)} />}

        <Title title='salidas' iconBack />

        <Add onOpenClose={onOpenCloseForm} />

        <div className={styles.mainCount}>
          <div className={styles.section}>
            <div className={styles.icon}>
              <div className={styles.icon1}>
                <FaDollarSign />
              </div>
              <div className={styles.icon2}>
                <FaArrowDown />
              </div>
            </div>
            <div className={styles.count}>
              {!conceptosSal ?
                <Loading size={22} loading={3} /> :
                <h1>${formatCurrency(totalPriceSal)}</h1>
              }
            </div>
          </div>
        </div>

        <CuentasLista user={user} loading={loading} reload={reload} onReload={onReload} cuentas={cuentas} setCuentas={setCuentas} onToastSuccessMod={onToastSuccessMod} onToastSuccess={onToastSuccess} onToastSuccessDel={onToastSuccessDel} />

      </BasicLayout>

    </ProtectedRoute>

  )
}
