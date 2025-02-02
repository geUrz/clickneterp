import { IconClose, Confirm, FirmaDigital } from '@/components/Layouts'
import { formatDateIncDet, getValueOrDefault } from '@/helpers'
import { BasicModal } from '@/layouts'
import { FaCheck, FaEdit, FaPlus, FaTimes, FaTrash } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { OrdenesdeservicioEditForm } from '../OrdenesdeservicioEditForm/OrdenesdeservicioEditForm'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { Image, Form, FormGroup, FormField, Button, TextArea, Label } from 'semantic-ui-react'
import { OrdenesdeservicioPDF } from '../OrdenesdeservicioPDF/OrdenesdeservicioPDF'
import styles from './OrdenesdeservicioDetalles.module.css'
import { BiSolidToggleLeft, BiSolidToggleRight } from 'react-icons/bi'

export function OrdenesdeservicioDetalles(props) {

  const { reload, onReload,  ordserv: initialOrdendeservicio, onCloseDetalles, onToastSuccessMod, onToastSuccessDel } = props;

  const { user } = useAuth()

  const [ordserv, setReporte] = useState(initialOrdendeservicio || {})
  const [showEditOrdendeservicio, setShowEdit] = useState(false)
  const [showFirmatecModal, setShowFirmatecModal] = useState(false)
  const [showFirmaCliModal, setShowFirmaCliModal] = useState(false)
  const [firmatec, setFirmatec] = useState( ordserv.firmatec || null)
  const [firmacli, setFirmaCli] = useState( ordserv.firmacli || null)
  const [showConfirmFirmatec, setShowConfirmFirmatec] = useState(false)
  const [showConfirmFirmaCli, setShowConfirmFirmaCli] = useState(false)
  
  const [togglePagina2, setTogglePagina2] = useState(() => {
    const savedState = localStorage.getItem('togglePagina2')
    return savedState !== null ? JSON.parse(savedState) : false;
  })

  const onTogglePagina2 = () => {
    setTogglePagina2((prevState) => {
      const newState = !prevState;

      localStorage.setItem('togglePagina2', JSON.stringify(newState))
      return newState;
    })
  }

  const onOpenCloseFirmatec = () => {
    setShowFirmatecModal((prev) => !prev)
    if (!showFirmatecModal) {
      fetchFirmatec()  // Actualizar la firma del técnico
    }
  }

  const onOpenCloseFirmaCli = () => {
    setShowFirmaCliModal((prev) => !prev)
    if (!showFirmaCliModal) {
      fetchFirmaCli()  // Actualizar la firma del cliente
    }
  }

  const onOpenCloseConfirmFirmatec = () => setShowConfirmFirmatec((prev) => !prev)
  const onOpenCloseConfirmFirmaCli = () => setShowConfirmFirmaCli((prev) => !prev)

  useEffect(() => {
    fetchFirmatec()
    fetchFirmaCli()
  }, [])

  const onOpenEdit = () => setShowEdit((prevState) => !prevState)

  const [showConfirmDel, setShowConfirmDel] = useState(false)

  const onOpenCloseConfirmDel = () => setShowConfirmDel((prevState) => !prevState)

  const handleDeleteReporte = async () => {
    if (ordserv?.id) {
      try {
        await axios.delete(`/api/ordenesdeserv/ordenesdeserv?id=${ordserv.id}`)
        setReporte(null)
        onReload()
        onToastSuccessDel()
        onCloseDetalles()
      } catch (error) {
        console.error('Error al eliminar la orden de servicio:', error)
      }
    } else {
      console.error('Orden de servicio o ID no disponible')
    }
  }

  const [page2, setPage2] = useState(ordserv.page2 || '')
  const [editPage2, setEditPage2] = useState(!!ordserv.page2)
  const maxCharactersPage2 = 6200

  const handlePage2Change = (e) => {
    const { value } = e.target
    if (value.length <= maxCharactersPage2) {
      setPage2(value)
    }
  }

  const handleAddPage2 = async () => {
    if (!ordserv.id) {
      console.error('ID de la orden de servicio no disponible')
      return
    }

    try {
      const response = await axios.put(`/api/ordenesdeserv/createPage2`, {
        id: ordserv.id,
        page2Value: page2
      })

      if (response.status === 200) {
        setEditPage2(true)
        onReload()
      }

    } catch (error) {
      console.error('Error al actualizar la page2:', error.response?.data || error.message)
    }
  }

  useEffect(() => {
    if (ordserv.page2) setEditPage2(true)
  }, [ ordserv])

  const [nota, setNota] = useState(ordserv.nota || '')
  const [editNota, setEditNota] = useState(!! ordserv.nota)
  const maxCharacters = 460

  const handleNotaChange = (e) => {
    const { value } = e.target
    if (value.length <= maxCharacters) {
      setNota(value)
    }
  }

  const handleAddNota = async () => {
    if (!ordserv.id) {
      console.error("ID de la orden de servicio no disponible")
      return
    }

    try {
      const response = await axios.put(`/api/ordenesdeserv/createNota`, {
        id: ordserv.id,
        notaValue: nota
      })

      if (response.status === 200) {
        setEditNota(true)
        onReload()
      }
    } catch (error) {
      console.error('Error al actualizar la nota:', error.response?.data || error.message)
    }
  }

  useEffect(() => {
    if (ordserv.nota) setEditNota(true)
  }, [ordserv])

  const fetchFirmatec = async () => {
    try {
      const response = await axios.get(`/api/ordenesdeserv/ordenesdeserv?id=${ordserv.id}`)
      if (response.data.firmatec) {
        setFirmatec(response.data.firmatec)
      }
    } catch (error) {
      console.error('Error al obtener la firma del técnico:', error)
    }
  }

  const fetchFirmaCli = async () => {
    try {
      const response = await axios.get(`/api/ordenesdeserv/ordenesdeserv?id=${ordserv.id}`)
      if (response.data.firmacli) {
        setFirmaCli(response.data.firmacli)
      }
    } catch (error) {
      console.error('Error al obtener la firma del cliente:', error)
    }
  }

  const removeFirmatec = async () => {
    try {
      await axios.put(`/api/ordenesdeserv/createFirmatec`, {
        id: ordserv.id,
        firmaValue: null
      })
      setFirmatec(null)
      onOpenCloseConfirmFirmatec()
    } catch (error) {
      console.error('Error al eliminar la firma del técnico:', error)
    }
  }

  const removeFirmaCli = async () => {
    try {
      await axios.put(`/api/ordenesdeserv/createFirmacli`, {
        id: ordserv.id,
        firmaValue: null
      })
      setFirmaCli(null)
      onOpenCloseConfirmFirmaCli()
    } catch (error) {
      console.error('Error al eliminar la firma del cliente:', error)
    }
  }

  return (
    <>
      <IconClose onOpenClose={onCloseDetalles} />

      <div className={styles.section}>
        <div className={styles.box1}>
          <div className={styles.box1_1}>
            <div>
              <h1>Orden de servicio</h1>
              <h2>{getValueOrDefault(ordserv.ordendeservicio)}</h2>
            </div>
            <div>
              <h1>Cliente</h1>
              <h2>{getValueOrDefault(ordserv.cliente_nombre)}</h2>
            </div>
            <div>
              <h1>Contacto</h1>
              <h2>{getValueOrDefault(ordserv.cliente_contacto)}</h2>
            </div>
            <div>
              <h1>Descripción</h1>
              <h2>{getValueOrDefault(ordserv.descripcion)}</h2>
            </div>
          </div>
          <div className={styles.box1_2}>
            <div>
              <h1>Folio</h1>
              <h2>{getValueOrDefault(ordserv.folio)}</h2>
            </div>
            <div>
              <h1>Fecha</h1>
              <h2>{getValueOrDefault(formatDateIncDet(ordserv.createdAt))}</h2>
            </div>
            <div>
              <h1>Técnico</h1>
              <h2>{getValueOrDefault(ordserv.usuario_nombre)}</h2>
            </div>
          </div>
        </div>

        <div className={styles.pagina}>
          <h1>Página 2</h1>
          {togglePagina2 ?
            <div className={styles.toggleON}><BiSolidToggleRight onClick={onTogglePagina2} /></div> :
            <div className={styles.toggleOFF}><BiSolidToggleLeft onClick={onTogglePagina2} /></div>
          }
        </div>

        {togglePagina2 ?
          <Form>
            <FormGroup widths='equal'>
              <FormField>
                <TextArea
                  value={page2}
                  onChange={handlePage2Change}
                />
                <div className={styles.charCount}>
                  {page2.length}/{maxCharactersPage2}
                </div>
              </FormField>
            </FormGroup>
            <Button secondary onClick={handleAddPage2}>
              {editPage2 ? 'Modificar' : 'Añadir'}
            </Button>
          </Form>
          : null
        }

        <div className={styles.formNota}>
          <Form>
            <FormGroup widths='equal'>
              <FormField>
                <Label>
                  Nota:
                </Label>
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

        <div className={styles.imgFirma}>
          {firmatec ? (
            <div>
              <Image src={firmatec} alt="Firma Técnico" />
              <div className={styles.linea}></div>
              <h2>Firma Técnico</h2>
              <Button secondary onClick={() => setShowConfirmFirmatec(true)}><FaTrash /> Eliminar Firma Técnico</Button>
            </div>
          ) : (
            <Button secondary onClick={onOpenCloseFirmatec}><FaPlus /> Agregar Firma Técnico</Button>
          )}
        </div>

        <div className={styles.imgFirma}>
          {firmacli ? (
            <div>
              <Image src={firmacli} alt="Firma Cliente" />
              <div className={styles.linea}></div>
              <h2>Firma Cliente</h2>
              <Button secondary onClick={() => setShowConfirmFirmaCli(true)}><FaTrash /> Eliminar Firma Cliente</Button>
            </div>
          ) : (
            <Button secondary onClick={onOpenCloseFirmaCli}><FaPlus /> Agregar Firma Cliente</Button>
          )}
        </div>

        {user.nivel === 'Admin' ? (
          <>
            <div className={styles.iconEdit}>
              <div onClick={onOpenEdit}>
                <FaEdit />
              </div>
            </div>

            <div className={styles.iconDel}>
              <div>
                <FaTrash onClick={onOpenCloseConfirmDel} />
              </div>
            </div>
          </>
        ) : null}

        <OrdenesdeservicioPDF  ordserv={ ordserv} firmatec={firmatec} firmacli={firmacli} togglePagina2={togglePagina2} />

      </div>

      <BasicModal title="Modificar el  ordserv" show={showEditOrdendeservicio} onClose={onOpenEdit}>
        <OrdenesdeservicioEditForm reload={reload} onReload={onReload}  ordserv={ ordserv} onOpenEdit={onOpenEdit} onToastSuccessMod={onToastSuccessMod} />
      </BasicModal>

      <BasicModal title="Firma del Técnico" show={showFirmatecModal} onClose={onOpenCloseFirmatec}>
        <FirmaDigital
          reload={reload}
          onReload={onReload}
          endPoint='ordenesdeserv'
          itemId={ordserv.id}
          tipoFirma="firmatec"
          onOpenClose={() => {
            onOpenCloseFirmatec()
            fetchFirmatec()
          }}
        />
      </BasicModal>

      <BasicModal title="Firma del Cliente" show={showFirmaCliModal} onClose={onOpenCloseFirmaCli}>
        <FirmaDigital
          reload={reload}
          onReload={onReload}
          endPoint='ordenesdeserv'
          itemId={ordserv.id}
          tipoFirma="firmacli"
          onOpenClose={() => {
            onOpenCloseFirmaCli()
            fetchFirmaCli()
          }}
        />
      </BasicModal>

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
        onConfirm={handleDeleteReporte}
        onCancel={onOpenCloseConfirmDel}
        content="¿ Estás seguro de eliminar la orden de servicio ?"
      />

      <Confirm
        open={showConfirmFirmatec}
        onCancel={onOpenCloseConfirmFirmatec}
        onConfirm={removeFirmatec}
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
        content="¿Estás seguro de eliminar la firma del técnico?"
      />

      <Confirm
        open={showConfirmFirmaCli}
        onCancel={onOpenCloseConfirmFirmaCli}
        onConfirm={removeFirmaCli}
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
        content="¿Estás seguro de eliminar la firma del cliente?"
      />
    </>
  )
}
