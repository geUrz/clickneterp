import { Confirm, IconClose, ToastSuccess } from '@/components/Layouts'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { formatCurrency, genRECId } from '@/helpers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { FaCheck, FaPlus, FaTimes } from 'react-icons/fa'
import { RowHeadModal } from '../RowHead'
import { BiSolidToggleLeft, BiSolidToggleRight } from 'react-icons/bi'
import { ClienteForm } from '@/components/Clientes'
import styles from './ReciboForm.module.css'
import { BasicModal } from '@/layouts'
import { ConceptosForm } from '../ConceptosForm'
import { ConceptosEditForm } from '../ConceptosEditForm'

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CotizacionesDB', 1)

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings')
      }
    }

    request.onsuccess = (e) => resolve(e.target.result)
    request.onerror = (e) => reject(e.target.error)
  })
}

const saveToggleIVA = async (value) => {
  const db = await openDB()
  const transaction = db.transaction('settings', 'readwrite')
  const store = transaction.objectStore('settings')
  
  store.put({ toggleIVA: value }, 'toggleIVA')
  
  transaction.oncomplete = () => {
  }
  transaction.onerror = (e) => {
  }
}


const getToggleIVA = async () => {
  const db = await openDB()
  const transaction = db.transaction('settings', 'readonly')
  const store = transaction.objectStore('settings')
  
  return new Promise((resolve, reject) => {
    const request = store.get('toggleIVA')
    request.onsuccess = (e) => {
      resolve(e.target.result?.toggleIVA || false)
    }
    request.onerror = (e) => {
      reject(e.target.error)
    }
  })
}

