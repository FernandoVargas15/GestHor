
import * as XLSX from 'xlsx';

class ExcelExporter {

    static generateFileName(baseName) {
        const now = new Date();
        const year = now.getFullYear();
        return `${baseName} ${year}.xlsx`;
    }

    static downloadWorkbook(workbook, fileName) {
        XLSX.writeFile(workbook, fileName);
    }

    static autoFitColumns(worksheet, data) {
        const colWidths = [];
        
        data.forEach((row) => {
            Object.values(row).forEach((cell, colIndex) => {
                const cellValue = cell ? String(cell) : '';
                const cellLength = cellValue.length;
                
                if (!colWidths[colIndex] || cellLength > colWidths[colIndex]) {
                    colWidths[colIndex] = Math.min(cellLength + 2, 50);
                }
            });
        });

        worksheet['!cols'] = colWidths.map(width => ({ wch: width || 10 }));
    }
}

export class HorarioExcelExporter extends ExcelExporter {

    static exportSchedule(scheduleData, tipo, profesorNombre = 'Profesor') {
        const { slots, classes } = scheduleData;
        const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
        const daysKeys = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];

        const excelData = this.buildScheduleData(slots, classes, days, daysKeys);

        const worksheet = XLSX.utils.json_to_sheet(excelData, {
            header: ['Hora', ...days],
            skipHeader: false
        });

        this.autoFitColumns(worksheet, excelData);
        
        worksheet['!cols'] = [
            { wch: 15 },
            ...Array(days.length).fill({ wch: 20 })
        ];

        worksheet['!rows'] = Array(excelData.length + 1).fill({ hpt: 30 });

        const workbook = XLSX.utils.book_new();
        const sheetName = tipo === 'matutino' ? 'Horario Matutino' : 'Horario Vespertino';
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        workbook.Props = {
            Title: `Horario ${tipo}`,
            Subject: 'Horario Académico',
            Author: profesorNombre,
            CreatedDate: new Date()
        };

        const fileName = this.generateFileName(`Horario semanal ${tipo}`);
        this.downloadWorkbook(workbook, fileName);
    }

    static buildScheduleData(slots, classes, days, daysKeys) {
        return slots.map(slot => {
            const row = { 'Hora': slot };
            
            daysKeys.forEach((dayKey, index) => {
                const dayLabel = days[index];
                const classInfo = classes[slot]?.[dayKey];
                row[dayLabel] = classInfo ? `${classInfo.s}\n${classInfo.r}` : '';
            });

            return row;
        });
    }

    static exportEmptySchedule(tipo) {
        const slots = tipo === 'matutino' 
            ? ["07:00 - 08:00", "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", 
               "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00"]
            : ["15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00",
               "19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00"];

        const emptyClasses = {};
        slots.forEach(slot => {
            emptyClasses[slot] = {};
        });

        this.exportSchedule({ slots, classes: emptyClasses }, tipo, 'Plantilla');
    }
}

export class ExportFactory {
    static createExporter(type) {
        switch(type) {
            case 'horario':
                return HorarioExcelExporter;
            default:
                throw new Error(`Tipo de exportador no soportado: ${type}`);
        }
    }
}

export default HorarioExcelExporter;
