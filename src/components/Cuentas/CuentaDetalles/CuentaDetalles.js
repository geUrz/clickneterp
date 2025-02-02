import { Confirm, IconClose, Loading, ToastSuccess } from '@/components/Layouts'
import { FaCheck, FaEdit, FaPlus, FaTimes, FaTrash } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { formatCurrency, formatDateIncDet, getValueOrDefault } from '@/helpers'
import { BiSolidToggleLeft, BiSolidToggleRight } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import { CuentaConceptos } from '../CuentaConceptos'
import { CuentaPDF } from '../CuentaPDF'
import { CuentaConceptosForm } from '../CuentaConceptosForm'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, TextArea } from 'semantic-ui-react'
import { RowHeadModal } from '../RowHead'
import { CuentaConceptosEditForm } from '../CuentaConceptosEditForm'
import styles from './CuentaDetalles.module.css'
import { CuentaEditForm } from '../CuentaEditForm'

export function CuentaDetalles(props) {

  const { user, loading, cuenta, cuentaId, reload, onReload, onOpenClose, onAddConcept, onDeleteConcept, onShowConfirm, onToastSuccess, onToastSuccessMod, onToastSuccessDel, cuentaSeleccionado } = props

  const [showConcep, setShowForm] = useState(false)
  const [showEditConcep, setShowEditConcept] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [currentConcept, setCurrentConcept] = useState(null)
  const [toastSuccess, setToastSuccess] = useState(false)

  const [showEditRecibo, setShowEditRecibo] = useState(false)
  const onOpenEditCuenta = () => setShowEditRecibo((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)
  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  useEffect(() => {
    setEditNota(!!(cuenta && cuenta.nota))
  }, [cuenta?.nota])

  const onOpenCloseConfirm = (concepto) => {
    if (!concepto || !concepto.id) {
      console.error('Concepto no válido:', concepto)
      return;
    }
    setShowConfirm((prevState) => !prevState)
    setCurrentConcept(concepto.id)
  }


  const onOpenCloseConcep = (concepto) => {
    setShowForm((prevState) => !prevState)
    setCurrentConcept(concepto.id)
  }

  const onOpenCloseEditConcep = (concepto) => {
    setShowEditConcept((prevState) => !prevState)
    setCurrentConcept(concepto)
  }

  const handleDeleteConcept = () => {
    onDeleteConcept(currentConcept)
    setShowConfirm(false)
    setShowEditConcept(false)
  }

  const [toggleIVA, setToggleIVA] = useState(false)

  const onIVA = () => {
    setToggleIVA((prevState) => !prevState)
  }

  useEffect(() => {
    const savedToggleIVA = localStorage.getItem('ontoggleIVA')
    if (savedToggleIVA) {
      setToggleIVA(JSON.parse(savedToggleIVA))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ontoggleIVA', JSON.stringify(toggleIVA))
  }, [toggleIVA])

  const subtotal = (cuenta?.conceptos || []).reduce(
    (sum, concepto) => sum + concepto.precio * concepto.cantidad,
    0
  )
  const iva = subtotal * 0.16
  const total = subtotal + iva

  const [nota, setNota] = useState(cuenta?.nota || '')
  const [editNota, setEditNota] = useState(!!cuenta?.nota)

  const maxCharacters = 280

  const handleNotaChange = (e) => {
    const { value } = e.target;
    if (value.length <= maxCharacters) {
      setNota(value)
    }
  };

  const handleAddNota = async () => {
    if (!cuenta.id) {
      console.error("ID de la cuenta no disponible")
      return;
    }

    try {
      const response = await axios.put(`/api/recibos/nota`, {
        id: cuenta.id,
        notaValue: nota,
      })

      if (response.status === 200) {
        setEditNota(true)
        onReload()
      }
    } catch (error) {
      console.error('Error al actualizar la nota:', error.response?.data || error.message)
    }
  };

  useEffect(() => {
    if (cuenta?.nota !== undefined) {
      setEditNota(!!cuenta?.nota)
    }
  }, [cuenta?.nota])

  const handleDelete = async () => {
    if (!cuenta?.id) {
      console.error("Cuenta o ID no disponible")
      return;
    }

    try {
      await axios.delete(`/api/cuentas/cuentas?id=${cuenta.id}`)
      onOpenClose()
      cuentaSeleccionado(null)
      onReload()
      onToastSuccessDel()
    } catch (error) {
      console.error("Error al eliminar la cuenta:", error)
    }
  }

  if (loading) {
    return <Loading size={45} loading={1} />
  }

  return (

    <>

      <IconClose onOpenClose={onOpenClose} />

      {toastSuccess && <ToastSuccess contain='Concepto agregado exitosamente' onClose={() => setToastSuccess(false)} />}

      <div className={styles.main}>
        <div className={styles.sectionDatos}>
          <div className={styles.datos_1}>
            <div>
              <h1>Cuenta</h1>
              <h2>{getValueOrDefault(cuenta?.cuenta)}</h2>
            </div>
            <div>
              <h1>Cliente</h1>
              <h2>{getValueOrDefault(cuenta?.cliente_nombre)}</h2>
            </div>
            <div>
              <h1>Tipo</h1>
              <h2>{getValueOrDefault(cuenta?.tipo)}</h2>
            </div>
          </div>
          <div className={styles.datos_2}>
            <div>
              <h1>Folio</h1>
              <h2>{getValueOrDefault(cuenta?.folio)}</h2>
            </div>
            <div>
              <h1>Fecha</h1>
              <h2>{getValueOrDefault(formatDateIncDet(cuenta?.createdAt))}</h2>
            </div>
            <div>
              <h1>F / R</h1>
              <h2>{getValueOrDefault(cuenta?.folioref)}</h2>
            </div>
          </div>
        </div>

        <RowHeadModal rowMain />

        <CuentaConceptos conceptos={cuenta?.conceptos || []} onOpenCloseConfirm={onOpenCloseConfirm} onOpenCloseEditConcep={onOpenCloseEditConcep} handleDeleteConcept={handleDeleteConcept} />

        <div className={styles.iconPlus}>
          <div onClick={onOpenCloseConcep}>
            <FaPlus />
          </div>
        </div>

        <div className={styles.sectionTotal}>
          <div className={styles.sectionTotal_1}>
            <h1>Subtotal:</h1>

            {!toggleIVA ? (

              <div className={styles.toggleOFF}>
                <BiSolidToggleLeft onClick={onIVA} />
                <h1>IVA:</h1>
              </div>

            ) : (

              <div className={styles.toggleON}>
                <BiSolidToggleRight onClick={onIVA} />
                <h1>IVA:</h1>
              </div>

            )}

            <h1>Total:</h1>
          </div>

          <div className={styles.sectionTotal_2}>

            {!toggleIVA ? (
              <>

                <h1>-</h1>
                <h1>-</h1>

              </>
            ) : (
              <>

                <h1>${formatCurrency(subtotal)}</h1>
                <h1>${formatCurrency(iva)}</h1>

              </>
            )}

            {!toggleIVA ? (
              <h1>${formatCurrency(subtotal)}</h1>
            ) : (
              <h1>${formatCurrency(total)}</h1>
            )}

          </div>
        </div>

        <div className={styles.toggleNota}>
          <h1>Nota</h1>
        </div>

        <div className={styles.formNota}>
          <Form>
            <FormGroup>
              <FormField>
                <TextArea
                  value={nota}
                  onChange={handleNotaChange}
                  placeholder="Escribe una nota aquí..."
                />
                <div className={styles.charCount}>
                  {nota.length}/{maxCharacters}
                </div>
              </FormField>
            </FormGroup>
            <Button secondary onClick={handleAddNota}>
              {editNota ? 'Modificar nota' : 'Añadir nota'}
            </Button>
          </Form>
        </div>

        <div className={styles.iconEdit} onClick={onOpenEditCuenta}>
          <div><FaEdit /></div>
        </div>
        <div className={styles.iconDel}>
          <div><FaTrash onClick={() => setShowConfirmDel(true)} /></div>
        </div>

        <CuentaPDF cuenta={cuenta} conceptos={cuenta?.conceptos || []} />

      </div>

      <BasicModal title='modificar la cuenta' show={showEditRecibo} onClose={onOpenEditCuenta}>
        <CuentaEditForm reload={reload} onReload={onReload} cuenta={cuenta} onOpenEditCuenta={onOpenEditCuenta} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

      <BasicModal title='Agregar concepto' show={showConcep} onClose={onOpenCloseConcep}>
        <CuentaConceptosForm reload={reload} onReload={onReload} onOpenCloseConcep={onOpenCloseConcep} onAddConcept={onAddConcept} cuentaId={cuentaId?.id || []} onToastSuccess={onToastSuccess} />
      </BasicModal>

      <BasicModal title='Modificar concepto' show={showEditConcep} onClose={onOpenCloseEditConcep}>
        <CuentaConceptosEditForm
          reload={reload}
          onReload={onReload}
          conceptToEdit={currentConcept}
          onOpenCloseEditConcep={onOpenCloseEditConcep}
          onOpenCloseConfirm={onOpenCloseConfirm}
        />
      </BasicModal>

      {/* <BasicModal title='datos del cliente' show={showCliente} onClose={onOpenCloseCliente}>
        <DatosCliente
          folio={getValueOrDefault(cuenta?.cliente_folio)}
          nombre={getValueOrDefault(cuenta?.cliente_nombre)}
          cel={getValueOrDefault(cuenta?.cliente_cel)}
          direccion={getValueOrDefault(cuenta?.cliente_direccion)}
          email={getValueOrDefault(cuenta?.cliente_email)}
          onOpenCloseCliente={onOpenCloseCliente} />
      </BasicModal> */}

      <Confirm
        open={showConfirm}
        cancelButton={
          <div className={styles.iconClose}>
            <FaTimes />
          </div>
        }
        confirmButton={
          <div className={styles.iconCheck}>
            <FaCheck />
          </div>
        }
        onConfirm={handleDeleteConcept}
        onCancel={() => setShowConfirm(false)}
        onClick={() => onOpenCloseConfirm}
        content='¿ Estas seguro de eliminar el concepto ?'
      />

      <Confirm
        open={showConfirmDel}
        cancelButton={
          <div className={styles.iconClose}>
            <FaTimes />
          </div>
        }
        confirmButton={
          <div className={styles.iconCheck}>
            <FaCheck />
          </div>
        }
        onConfirm={handleDelete}
        onCancel={onOpenCloseConfirmDel}
        content='¿ Estas seguro de eliminar el cuenta ?'
      />

    </>

  )
}
