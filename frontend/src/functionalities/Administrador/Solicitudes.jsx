import { useMemo, useState } from "react";

function randPassword(len = 8) {
    //Se agrego para generar contraseñas aleatorias temporalmente (simulacion)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

const initialRequests = [
    {
        id: crypto.randomUUID(),
        nombre: "Prof. Ana Martínez",
        usuario: "ana.martinez",
        matricula: "MAT003",
        email: "ana.martinez@escuela.edu",
        recibido: "Hace 2 horas",
        prioridad: "URGENTE",
        motivo:
            "Olvidé mi contraseña después de las vacaciones. Necesito acceder urgentemente para preparar las clases de mañana.",
    },
    {
        id: crypto.randomUUID(),
        nombre: "Prof. Roberto Silva",
        usuario: "roberto.silva",
        matricula: "MAT007",
        email: "roberto.silva@escuela.edu",
        recibido: "Hace 5 horas",
        prioridad: "NORMAL",
        motivo:
            "Mi contraseña no funciona desde que cambié mi teléfono. Creo que tenía guardada la contraseña anterior.",
    },
    {
        id: crypto.randomUUID(),
        nombre: "Prof. Carmen López",
        usuario: "carmen.lopez",
        matricula: "MAT012",
        email: "carmen.lopez@escuela.edu",
        recibido: "Hace 1 día",
        prioridad: "BAJA",
        motivo:
            "Soy nueva en el sistema y nunca recibí mis credenciales iniciales. Necesito acceso para revisar mi horario asignado.",
    },
];

export default function Solicitudes() {
    const [requests, setRequests] = useState(initialRequests);
    const [activity, setActivity] = useState([
        { id: crypto.randomUUID(), text: "Nueva contraseña enviada a Prof. Juan Pérez", type: "success", when: "Hace 30 minutos" },
        { id: crypto.randomUUID(), text: "Contacto enviado a Prof. María García", type: "info", when: "Hace 1 hora" },
        { id: crypto.randomUUID(), text: "Credenciales iniciales enviadas a Prof. Luis Rodríguez", type: "success", when: "Hace 2 horas" },
    ]);

    const [resueltasHoy, setResueltasHoy] = useState(0);
    const totalMes = activity.length + resueltasHoy + requests.length;

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
            return { bg: "#fff7ed", border: "#fed7aa", pillBg: "#fef3c7", pillColor: "#a16207" };
        if (p === "NORMAL")
            return { bg: "#fffbeb", border: "#fde68a", pillBg: "#fef3c7", pillColor: "#92400e" };
        return { bg: "#eff6ff", border: "#bfdbfe", pillBg: "#e0f2fe", pillColor: "#075985" }; // BAJA
    };

    const addActivity = (text, type = "info") => {
        setActivity((arr) => [{ id: crypto.randomUUID(), text, type, when: "Ahora mismo" }, ...arr].slice(0, 8));
    };

    const removeRequest = (id) => {
        setRequests((arr) => arr.filter((r) => r.id !== id));
    };

    const generateNewPassword = (req) => {
        const pwd = randPassword();
        const ok = confirm(
            `¿Generar nueva contraseña para ${req.usuario}?\n\n` +
            `Nueva contraseña temporal: ${pwd}\n\n` +
            `Se recomienda cambiarla al primer inicio de sesión.`
        );
        if (!ok) return;
        removeRequest(req.id);
        setResueltasHoy((n) => n + 1);
        addActivity(`Nueva contraseña enviada a ${req.nombre}`, "success");
        alert(`Contraseña enviada a ${req.email}\n\nTemporal: ${pwd}`);
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

    const viewDetails = (req) => {
        alert(
            `Detalles del Usuario\n\n` +
            `Nombre: ${req.nombre}\n` +
            `Usuario: ${req.usuario}\n` +
            `Matrícula: ${req.matricula}\n` +
            `Email: ${req.email}\n` +
            `Recibido: ${req.recibido}\n` +
            `Prioridad: ${req.prioridad}\n\n` +
            `Motivo: ${req.motivo}`
        );
    };

    const markAllAsRead = () => {
        if (!requests.length) return;
        if (!confirm("¿Marcar todas las solicitudes como leídas?")) return;
        setResueltasHoy((n) => n + requests.length);
        setRequests([]);
        addActivity("Todas las solicitudes pendientes fueron procesadas.", "success");
    };

    const refresh = () => {
        // Simulación de refresh
        alert("Lista de solicitudes actualizada.");
    };

    return (
        <>
            <div style={{ marginBottom: 16 }}>
                <h2 className="main__title" style={{ margin: 0 }}>Solicitudes de Recuperación</h2>
                <p className="main__subtitle" style={{ marginTop: 4 }}>
                    Gestionar solicitudes de contraseñas perdidas
                </p>
            </div>

            {/*  Stats */}
            <div className="grid" style={{ gap: 16, gridTemplateColumns: "repeat(3, minmax(0,1fr))", marginBottom: 16 }}>
                <div className="card">
                    <div style={{ color: "var(--muted)" }}>Solicitudes Pendientes</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "#ea580c" }}>{stats.pendientes}</div>
                </div>
                <div className="card">
                    <div style={{ color: "var(--muted)" }}>Resueltas Hoy</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "#16a34a" }}>{stats.resueltasHoy}</div>
                </div>
                <div className="card">
                    <div style={{ color: "var(--muted)" }}>Total del Mes</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "#2563eb" }}>{stats.totalMes}</div>
                </div>
            </div>

            {/* Lista de pendientes */}
            <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <h3 style={{ margin: 0 }}>Solicitudes Pendientes</h3>
                    <div>
                        <button className="link-btn" onClick={markAllAsRead}>Marcar todas como leídas</button>
                        <button className="link-btn" onClick={refresh}>Actualizar</button>
                    </div>
                </div>

                <div className="grid" style={{ gap: 12 }}>
                    {requests.map((req) => {
                        const s = priorityStyles(req.prioridad);
                        return (
                            <div
                                key={req.id}
                                className="card"
                                style={{ background: s.bg, borderColor: s.border }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                                    <div style={{ display: "flex", gap: 12 }}>
                                        <div>
                                            <div style={{ fontWeight: 700 }}>{req.nombre}</div>
                                            <div className="form__hint">Usuario: {req.usuario} | Matrícula: {req.matricula}</div>
                                            <div className="form__hint">Recibido: {req.recibido}</div>
                                        </div>
                                    </div>

                                    <span
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
                                    <button className="btn btn--primary" onClick={() => generateNewPassword(req)}>
                                        Generar Nueva Contraseña
                                    </button>
                                    <button className="btn" onClick={() => contactUser(req)}>Contactar</button>
                                    <button className="btn" onClick={() => viewDetails(req)}>Ver Detalles</button>
                                </div>
                            </div>
                        );
                    })}

                    {requests.length === 0 && (
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
                                background:
                                    a.type === "success" ? "#ecfdf5" : "#eff6ff",
                                borderColor:
                                    a.type === "success" ? "#a7f3d0" : "#bfdbfe",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ fontSize: 14 }}>{a.text}</div>
                                <div className="form__hint">{a.when}</div>
                            </div>
                        </div>
                    ))}
                    {activity.length === 0 && <div className="form__hint">Sin actividad aún.</div>}
                </div>
            </div>
        </>
    );
}
