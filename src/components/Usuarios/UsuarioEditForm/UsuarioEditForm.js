import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Form, Button, Input, Label, FormGroup, FormField, Message, Dropdown } from 'semantic-ui-react'
import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import styles from './UsuarioEditForm.module.css'

export function UsuarioEditForm(props) {
  const { reload, onReload, usuario, onOpenClose, onToastSuccessMod } = props

  const [formData, setFormData] = useState({
    newNombre: usuario.nombre || '',
    newUsuario: usuario.usuario || '',
    newCel: usuario.cel || '',
    newEmail: usuario.email || '',
    newNivel: usuario.nivel || '',
    newIsActive: usuario.isactive ? 1 : 0,
    newPassword: '',
    confirmPassword: ''
  })
  
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})

  const validarFormUser = () => {
    const newErrors = {};

    if (!formData.newNombre) {
      newErrors.newNombre = 'El campo es requerido'
    }

    if (!formData.newUsuario) {
      newErrors.newUsuario = 'El campo es requerido'
    }

    if (!formData.newNivel) {
      newErrors.newNivel = 'El campo es requerido'
    }

    if (formData.newIsActive === undefined || formData.newIsActive === '') {
      newErrors.newIsActive = 'El campo es requerido';
    }    

    if (!formData.newEmail) {
      newErrors.newEmail = 'El campo es requerido'
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validarFormUser()) {
      return
    }

    setError(null)

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      await axios.put(`/api/usuarios/usuarios?id=${usuario.id}`, {
        nombre: formData.newNombre,
        usuario: formData.newUsuario,
        cel: formData.newCel,
        email: formData.newEmail,
        nivel: formData.newNivel,
        isactive: formData.newIsActive,
        password: formData.newPassword,
      })

      onReload()
      onOpenClose()
      onToastSuccessMod()

    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Ocurrió un error inesperado');
      }
    }
  }

  const opcionesNivel = [
    { key: 1, text: 'Admin', value: 'Admin' },
    { key: 2, text: 'Técnico', value: 'Técnico' }
  ]

  const opcionesIsActive = [
    { key: 1, text: 'Activo', value: 1 },
    { key: 2, text: 'Inactivo', value: 0 }
  ]

  return (
    <>
      <IconClose onOpenClose={onOpenClose} />
      <Form>
        <FormGroup widths='equal'>
          <FormField error={!!errors.newNombre}>
            <Label>Nombre</Label>
            <Input
              name='newNombre'
              type='text'
              value={formData.newNombre}
              onChange={handleChange}
            />
            {errors.newNombre && <Message negative>{errors.newNombre}</Message>}
          </FormField>
          <FormField error={!!errors.newUsuario}>
            <Label>Usuario</Label>
            <Input
              name='newUsuario'
              type='text'
              value={formData.newUsuario}
              onChange={handleChange}
            />
            {errors.newUsuario && <Message negative>{errors.newUsuario}</Message>}
          </FormField>
          <FormField>
            <Label>Cel</Label>
            <Input
              name='newCel'
              type='text'
              value={formData.newCel}
              onChange={handleChange}
            />
            {errors.newCel && <Message negative>{errors.newCel}</Message>}
          </FormField>
          <FormField error={!!errors.newEmail}>
            <Label>Correo</Label>
            <Input
              name='newEmail'
              type='email'
              value={formData.newEmail}
              onChange={handleChange}
            />
            {errors.newEmail && <Message negative>{errors.newEmail}</Message>}
          </FormField>
          <FormField error={!!errors.newNivel}>
            <Label>Nivel</Label>
            <Dropdown
              placeholder='Selecciona una opción'
              fluid
              selection
              options={opcionesNivel}
              value={formData.newNivel}
              onChange={(e, { value }) => setFormData({ ...formData, newNivel: value })}
            />
            {errors.newNivel && <Message negative>{errors.newNivel}</Message>}
          </FormField>
          <FormField error={!!errors.newIsActive}>
            <Label>isActive</Label>
            <Dropdown
              placeholder='Selecciona una opción'
              fluid
              selection
              options={opcionesIsActive}
              value={formData.newIsActive}
              onChange={(e, { value }) => setFormData({ ...formData, newIsActive: Number(value) })}
            />
            {errors.newIsActive && <Message negative>{errors.newIsActive}</Message>}
          </FormField>
          <FormField>
            <Label>Nueva contraseña</Label>
            <Input
              name='newPassword'
              type='password'
              value={formData.newPassword}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>Confirmar nueva contraseña</Label>
            <Input
              name='confirmPassword'
              type='password'
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </FormField>
        </FormGroup>
        {error && <p className={styles.error}>{error}</p>}
        <Button primary onClick={handleSubmit}>Guardar</Button>
      </Form>
    </>
  )
}
