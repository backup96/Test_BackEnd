import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { jsPDF } from "jspdf";
import axios from "axios";
import { useEffect, useState } from "react";

library.add(faTrash);
library.add(faPenToSquare);
library.add(faSquarePlus);

const Reporte = ({ item, currentRecords, apiS }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchApartamentos() {
      try {
        const response = await axios.get(`/admin/getTotalEspRent`);
        setData(response.data);
        if (response.data.length === 0) {
          setData([]);
        }
      } catch (error) {
        console.error("Error al obtener los apartamentos:", error);
      }
    }

    fetchApartamentos();
  }, []);

  const generatePDF = (currentRecords) => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 20;

    const textCenter = "Reporte espacios de parqueadero";
    const nombreConjunto = "Torres de Santa Isabel";

    const textWidth = doc.getTextWidth(textCenter);
    const textWidth2 = doc.getTextWidth(nombreConjunto);

    const x = (pageWidth - textWidth) / 2;
    const x2 = (pageWidth - textWidth2) / 2;

    // Agregar texto al PDF
    doc.text(textCenter, x, 20);
    y += 10;
    doc.text(nombreConjunto, x2, 30);
    y += 10;

    // Agregar una tabla de ejemplo
    doc.text("Nombre", 10, 40);
    doc.text("Numero de parqueadero", 70, 40);
    doc.text("Codigo de vivienda", 150, 40);
    y += 10;

    currentRecords.forEach((item, index) => {
      // Verificar si el contenido se desbordará de la página
      if (y + 10 > pageHeight) {
        doc.addPage();
        y = 20; // Reiniciar `y` para la nueva página
      }

      // Añadir el contenido de cada registro
      doc.text(`${item.nombre} ${item.apellido}`, 10, y);
      doc.text(item.idParqueaderoFk.toString(), 70, y);
      doc.text(item.Apartamento_FK.toString(), 150, y);
      y += 20; // Incrementar `y` para la siguiente línea
    });
    data.forEach((item) => {
      doc.text("Total parqeuaderos rentados:", 70, y);
      doc.text(item.total.toString(), 150, y);
    });

    y += 10;

    // Guardar el PDF
    doc.save("reporte.pdf");
  };

  return (
    <div className="d-flex flex-column align-items-end">
      <div
        className="border border-primary rounded overflow-auto"
        style={{ width: "100%", height: "500px" }}
      >
        <table
          id="example2"
          className="table table-bordered table-hover dataTable dtr-inline"
          aria-describedby="example2_info"
        >
          <thead>
            <tr>
              {item.map((item, index) => (
                <th
                  className="sorting"
                  tabIndex="0"
                  aria-controls="example2"
                  rowSpan="1"
                  colSpan="1"
                  aria-label="Rendering engine: activate to sort column ascending"
                  key={index}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((record, index) => (
              <tr key={index}>
                <td>{`${record.nombre} ${record.apellido}`}</td>
                <td>{record.idParqueaderoFk}</td>
                <td>{record.Apartamento_FK}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="2">Numero de parqeuaderos rentados</th>
              {currentRecords.map((record, index) => (
                <th key={index} rowSpan="1" colSpan="1">
                  {record.total}
                </th>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="my-2 w-25">
        <button
          type="button"
          className="btn btn-success  m-0"
          onClick={() => generatePDF(currentRecords)}
        >
          Generar reporte <FontAwesomeIcon icon={faSquarePlus} />
        </button>
      </div>
    </div>
  );
};
export default Reporte;
