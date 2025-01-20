import { Confirm, IconClose, ToastSuccess } from '@/components/Layouts'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { formatCurrency, genCOTId } from '@/helpers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { FaCheck, FaPlus, FaTimes } from 'react-icons/fa'
import { RowHeadModal } from '../RowHead'
import styles from './CotizacionForm.module.css'
import { BiSolidToggleLeft, BiSolidToggleRight } from 'react-icons/bi'
import { BasicModal } from '@/layouts'
import { ClienteForm } from '@/components/Clientes'

export function CotizacionForm(props) {

  const { reload, onReload, onOpenCloseForm, onToastSuccess } = props

  const [showConfirm, setShowConfirm] = useState(false)

  const [show, setShow] = useState(false)

  const onOpenCloseClienteForm = () => setShow((prevState) => !prevState)

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
  const [conceptos, setConceptos] = useState([])
  const [nuevoConcepto, setNuevoConcepto] = useState({
    tipo: '',
    concepto: '',
    precio: '',
    cantidad: ''
  })
  const [toggleIVA, setToggleIVA] = useState(false)

  const onShowConfirm = (index) => {
    setConceptoAEliminar(index)
    setShowConfirm(true)
  }

  const onHideConfirm = () => {
    setConceptoAEliminar(null)
    setShowConfirm(false)
  }

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!cotizacion) {
      newErrors.cotizacion = 'El campo es requerido'
    }

    if (!cliente_id) {
      newErrors.cliente_id = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const validarFormConceptos = () => {
    const newErrors = {}

    if (!nuevoConcepto.tipo) {
      newErrors.tipo = 'El campo es requerido'
    }

    if (!nuevoConcepto.concepto) {
      newErrors.concepto = 'El campo es requerido'
    }

    if (!nuevoConcepto.precio) {
      newErrors.precio = 'El campo es requerido'
    } else if (nuevoConcepto.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0'
    }

    if (!nuevoConcepto.cantidad) {
      newErrors.cantidad = 'El campo es requerido'
    } else if (nuevoConcepto.cantidad <= 0) {
      newErrors.cantidad = 'La cantidad debe ser mayor a 0'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await axios.get('/api/clientes/clientes')
        setClientes(res.data)
      } catch (error) {
        console.error('Error al obtener los clientes:', error)
      }
    }

    fetchClientes()
  }, [reload])

  const crearRecibo = async (e) => {
    e.preventDefault()

    if (!validarForm()) {
      return
    }

    const folio = genCOTId(4)

    try {
      const response = await axios.post('/api/cotizaciones/cotizaciones', {
        folio,
        cliente_id,
        cotizacion
      })
      const cotizacionId = response.data.id
      await Promise.all(conceptos.map(concepto =>
        axios.post('/api/cotizaciones/conceptos', { cotizacion_id: cotizacionId, ...concepto })
      ))

      setCotizacion('')
      setCliente('')
      setConceptos([])

      onReload()
      onOpenCloseForm()
      onToastSuccess()
    } catch (error) {
      console.error('Error al crear la cotizacion:', error)

    }
  }

  const añadirConcepto = () => {
    if (!validarFormConceptos()) {
      return
    }
    setConceptos([...conceptos, nuevoConcepto])
    setNuevoConcepto({ tipo: '', concepto: '', precio: '', cantidad: '' })
  }

  const [conceptoAEliminar, setConceptoAEliminar] = useState(null)

  const eliminarConcepto = () => {
    const nuevosConceptos = conceptos.filter((_, i) => i !== conceptoAEliminar);
    setConceptos(nuevosConceptos);
    onHideConfirm();
  }

  const calcularTotales = () => {
    const subtotal = conceptos.reduce((acc, curr) => acc + curr.cantidad * curr.precio, 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    return { subtotal, iva, total }
  };

  const { subtotal, iva, total } = calcularTotales()

  useEffect(() => {
    const savedToggleIVA = localStorage.getItem('ontoggleIVA')
    if (savedToggleIVA) {
      setToggleIVA(JSON.parse(savedToggleIVA))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ontoggleIVA', JSON.stringify(toggleIVA))
  }, [toggleIVA])

  const onIVA = () => {
    setToggleIVA(prevState => (!prevState))
  }

  const opcionesSerprod = [
    { key: 1, text: 'Servicio', value: 'Servicio' },
    { key: 2, text: 'Producto', value: 'Producto' }
  ]

  return (

    <>

      <IconClose onOpenClose={onOpenCloseForm} />

      {toastSuccessCliente && <ToastSuccess contain='Creado exitosamente' onClose={() => setToastSuccessCliente(false)} />}

      <div className={styles.main}>
        <Form>
          <FormGroup widths='equal'>
            <FormField error={!!errors.cotizacion}>
              <Label>Cotización</Label>
              <Input
                type="text"
                value={cotizacion}
                onChange={(e) => setCotizacion(e.target.value)}
              />
              {errors.cotizacion && <Message negative>{errors.cotizacion}</Message>}
            </FormField>
          </FormGroup>
        </Form>
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
          <div className={styles.addCliente} onClick={onOpenCloseClienteForm}>
            <h1>Crear cliente</h1>
            <FaPlus />
          </div>
          {errors.cliente_id && <Message negative>{errors.cliente_id}</Message>}
        </FormField>
        <Form>
          <FormGroup widths='equal'>
            <FormField error={!!errors.tipo}>
              <Label>Tipo</Label>
              <Dropdown
                placeholder='Selecciona una opción'
                fluid
                selection
                options={opcionesSerprod}
                value={nuevoConcepto.tipo}
                onChange={(e, { value }) => setNuevoConcepto({ ...nuevoConcepto, tipo: value })}
              />
              {errors.tipo && <Message negative>{errors.tipo}</Message>}
            </FormField>
            <FormField error={!!errors.concepto}>
              <Label>Concepto</Label>
              <Input
                type="text"
                value={nuevoConcepto.concepto}
                onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, concepto: e.target.value })}
              />
              {errors.concepto && <Message negative>{errors.concepto}</Message>}
            </FormField>
            <FormField error={!!errors.precio}>
              <Label>Precio</Label>
              <Input
                type="number"
                value={nuevoConcepto.precio}
                onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, precio: e.target.value === '' ? '' : parseFloat(e.target.value) })}
              />
              {errors.precio && <Message negative>{errors.precio}</Message>}
            </FormField>
            <FormField error={!!errors.cantidad}>
              <Label>Qty</Label>
              <Input
                type="number"
                value={nuevoConcepto.cantidad}
                onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, cantidad: e.target.value === '' ? '' : parseInt(e.target.value) })}
              />
              {errors.cantidad && <Message negative>{errors.cantidad}</Message>}
            </FormField>
          </FormGroup>
          <Button secondary onClick={añadirConcepto}>Añadir Concepto</Button>
        </Form>

        <div className={styles.section}>

          <RowHeadModal rowMain />

          {conceptos.map((concepto, index) => (
            <div key={index} className={styles.rowMap} onClick={() => onShowConfirm(index)}>
              <h1>{concepto.tipo}</h1>
              <h1>{concepto.concepto}</h1>
              <h1>${formatCurrency(concepto.precio * 1)}</h1>
              <h1>{concepto.cantidad}</h1>
              <h1>${formatCurrency(concepto.precio * concepto.cantidad)}</h1>
            </div>
          ))}

          <div className={styles.box3}>
            <div className={styles.box3_1}>
              <h1>Subtotal:</h1>

              {!toggleIVA ? (

                <div className={styles.toggleOFF} onClick={onIVA}>
                  <BiSolidToggleLeft />
                  <h1>IVA:</h1>
                </div>

              ) : (

                <div className={styles.toggleON} onClick={onIVA}>
                  <BiSolidToggleRight />
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
        <ClienteForm reload={reload} onReload={onReload} onOpenClose={onOpenCloseClienteForm} onToastSuccess={onToastSuccessCliente} />
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
