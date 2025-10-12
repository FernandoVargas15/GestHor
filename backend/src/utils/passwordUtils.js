import bcrypt from "bcrypt";

/**
 * Utilidad para hashear contraseñas
 * @param {string} plainPassword - Contraseña en texto plano
 * @param {number} saltRounds - Número de rondas para el salt (default: 10)
 * @returns {Promise<string>} Hash de la contraseña
 */
export const hashPassword = async (plainPassword, saltRounds = 10) => {
    try {
        const hash = await bcrypt.hash(plainPassword, saltRounds);
        return hash;
    } catch (error) {
        console.error("Error al hashear contraseña:", error);
        throw error;
    }
};

/**
 * Utilidad para comparar contraseña con hash
 * @param {string} plainPassword - Contraseña en texto plano
 * @param {string} hash - Hash almacenado
 * @returns {Promise<boolean>} true si coinciden, false si no
 */
export const comparePassword = async (plainPassword, hash) => {
    try {
        const match = await bcrypt.compare(plainPassword, hash);
        return match;
    } catch (error) {
        console.error("Error al comparar contraseña:", error);
        throw error;
    }
};

// Script para generar hash desde línea de comandos
// Uso: node src/utils/passwordUtils.js <contraseña>
if (process.argv[1] === import.meta.url.replace('file://', '')) {
    const password = process.argv[2];
    
    if (!password) {
        console.log("Uso: node src/utils/passwordUtils.js <contraseña>");
        console.log("Ejemplo: node src/utils/passwordUtils.js micontraseña123");
        process.exit(1);
    }
    
    hashPassword(password).then(hash => {
        console.log("\n=== Hash generado ===");
        console.log("Contraseña:", password);
        console.log("Hash:", hash);
        console.log("\nPuedes actualizar la base de datos con este hash:");
        console.log(`UPDATE usuarios SET password = '${hash}' WHERE email = 'tu@email.com';`);
        process.exit(0);
    }).catch(err => {
        console.error("Error:", err);
        process.exit(1);
    });
}
