import { IconClose } from '@/components/Layouts'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import styles from './ClienteEditForm.module.css'

export function ClienteEditForm(props) {

  const { reload, onReload, cliente, onOpenCloseEdit, onToastSuccessMod } = props

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

  const [formData, setFormData] = useState({
    nombre: cliente.nombre,
    contacto: cliente.contacto,
    cel: cliente.cel,
    direccion: cliente.direccion,
    email: cliente.email
  })

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!formData.nombre) {
      newErrors.nombre = 'El campo es requerido'
    }

    if (!formData.contacto) {
      newErrors.contacto = 'El campo es requerido'
    }

    if (!formData.cel) {
      newErrors.cel = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    try {
      await axios.put(`/api/clientes/clientes?id=${cliente.id}`, {
        ...formData
      })
      onReload()
      onOpenCloseEdit()
      onToastSuccessMod()
    } catch (error) {
      console.error('Error actualizando el cliente:', error)
    }
  }

  return (

    <>

      <IconClose onOpenClose={onOpenCloseEdit} />

      <Form>
        <FormGroup widths='equal'>
          <FormField error={!!errors.nombre}>
            <Label>
              Nombre
            </Label>
            <Input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
            {errors.nombre && <Message negative>{errors.nombre}</Message>}
          </FormField>
          <FormField error={!!errors.contacto}>
            <Label>
              Contacto
            </Label>
            <Input
              type="text"
              name="contacto"
              value={formData.contacto}
              onChange={handleChange}
            />
            {errors.contacto && <Message negative>{errors.contacto}</Message>}
          </FormField>
          <FormField error={!!errors.cel}>
            <Label>
              Celular
            </Label>
            <Input
              type="text"
              name="cel"
              value={formData.cel}
              onChange={handleChange}
            />
            {errors.cel && <Message negative>{errors.cel}</Message>}
          </FormField>
          <FormField>
            <Label>
              Dirección
            </Label>
            <Input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>
              Correo
            </Label>
            <Input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormField>
        </FormGroup>
        <Button primary onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

    </>

  )
}
