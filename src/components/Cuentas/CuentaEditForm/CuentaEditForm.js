import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Dropdown, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import 'react-datepicker/dist/react-datepicker.css'
import { FaPlus } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { ClienteForm } from '@/components/Clientes'
import { ToastSuccess } from '@/components/Layouts'
import styles from './CuentaEditForm.module.css'

export function CuentaEditForm(props) {

  const { reload, onReload, cuenta, onOpenEditCuenta, onToastSuccessMod } = props

  const [show, setShow] = useState(false)

  const onOpenCloseClienteForm = () => setShow((prevState) => !prevState)

  const [formData, setFormData] = useState({
    cuenta: cuenta.cuenta,
    cliente_id: cuenta.cliente_id
  })
  
  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!formData.cuenta) {
      newErrors.cuenta = 'El campo es requerido'
    }

    if (!formData.cliente_id) {
      newErrors.cliente_id = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const [clientes, setClientes] = useState([])
  
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('/api/clientes/clientes')
        setClientes(response.data)
      } catch (error) {
        console.error('Error al obtener los clientes:', error)
      }
    }

    fetchClientes()
  }, [reload])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleDropdownChange = (e, { value }) => {
    setFormData({ ...formData, cliente_id: value })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    try {
      await axios.put(`/api/cuentas/cuentas?id=${cuenta.id}`, {
        ...formData,
      })
      onReload()
      onOpenEditCuenta()
      onToastSuccessMod()
    } catch (error) {
      console.error('Error actualizando la cuenta:', error)
    }
  }

  const [toastSuccessCliente, setToastSuccessCCliente] = useState(false)

  const onToastSuccessCliente = () => {
    setToastSuccessCCliente(true)
    setTimeout(() => {
      setToastSuccessCCliente(false)
    }, 3000)
  }


  return (

    <>

      <IconClose onOpenClose={onOpenEditCuenta} />

      {toastSuccessCliente && <ToastSuccess contain='Cliente creado exitosamente' onClose={() => setToastSuccessCliente(false)} />}

      <Form>
        <FormGroup widths='equal'>
          <FormField error={!!errors.cuenta}>
            <Label>
              Cuenta
            </Label>
            <Input
              type="text"
              name="cuenta"
              value={formData.cuenta}
              onChange={handleChange}
            />
            {errors.cuenta && <Message negative>{errors.cuenta}</Message>}
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
              value={formData.cliente_id}
              onChange={handleDropdownChange}
            />
            <div className={styles.addCliente} onClick={onOpenCloseClienteForm}>
              <h1>Crear cliente</h1>
              <FaPlus />
            </div>
            {errors.cliente_id && <Message negative>{errors.cliente_id}</Message>}
          </FormField>
        </FormGroup>
        <Button primary onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

      <BasicModal title='crear cliente' show={show} onClose={onOpenCloseClienteForm}>
        <ClienteForm reload={reload} onReload={onReload} onCloseForm={onOpenCloseClienteForm} onToastSuccess={onToastSuccessCliente} />
      </BasicModal>

    </>

  )
}
