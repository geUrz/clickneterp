import connection from "@/libs/db";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { simple } = req.query;

        try {
            let query = '';
            let params = [];

            if (simple) {
                query = 'SELECT id, descripcion, createdAt, cliente_id, usuario_id, createdId FROM recibos'
            } else {
                query = `
                    SELECT 
                        recibos.id, 
                        recibos.descripcion, 
                        recibos.createdAt, 
                        recibos.createdId, 
                        clientes.cliente AS cliente, 
                        usuarios.usuario AS usuario,
                        creador.usuario AS creador_usuario
                    FROM 
                        recibos
                    JOIN 
                        clientes 
                    ON 
                        recibos.cliente_id = clientes.id
                    JOIN
                        usuarios
                    ON
                        recibos.usuario_id = usuarios.id
                    JOIN
                        usuarios AS creador
                    ON
                        recibos.createdId = creador.id
                `
            }

            const [rows] = await connection.query(query, params)
            res.status(200).json(rows)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'POST') {
        const { usuario_id, cliente_id, descripcion, createdId  } = req.body

        try {
            const [result] = await connection.query(
                'INSERT INTO recibos (usuario_id, cliente_id, descripcion, createdId) VALUES (?, ?, ?, ?)',
                [usuario_id, cliente_id, descripcion, createdId ]
            )
            res.status(201).json({ id: result.insertId })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.query;

        try {
            const [result] = await connection.query(
                'DELETE FROM recibos WHERE id = ?',
                [id]
            );

            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Recibo eliminada correctamente' });
            } else {
                res.status(404).json({ message: 'Recibo no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}


