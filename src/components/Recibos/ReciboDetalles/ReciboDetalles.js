import { IconClose, Loading } from '@/components/Layouts'
import { formatCurrency, formatDate, formatId } from '@/helpers'
import { RecibosRowHeadModal } from '../RecibosRowHead'
import { useEffect, useState } from 'react'
import { BiSolidFilePdf, BiToggleLeft, BiToggleRight } from 'react-icons/bi'
import styles from './ReciboDetalles.module.css'
import { FaCheck, FaPlus, FaTimes, FaTrash } from 'react-icons/fa'
import { map, sumBy } from 'lodash'
import { ReciboConceptos } from '../ReciboConceptos'
import { ModalForm } from '@/layouts'
import { ReciboConceptosForm } from '../ReciboConceptosForm'
import { Confirm } from 'semantic-ui-react'

export function ReciboDetalles(props) {

  const {recibos, onOpenClose} = props

  const [showForm, setShowForm] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [currentConcept, setCurrentConcept] = useState(null)

  const onOpenCloseConfirm = (concepto) => {
    setShowConfirm((prevState) => !prevState)
    setCurrentConcept(concepto.id)
  }

  const onOpenCloseForm = (concepto) => {
    setShowForm((prevState) => !prevState)
    setCurrentConcept(concepto.id)
  } 

  const handleDeleteConcept = () => {
    onDeleteConcept(currentConcept)
    setShowConfirm(false)
  }

  const [toggleIVA, setToggleIVA] = useState()

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

  const subtotal = recibos.conceptos.reduce((sum, concepto) => sum + concepto.precio * concepto.cantidad, 0)
  const iva = subtotal * 0.16
  const total = subtotal + iva

  return (
    
    <>

      <IconClose onOpenClose={onOpenClose} />

      <div className={styles.section}>

        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Cliente</h1>
              <h1>{recibos.cliente}</h1>
            </div>
            <div>
              <h1>Folio</h1>
              <h1>#{formatId(recibos.id)}</h1>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Contacto</h1>
              <h1>{recibos.cliente}</h1>
            </div>
            <div>
              <h1>Fecha</h1>
              <h1>{formatDate(recibos.createdAt)}</h1>
            </div>
          </div>
        </div> 

        <RecibosRowHeadModal rowMain/>

        <ReciboConceptos conceptos={recibos.conceptos} onOpenCloseConfirm={onOpenCloseConfirm} />

        <div className={styles.iconPlus}>
          <div onClick={onOpenCloseForm}>
            <FaPlus />
          </div>
        </div>
        
        <div className={styles.box3}>
          <div className={styles.box3_1}>
            <h1>Subtotal:</h1>
            
            {!toggleIVA ? (
              
              <div className={styles.toggleOFF} onClick={onIVA}>
                <BiToggleLeft />
                <h1>IVA:</h1>
              </div>

            ) : (
              
              <div className={styles.toggleON} onClick={onIVA}>
                <BiToggleRight />
                <h1>IVA:</h1>
              </div>

            )}

            <h1>Total:</h1>
          </div>

          <div className={styles.box3_2}>
            
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

        <div className={styles.iconPDF}>
          <div>
            <BiSolidFilePdf />
          </div>
        </div>

        <div className={styles.iconTrash}>
          <div>
            <FaTrash />
          </div>
        </div>

      </div>

      <ModalForm title='Agregar concepto' showForm={showForm} onClose={onOpenCloseForm}>
        <ReciboConceptosForm onOpenCloseForm={onOpenCloseForm} />
      </ModalForm>

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
        onCancel={onOpenCloseConfirm}
        content='¿ Estas seguro de eliminar el concepto ?'
      />
    
    </>

  )
}
