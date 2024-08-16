import { BiSolidFilePdf } from 'react-icons/bi'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import QRCode from 'qrcode'
import { formatCurrency, formatDate, formatId } from '@/helpers'
import styles from './ReciboPDF.module.css'

export function ReciboPDF(props) {

  const {recibos, conceptos} = props

  const generarPDF = async () => {

    if (!recibos) return

    const toggleIVA = JSON.parse(localStorage.getItem('ontoggleIVA') || 'true')

    const doc = new jsPDF(
      {
        orientation: 'p',
        unit: 'mm',
        format: 'a6'
      }
    )

    const logoImg = 'img/logo.png'
    const logoWidth = 30
    const logoHeight = 8
    doc.addImage(logoImg, 'PNG', 4.2, 14, logoWidth, logoHeight)

    doc.setFont('helvetica')

    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.text('CLICKNET', 84.5, 10)
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text('Punta Este Corporativo', 70.8, 14)
    doc.text('Calzada Carranza 951', 72, 18)
    doc.text('Piso 10 Suite 304, Interior "E"', 63, 22)
    doc.setFontSize(7)
    doc.text('C.P. 2125', 89, 26)
    doc.setFontSize(8)
    doc.setTextColor(0, 0, 0)
    doc.text('Juan Roberto Espinoza Espinoza', 58, 30)
    doc.setFontSize(7)
    doc.setTextColor(120, 120, 120)
    doc.text('RFC: EIEJ8906244J3', 76, 34)

    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.text('Cliente', 4.5, 40)
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text(`${recibos.cliente}`, 4.5, 44)

    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.text('Folio', 93, 40)
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text(`${formatId(recibos.id)}`, 89.8, 44)

    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.text('Contacto', 4.5, 50)
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text(`${recibos.descripcion}`, 4.5, 54)

    doc.setFontSize(9)
    doc.setTextColor(0, 0, 0)
    doc.text('Fecha/Hora', 83.6, 50)
    doc.setFontSize(8)
    doc.setTextColor(120, 120, 120)
    doc.text(`${formatDate(recibos.createdAt)}`, 71, 54)

    doc.autoTable({
      startY: 58,
      head: [
        [
          { content: 'Tipo', styles: { halign: 'center' } },
          { content: 'Concepto', styles: { halign: 'left' } },
          { content: 'Precio', styles: { halign: 'right' } },
          { content: 'Qty', styles: { halign: 'center' } },
          { content: 'Total', styles: { halign: 'right' } },         
        ]
      ],
      styles: {
        cellPadding: 1,
        cellWidth: 'auto',
      },
      body: conceptos.map(concepto => [
        { content: `${concepto.tipo}`, styles: { halign: 'center' } }, 
        { content: `${concepto.concepto}`, styles: { halign: 'left' } }, 
        { content: `$${formatCurrency(concepto.precio)}`, styles: { halign: 'right' } },  
        { content: `${concepto.cantidad}`, styles: { halign: 'center' } },  
        { content: `$${formatCurrency(concepto.precio * concepto.cantidad)}`, styles: { halign: 'right' } },  
        ]),
      headStyles: { fillColor: [0, 150, 170], fontSize: 6.8 },
      bodyStyles: { fontSize: 6.2 },
      columnStyles: {
        0: {
          cellPadding: 1,
          cellWidth: 'auto', 
          valign: 'middle'
        },
        1: {
          cellPadding: 1,
          cellWidth: 'auto', 
          valign: 'middle'
        },
        2: {
          cellPadding: 1,
          cellWidth: 'auto', 
          valign: 'middle'
        },
        3: {
          cellPadding: 1,
          cellWidth: 'auto', 
          valign: 'middle'
        },
        4: {
          cellPadding: 1,
          cellWidth: 'auto', 
          valign: 'middle'
        }
      },

      margin: { top: 0, left: 4.5, bottom: 0, right: 4.5 },

    })

    const calcularTotales = () => {
      const subtotal = conceptos.reduce((acc, curr) => acc + curr.cantidad * curr.precio, 0);
      const iva = subtotal * 0.16;
      const total = toggleIVA ? subtotal + iva : subtotal;
      return { subtotal, iva, total };
    };
  
    const { subtotal, iva, total } = calcularTotales();

    const verticalData = [
      ...toggleIVA ? [
        ['Subtotal:', `$${formatCurrency(subtotal)}`],
        ['IVA:', `$${formatCurrency(iva)}`],
      ] : [],
      ['Total:', `$${formatCurrency(total)}`]
    ];
    
    doc.autoTable({
      startY: 124,
      margin: { left: 67.5, bottom: 0, right: 4.5 },
      body: verticalData, 
      styles: {
        cellPadding: 1,
        valign: 'middle',
        fontSize: 7,
      },
      columnStyles: {
        0: { cellWidth: 15, fontStyle: 'bold', halign: 'right' },
        1: { cellWidth: 18, halign: 'right' }  
      }
    })


    const qrCodeText = 'https://www.facebook.com/clicknet.mx'
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeText)
    doc.addImage(qrCodeDataUrl, 'PNG', 2, 118, 25, 25)

    doc.save(`Recibo_${formatId(recibos.id)}.pdf`)
  }

  return (

    <div className={styles.iconPDF}>
      <div onClick={generarPDF}>
        <BiSolidFilePdf />
      </div>
    </div>

  )
}
