import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import { BasicLayout, BasicModal } from '@/layouts'
import { Add, Loading, Title, ToastDelete, ToastSuccess } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import axios from 'axios'
import { FaArrowDown, FaArrowUp, FaDollarSign } from 'react-icons/fa'
import { formatCurrency } from '@/helpers'
import styles from './cuentas.module.css'
import { useRouter } from 'next/router'
import { CuentaForm, CuentasLista } from '@/components/Cuentas'
import { BiSolidToggleLeft, BiSolidToggleRight } from 'react-icons/bi'

export default function Cuentas() {

  const { user, loading } = useAuth()

  const route = useRouter()

  const [reload, setReload] = useState(false)

  const onReload = () => setReload((prevState) => !prevState)

  const [openForm, setOpenForm] = useState(false)

  const onOpenCloseForm = () => setOpenForm((prevState) => !prevState)

  const [cuentas, setCuentas] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/cuentas/cuentas')
        setCuentas(res.data)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

  const [conceptosEnt, setConceptosEnt] = useState(null)

  const sumTotalPrice = () => {
    if (!conceptosEnt) return 0;
    return conceptosEnt.reduce((total, concepto) => total + (concepto.precio || 0), 0);
  }

  const totalPriceEnt = sumTotalPrice()

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/cuentas/conceptos')
        const resEnt = res.data.filter(entrada => entrada.tipo_doc === 'Entrada')
        setConceptosEnt(resEnt)
      } catch (error) {
        console.error(error)
      }
    })()
  }, [reload])

  const [conceptosSal, setConceptosSal] = useState(null)

  const sumTotalPriceSal = () => {
    if (!conceptosSal) return 0;
    return conceptosSal.reduce((total, concepto) => total + (concepto.precio || 0), 0);
  }

  const totalPriceSal = sumTotalPriceSal()

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/cuentas/conceptos')
        const resSal = res.data.filter(entrada => entrada.tipo_doc === 'Salida')
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

        <Add onOpenClose={onOpenCloseForm} />

        <Title title='Cuentas' />

        <div className={styles.mainCount}>
          <div onClick={() => route.push('/entradas')} className={styles.section}>
            <div className={styles.icon}>
              <div className={styles.icon1}>
                <FaDollarSign />
              </div>
              <div className={styles.icon2}>
                <FaArrowDown />
              </div>
              <h1>Entradas</h1>
            </div>
            <div className={styles.count}>
              {!conceptosEnt ?
                <Loading size={22} loading={3} /> :
                <h1>${formatCurrency(totalPriceEnt)}</h1>
              }
            </div>
          </div>
          <div onClick={() => route.push('/salidas')} className={styles.section}>
            <div className={styles.icon}>
              <div className={styles.icon1}>
                <FaDollarSign />
              </div>
              <div className={styles.icon2}>
                <FaArrowUp />
              </div>
              <h1>Salidas</h1>
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

      <BasicModal title='crear cuenta' show={openForm} onClose={onOpenCloseForm}>
        <CuentaForm reload={reload} onReload={onReload} onToastSuccess={onToastSuccess} onOpenCloseForm={onOpenCloseForm} />
      </BasicModal>

    </ProtectedRoute>

  )
}
