import { useMemo, useState, useEffect } from "react";
import { 
    obtenerSolicitudesPendientes,
    obtenerEstadisticasSolicitudes,
    regenerarPassword,
    obtenerActividadesRecientes
} from "../../services/solicitudRecuperacionService";

function calcularTiempoTranscurrido(fechaSolicitud) {
    const ahora = new Date();
    const fecha = new Date(fechaSolicitud);
    const diferencia = ahora - fecha;
    
    const minutos = Math.floor(diferencia / 60000);
    const horas = Math.floor(diferencia / 3600000);
    const dias = Math.floor(diferencia / 86400000);
    
    if (minutos < 1) return 'Ahora mismo';
    if (minutos < 60) return `Hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    if (horas < 24) return `Hace ${horas} hora${horas !== 1 ? 's' : ''}`;
    return `Hace ${dias} día${dias !== 1 ? 's' : ''}`;
}

export default function Solicitudes() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activity, setActivity] = useState([]);

    const [resueltasHoy, setResueltasHoy] = useState(0);
    const totalMes = activity.length + resueltasHoy + requests.length;

    useEffect(() => {
        cargarSolicitudes();
        cargarEstadisticas();
        cargarActividades();
    }, []);

    const cargarSolicitudes = async () => {
        try {
            setLoading(true);
            const response = await obtenerSolicitudesPendientes();
            if (response.ok) {
                const solicitudesFormateadas = response.solicitudes.map(sol => ({
                    id: sol.solicitud_id,
                    solicitudId: sol.solicitud_id,
                    usuarioId: sol.usuario_id,
                    nombre: sol.nombre_completo || 'Usuario sin nombre',
                    usuario: sol.email.split('@')[0],
                    email: sol.email,
                    recibido: calcularTiempoTranscurrido(sol.fecha_solicitud),
                    motivo: sol.motivo,
                    prioridad: 'NORMAL'
                }));
                setRequests(solicitudesFormateadas);
            }
        } catch (error) {
            console.error('Error al cargar solicitudes:', error);
            alert('Error al cargar las solicitudes');
        } finally {
            setLoading(false);
        }
    };

    const cargarEstadisticas = async () => {
        try {
            const response = await obtenerEstadisticasSolicitudes();
            if (response.ok) {
                setResueltasHoy(parseInt(response.estadisticas.resueltas_hoy) || 0);
            }
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    const cargarActividades = async () => {
        try {
            const response = await obtenerActividadesRecientes(10);
            if (response.ok) {
                const actividadesFormateadas = response.actividades.map(act => ({
                    id: act.actividad_id,
                    text: act.descripcion,
                    type: act.tipo_actividad === 'PASSWORD_GENERADO' ? 'success' : 'info',
                    when: calcularTiempoTranscurrido(act.fecha_actividad)
                }));
                setActivity(actividadesFormateadas);
            }
        } catch (error) {
            console.error('Error al cargar actividades:', error);
        }
    };

    const stats = useMemo(
        () => ({
            pendientes: requests.length,
            resueltasHoy,
            totalMes,
        }),
        [requests.length, resueltasHoy, totalMes]
    );

    const priorityStyles = (p) => {
        if (p === "URGENTE")
            return {
                bg: "#fff7ed",
                border: "#fed7aa",
                pillBg: "#fef3c7",
                pillColor: "#a16207",
            };
        if (p === "NORMAL")
            return {
                bg: "#fffbeb",
                border: "#fde68a",
                pillBg: "#fef3c7",
                pillColor: "#92400e",
            };
        return {
            bg: "#eff6ff",
            border: "#bfdbfe",
            pillBg: "#e0f2fe",
            pillColor: "#075985",
        }; // BAJA
    };

    const addActivity = (text, type = "info") => {
        setActivity((arr) =>
            [
                { id: crypto.randomUUID(), text, type, when: "Ahora mismo" },
                ...arr,
            ].slice(0, 8)
        );
        cargarActividades();
    };

    const removeRequest = (id) => {
        setRequests((arr) => arr.filter((r) => r.id !== id));
    };

    const generateNewPassword = async (req) => {
        const ok = confirm(
            `¿Generar nueva contraseña para ${req.nombre}?\n\n` +
            `Se enviará una nueva llave de acceso al correo ${req.email}\n\n` +
            `Esta acción reemplazará la contraseña anterior.`
        );
        if (!ok) return;

        try {
            const response = await regenerarPassword(req.solicitudId);
            
            if (response.ok) {
                removeRequest(req.id);
                setResueltasHoy((n) => n + 1);
                cargarActividades();
                alert(
                    `✅ Contraseña regenerada exitosamente\n\n` +
                    `Nueva llave de acceso: ${response.nuevoToken}\n\n` +
                    `Se ha enviado un correo a ${req.email} con la nueva llave.`
                );
            }
        } catch (error) {
            console.error('Error al generar contraseña:', error);
            alert('Error al procesar la solicitud: ' + (error.response?.data?.mensaje || error.message));
        }
    };

    const contactUser = (req) => {
        const msg = prompt(
            `Escribe el mensaje para ${req.email}:`,
            "Hola, recibimos tu solicitud. Te contactamos para verificar tu identidad antes de proceder."
        );
        if (!msg) return;
        addActivity(`Contacto enviado a ${req.nombre}`, "info");
        alert("Mensaje enviado.");
    };

    const markAllAsRead = async () => {
        if (!requests.length) return;
        if (!confirm("¿Marcar todas las solicitudes como leídas sin generar contraseñas?")) return;
        
        try {
            setResueltasHoy((n) => n + requests.length);
            setRequests([]);
            addActivity(
                "Todas las solicitudes pendientes fueron marcadas como leídas.",
                "success"
            );
        } catch (error) {
            console.error('Error al marcar solicitudes:', error);
            alert('Error al procesar las solicitudes');
        }
    };

    const refresh = () => {
        cargarSolicitudes();
        cargarEstadisticas();
        cargarActividades();
    };

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <h2 className="main__title" style={{ margin: 0 }}>
                    Solicitudes de ayuda
                </h2>
                <p className="main__subtitle" style={{ marginTop: 4 }}>
                    Gestionar solicitudes de contraseñas perdidas
                </p>
            </div>

            {/*  Stats */}
            <div
                className="grid"
                style={{
                    gap: 16,
                    gridTemplateColumns: "repeat(3, minmax(0,1fr))",
                    marginBottom: 16,
                }}
            >
                <div className="card">
                    <div style={{ color: "var(--muted)" }}>Solicitudes Pendientes</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "#ea580c" }}>
                        {stats.pendientes}
                    </div>
                </div>
                <div className="card">
                    <div style={{ color: "var(--muted)" }}>Resueltas Hoy</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "#16a34a" }}>
                        {stats.resueltasHoy}
                    </div>
                </div>
                <div className="card">
                    <div style={{ color: "var(--muted)" }}>Total del Mes</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "#2563eb" }}>
                        {stats.totalMes}
                    </div>
                </div>
            </div>

            {/* Lista de pendientes */}
            <div className="card" style={{ marginBottom: 16 }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                    }}
                >
                    <h3 style={{ margin: 0 }}>Solicitudes Pendientes</h3>
                    <div>
                        <button className="link-btn" onClick={markAllAsRead}>
                            Marcar todas como leídas
                        </button>
                        <button className="link-btn" onClick={refresh}>
                            Actualizar
                        </button>
                    </div>
                </div>

                <div className="grid" style={{ gap: 12 }}>
                    {loading ? (
                        <div className="form__hint">Cargando solicitudes...</div>
                    ) : requests.map((req) => {
                        const s = priorityStyles(req.prioridad);
                        return (
                            <div
                                key={req.id}
                                className="card"
                                style={{ background: s.bg, borderColor: s.border }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        gap: 8,
                                    }}
                                >
                  <div style={{ display: "flex", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{req.nombre}</div>
                      <div className="form__hint">Recibido: {req.recibido}</div>
                    </div>
                  </div>                                    <span
                                        style={{
                                            fontSize: 11,
                                            padding: "4px 8px",
                                            borderRadius: 999,
                                            background: s.pillBg,
                                            color: s.pillColor,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {req.prioridad}
                                    </span>
                                </div>

                                <div style={{ marginTop: 8 }}>
                                    <div style={{ fontSize: 14, color: "var(--text)" }}>
                                        <strong>Email:</strong> {req.email}
                                    </div>
                                    <div style={{ fontSize: 14, marginTop: 4 }}>
                                        <strong>Motivo:</strong> {req.motivo}
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                                    <button
                                        className="btn btn--primary"
                                        onClick={() => generateNewPassword(req)}
                                    >
                                        Generar Nueva Contraseña
                                    </button>
                                    <button className="btn" onClick={() => contactUser(req)}>
                                        Contactar
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {!loading && requests.length === 0 && (
                        <div className="form__hint">No hay solicitudes pendientes.</div>
                    )}
                </div>
            </div>

            {/* Actividad reciente */}
            <div className="card">
                <h3 style={{ marginTop: 0 }}>Actividad Reciente</h3>

                <div className="grid" style={{ gap: 8 }}>
                    {activity.map((a) => (
                        <div
                            key={a.id}
                            className="card"
                            style={{
                                padding: 10,
                                background: a.type === "success" ? "#ecfdf5" : "#eff6ff",
                                borderColor: a.type === "success" ? "#a7f3d0" : "#bfdbfe",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <div style={{ fontSize: 14 }}>{a.text}</div>
                                <div className="form__hint">{a.when}</div>
                            </div>
                        </div>
                    ))}
                    {activity.length === 0 && (
                        <div className="form__hint">Sin actividad aún.</div>
                    )}
                </div>
            </div>
        </>
    );
}
