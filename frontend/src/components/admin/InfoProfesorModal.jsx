import PropTypes from "prop-types";
import "../../styles/admin.css";

const InfoProfesorModal = ({ profesorNombre, onClose, infoProfesor }) => {
    const diasOrden = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
    
    const agruparPorTurno = () => {
        if (!infoProfesor?.disponibilidad?.length) return {};
        
        const grupos = { matutino: [], vespertino: [], nocturno: [] };
        infoProfesor.disponibilidad.forEach(slot => {
            const turno = slot.turno?.toLowerCase() || 'matutino';
            if (grupos[turno]) grupos[turno].push(slot);
        });
        return grupos;
    };

    const disponibilidadPorTurno = agruparPorTurno();
    const preferencias = infoProfesor?.preferencias;

    // Si no hay onClose, renderizar como panel en lugar de modal
    const contentPanel = (
        <div style={{ 
            maxWidth: onClose ? '1000px' : '100%', 
            maxHeight: onClose ? '90vh' : 'auto', 
            overflowY: 'auto',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: onClose ? undefined : '0 2px 8px rgba(0,0,0,0.1)',
            border: onClose ? undefined : '1px solid #dee2e6',
            marginTop: onClose ? 0 : '16px'
        }} className={onClose ? "modal-content" : ""} onClick={(e) => onClose && e.stopPropagation()}>
            <div className="modal-header">
                <h2>Información del Profesor</h2>
                {onClose && <button className="modal-close" onClick={onClose}>&times;</button>}
            </div>

                <div className="modal-body">
                    <div style={{ 
                        padding: '16px', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '4px',
                        marginBottom: '24px',
                        borderLeft: '4px solid var(--primary)'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{profesorNombre}</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
                        <div>
                            <h4 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                                Disponibilidad Horaria
                            </h4>
                            
                            {Object.keys(disponibilidadPorTurno).length === 0 || 
                             Object.values(disponibilidadPorTurno).every(arr => arr.length === 0) ? (
                                <div style={{ 
                                    padding: '24px', 
                                    textAlign: 'center', 
                                    color: '#6c757d',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '4px'
                                }}>
                                    El profesor no ha configurado su disponibilidad horaria
                                </div>
                            ) : (
                                <>
                                    {Object.entries(disponibilidadPorTurno).map(([turno, slots]) => {
                                        if (slots.length === 0) return null;
                                        
                                        return (
                                            <div key={turno} style={{ marginBottom: '20px' }}>
                                                <div style={{ 
                                                    fontWeight: 600,
                                                    textTransform: 'capitalize',
                                                    marginBottom: '12px',
                                                    paddingBottom: '8px',
                                                    borderBottom: '1px solid #dee2e6',
                                                    fontSize: '14px'
                                                }}>
                                                    {turno}
                                                </div>
                                                <div style={{ 
                                                    display: 'grid', 
                                                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                                    gap: '8px' 
                                                }}>
                                                    {slots
                                                        .sort((a, b) => {
                                                            const diaA = diasOrden.indexOf(a.dia_semana);
                                                            const diaB = diasOrden.indexOf(b.dia_semana);
                                                            if (diaA !== diaB) return diaA - diaB;
                                                            return a.hora_inicio.localeCompare(b.hora_inicio);
                                                        })
                                                        .map((slot, idx) => (
                                                            <div 
                                                                key={idx}
                                                                style={{
                                                                    padding: '10px',
                                                                    backgroundColor: '#fff',
                                                                    border: '1px solid #dee2e6',
                                                                    borderRadius: '4px',
                                                                    fontSize: '13px'
                                                                }}
                                                            >
                                                                <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                                                                    {slot.dia_semana}
                                                                </div>
                                                                <div style={{ color: '#6c757d', fontSize: '12px' }}>
                                                                    {slot.hora_inicio.substring(0, 5)} - {slot.hora_fin.substring(0, 5)}
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>

                        <div>
                            <div style={{ marginBottom: '24px' }}>
                                <h4 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                                    Materias que Imparte
                                </h4>
                                
                                {!infoProfesor?.materias || infoProfesor.materias.length === 0 ? (
                                    <div style={{ 
                                        padding: '16px', 
                                        textAlign: 'center', 
                                        color: '#6c757d',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '4px',
                                        fontSize: '13px'
                                    }}>
                                        Sin materias registradas
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {infoProfesor.materias.map((materia, idx) => (
                                            <div 
                                                key={idx}
                                                style={{
                                                    padding: '10px 12px',
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #dee2e6',
                                                    borderRadius: '4px',
                                                    fontSize: '13px'
                                                }}
                                            >
                                                {materia.nombre_materia}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <h4 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                                    Preferencias
                                </h4>
                                
                                {!preferencias ? (
                                    <div style={{ 
                                        padding: '16px', 
                                        textAlign: 'center', 
                                        color: '#6c757d',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '4px',
                                        fontSize: '13px'
                                    }}>
                                        Sin preferencias configuradas
                                    </div>
                                ) : (
                                    <div style={{ 
                                        backgroundColor: '#f8f9fa', 
                                        padding: '16px', 
                                        borderRadius: '4px',
                                        fontSize: '13px'
                                    }}>
                                        <div style={{ marginBottom: '12px' }}>
                                            <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                                                Horas máximas por día
                                            </div>
                                            <div style={{ color: '#495057' }}>
                                                {preferencias.max_horas_dia} horas
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: preferencias.comentarios_adicionales ? '12px' : '0' }}>
                                            <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                                                Preferencia de horario
                                            </div>
                                            <div style={{ 
                                                color: '#495057',
                                                textTransform: 'capitalize'
                                            }}>
                                                {preferencias.preferencia_horario}
                                            </div>
                                        </div>

                                        {preferencias.comentarios_adicionales && (
                                            <div>
                                                <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                                                    Comentarios
                                                </div>
                                                <div style={{ color: '#495057', lineHeight: '1.5' }}>
                                                    {preferencias.comentarios_adicionales}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {onClose && (
                    <div className="modal-footer">
                        <button 
                            onClick={onClose} 
                            className="btn btn--primary"
                        >
                            Cerrar
                        </button>
                    </div>
                )}
            </div>
    );

    // Si hay onClose, envolver en modal-overlay, sino renderizar directamente el panel
    return onClose ? (
        <div className="modal-overlay" onClick={onClose}>
            {contentPanel}
        </div>
    ) : contentPanel;
};

InfoProfesorModal.propTypes = {
    profesorNombre: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    infoProfesor: PropTypes.shape({
        disponibilidad: PropTypes.array,
        materias: PropTypes.array,
        preferencias: PropTypes.object
    }).isRequired
};

export default InfoProfesorModal;
