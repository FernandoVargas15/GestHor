import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export class HorarioPDFExporter {
  static exportSchedule(scheduleData, tipo, profesorNombre = "Profesor") {
    const { slots, classes } = scheduleData;
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
    const daysKeys = ["lunes", "martes", "miercoles", "jueves", "viernes"];

    // Crear documento PDF
    const doc = new jsPDF("landscape", "pt", "A4"); // horizontal, puntos, tamaño carta
    const title = `Horario ${tipo === "matutino" ? "Matutino" : "Vespertino"}`;
    const subtitle = `Profesor: ${profesorNombre}`;

    // Títulos
    doc.setFontSize(18);
    doc.text(title, 40, 40);
    doc.setFontSize(12);
    doc.text(subtitle, 40, 60);
    doc.text(`Generado: ${new Date().toLocaleDateString()}`, 40, 80);

    // Construir datos para la tabla
    const tableData = slots.map((slot) => {
      const row = [slot];
      daysKeys.forEach((d) => {
        const info = classes[slot]?.[d];
        row.push(info && !info.skip ? `${info.s || ""}\n${info.r || ""}` : "");
      });
      return row;
    });

    // Dibujar tabla
    autoTable(doc, {
      startY: 100,
      head: [["Hora", ...days]],
      body: tableData,
      styles: {
        fontSize: 10,
        cellPadding: 5,
        valign: "middle",
        halign: "center",
      },
      headStyles: {
        fillColor: [41, 128, 185], // azul
        textColor: 255,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: 40, right: 40 },
      tableWidth: "auto",
    });

    // Guardar el archivo
    const fileName = `Horario_${tipo}_${new Date().getFullYear()}.pdf`;
    doc.save(fileName);
  }

  static exportEmptySchedule(tipo) {
    const slots =
      tipo === "matutino"
        ? [
            "07:00 - 08:00",
            "08:00 - 09:00",
            "09:00 - 10:00",
            "10:00 - 11:00",
            "11:00 - 12:00",
            "12:00 - 13:00",
            "13:00 - 14:00",
          ]
        : [
            "15:00 - 16:00",
            "16:00 - 17:00",
            "17:00 - 18:00",
            "18:00 - 19:00",
            "19:00 - 20:00",
            "20:00 - 21:00",
            "21:00 - 22:00",
          ];

    const emptyClasses = {};
    slots.forEach((slot) => {
      emptyClasses[slot] = {};
    });

    this.exportSchedule({ slots, classes: emptyClasses }, tipo, "Plantilla");
  }
}

export default HorarioPDFExporter;