export function ReciboForm(props) {

  const { reload, onReload, onOpenCloseForm, onToastSuccess } = props

  const { user } = useAuth()

  const [showConfirm, setShowConfirm] = useState(false)

  const [toggle, setToggle] = useState(false)

  const onToggle = () => setToggle((prevState) => !prevState)

  const [show, setShow] = useState(false)

  const onOpenCloseClienteForm = () => setShow((prevState) => !prevState)

  const [showConcep, setShowForm] = useState(false)
  const onOpenCloseConcep = () => setShowForm((prevState) => !prevState)

  const [showEditConcep, setShowEditConcep] = useState(null)
  const [conceptoEdit, setConceptoEdit] = useState(null)
  const [conceptoAEliminar, setConceptoAEliminar] = useState(null)

  const onOpenEditConcep = (index) => {
    setConceptoEdit(conceptos[index])
    setShowEditConcep(true)
  }

  const onCloseEditConcep = () => {
    setConceptoEdit(null)
    setShowEditConcep(false)
  }

  const onOpenCloseConfirm = (index) => {
    setConceptoAEliminar(index)
    setShowConfirm(true)
  }

  const onHideConfirm = () => {
    setConceptoAEliminar(null)
    setShowConfirm(false)
  }

  const [toastSuccessCliente, setToastSuccessCliente] = useState(false)

  const onToastSuccessCliente = () => {
    setToastSuccessCliente(true)
    setTimeout(() => {
      setToastSuccessCliente(false)
    }, 3000)
  }

  const [clientes, setClientes] = useState([])
  const [cliente_id, setCliente] = useState('')
  const [cotizacion, setCotizacion] = useState('')
  const [cotizaciones, setCotizaciones] = useState([])
  const [recibo, setRecibo] = useState('')
  const [conceptos, setConceptos] = useState([])
  const [nuevoConcepto, setNuevoConcepto] = useState({
    tipo: '',
    concepto: '',
    precio: '',
    cantidad: ''
  })
  
  const [toggleIVA, setToggleIVA] = useState(false)
    
    useEffect(() => {
      const fetchToggleIVA = async () => {
        const storedToggleIVA = await getToggleIVA()
        setToggleIVA(storedToggleIVA)
      }
      fetchToggleIVA()
    }, [])  
  
    const onIVA = () => {
      setToggleIVA(prevState => {
        const newState = !prevState;
        saveToggleIVA(newState) 
        return newState;
      })
    }
    
    const [ivaValue, setIvaValue] = useState(16)

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!cliente_id) {
      newErrors.cliente_id = 'El campo es requerido'
    }

    if (!recibo) {
      newErrors.recibo = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const fetchClientes = async () => {
    if (user && user.id) {
      try {
        const res = await axios.get('/api/clientes/clientes')
        setClientes(res.data)
      } catch (error) {
        console.error('Error al obtener los clientes:', error)
      }
    }
  }

  useEffect(() => {
    fetchClientes()
  }, [reload, user])

  const crearRecibo = async (e) => {
    e.preventDefault()

    if (!validarForm()) {
      return
    }

    const folio = genRECId(4)

    const folioRef = cotizaciones.find(cot => cot.id === cotizacion)?.folio || null

    try {
      const res = await axios.post('/api/recibos/recibos', {
        usuario_id: user.id,
        folio,
        cliente_id,
        recibo,
        folioref: folioRef,
        iva: ivaValue
      })
      const reciboId = res.data.id
      await Promise.all(conceptos.map(concepto =>
        axios.post('/api/recibos/conceptos', {
          recibo_id: reciboId,
          tipo: concepto.tipo,
          concepto: concepto.concepto,
          precio: concepto.precio,
          cantidad: concepto.cantidad,
          total: concepto.total
        })
      ))

      await axios.post('/api/notificaciones', 
        {
          title: 'Recibo creado',
          body: `${recibo}`,
          url: '/recibos' 
        },
        {
          headers: {
            'Content-Type': 'application/json', 
          },
        }
      )

      setRecibo('')
      setCliente('')
      setConceptos([])
      setCotizacion(null)

      onReload()
      onOpenCloseForm()
      onToastSuccess()
    } catch (error) {
      console.error('Error al crear el recibo:', error)

    }
  }

  const añadirConcepto = (concepto) => {
    const total = concepto.precio * concepto.cantidad
    setConceptos([...conceptos, { ...concepto, total }])
  }

  const eliminarConcepto = () => {
    const nuevosConceptos = conceptos.filter((_, i) => i !== conceptoAEliminar)
    setConceptos(nuevosConceptos)
    setShowConfirm(false)
  }

  useEffect(() => {
    const fetchCotizaciones = async () => {
      try {
        const res = await axios.get('/api/cotizaciones/cotizaciones')
        setCotizaciones(res.data)

      } catch (error) {
        console.error('Error al obtener las cotizaciones:', error)
      }
    };
    fetchCotizaciones()
  }, [])

  // Consultar los conceptos de la cotización seleccionada
  useEffect(() => {
    if (cotizacion) {
      const fetchConceptos = async () => {
        try {
          const response = await axios.get(`/api/cotizaciones/conceptos?cotizacion_id=${cotizacion}`);
          setConceptos(response.data);
          // Aquí puedes mapear los conceptos y rellenar los campos, si es necesario

          setNuevoConcepto({
            tipo: '',
            concepto: '',
            precio: '',
            cantidad: ''
          })

          const cotizacionResponse = await axios.get(`/api/cotizaciones/cotizaciones?id=${cotizacion}`);
          setRecibo(cotizacionResponse.data?.cotizacion || '')



        } catch (error) {
          console.error('Error al obtener los conceptos:', error);
        }
      };
      fetchConceptos();
    }
  }, [cotizacion])

  const calcularTotales = () => {
    const subtotal = conceptos.reduce((acc, curr) => acc + curr.cantidad * curr.precio, 0)
    const ivaDecimal = ivaValue / 100
    const iva = subtotal * ivaDecimal
    const total = subtotal + iva
    return { subtotal, iva, total }
  }

  const { subtotal, iva, total } = calcularTotales()

  const handleIvaChange = (e) => {
    let value = e.target.value
    if (/^\d{0,2}$/.test(value)) setIvaValue(value)
  }

  return (

    <>

      <IconClose onOpenClose={onOpenCloseForm} />

      {toastSuccessCliente && <ToastSuccess contain='Creado exitosamente' onClose={() => setToastSuccessCliente(false)} />}

      <div className={styles.main}>
        <Form>
          <FormGroup widths='equal'>
            <FormField>

              <div className={styles.toggleCot}>
                {toggle ?
                  <div className={styles.toggleOn} onClick={onToggle}>
                    <Label>Cotización</Label>
                    <BiSolidToggleRight />
                  </div> :
                  <div className={styles.toggleOff} onClick={onToggle}>
                    <Label>Cotización</Label>
                    <BiSolidToggleLeft />
                  </div>
                }
              </div>

              {toggle ?
                <Dropdown
                  placeholder='Selecciona un folio'
                  fluid
                  selection
                  options={cotizaciones.map(cot => ({ key: cot.id, text: cot.folio, value: cot.id }))}
                  value={cotizacion}
                  onChange={(e, { value }) => setCotizacion(value)}
                /> : null
              }

            </FormField>
            <FormField error={!!errors.recibo}>
              <Label>Recibo</Label>
              <Input
                type="text"
                value={recibo || ''}
                onChange={(e) => setRecibo(e.target.value)}
              />
              {errors.recibo && <Message negative>{errors.recibo}</Message>}
            </FormField>
            <FormField error={!!errors.cliente_id}>
              <Label>Cliente</Label>
              <Dropdown
                placeholder='Selecciona un cliente'
                fluid
                selection
                options={clientes.map(cliente => ({
                  key: cliente.id,
                  text: cliente.nombre,
                  value: cliente.id
                }))}
                value={cliente_id}
                onChange={(e, { value }) => setCliente(value)}
              />
              <div className={styles.addCliente}>
                <h1>Crear cliente</h1>
                <FaPlus onClick={onOpenCloseClienteForm} />
              </div>
              {errors.cliente_id && <Message negative>{errors.cliente_id}</Message>}
            </FormField>
          </FormGroup>
        </Form>

        <div className={styles.section}>
          <RowHeadModal rowMain />
          {conceptos.map((concepto, index) => (
            <div key={index} className={styles.rowMap} onClick={() => onOpenEditConcep(index)}>
              <h1>{concepto.tipo}</h1>
              <h1>{concepto.concepto}</h1>
              <h1>${formatCurrency(concepto.precio * 1)}</h1>
              <h1>{concepto.cantidad}</h1>
              <h1>${formatCurrency(concepto.precio * concepto.cantidad)}</h1>
            </div>
          ))}

          <div className={styles.iconPlus}>
            <div onClick={onOpenCloseConcep}>
              <FaPlus />
            </div>
          </div>

          <div className={styles.box3}>
            <div className={styles.box3_1}>
              <h1>Subtotal:</h1>
              {!toggleIVA ? (
                <div className={styles.toggleOFF} onClick={onIVA}>
                  <BiSolidToggleLeft />
                  <h1>IVA:</h1>
                </div>
              ) : (
                <div className={styles.toggleON}>
                  <Form>
                    <FormGroup>
                      <FormField>
                        <Input
                          value={ivaValue}
                          onChange={handleIvaChange}
                          className={styles.ivaInput}
                        />
                      </FormField>
                    </FormGroup>
                  </Form>
                  <h1>%</h1>
                  <BiSolidToggleRight onClick={onIVA} />
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
        </div>

        <Button primary onClick={crearRecibo}>Crear</Button>
      </div>

      <BasicModal title='crear cliente' show={show} onClose={onOpenCloseClienteForm}>
        <ClienteForm reload={reload} onReload={onReload} onCloseForm={onOpenCloseClienteForm} onToastSuccess={onToastSuccessCliente} />
      </BasicModal>

      <BasicModal title='Agregar concepto' show={showConcep} onClose={onOpenCloseConcep}>
        <ConceptosForm añadirConcepto={añadirConcepto} onOpenCloseConcep={onOpenCloseConcep} />
      </BasicModal>

      <BasicModal title="Editar concepto" show={showEditConcep} onClose={onOpenEditConcep}>
        <ConceptosEditForm
          concepto={conceptoEdit}
          onSave={(updatedConcepto) => {
  
            const updatedConceptos = conceptos.map((concepto) =>
              concepto === conceptoEdit ? updatedConcepto : concepto
            )
            setConceptos(updatedConceptos)      
          }}
          onCloseEditConcep={onCloseEditConcep}
          onOpenCloseConfirm={onOpenCloseConfirm}
        />
      </BasicModal>

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
        onConfirm={eliminarConcepto}
        onCancel={onHideConfirm}
        content='¿Estás seguro de eliminar el concepto?'
      />

    </>

  )
}
