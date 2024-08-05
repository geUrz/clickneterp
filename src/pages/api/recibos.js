import pool from "@/libs/db";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { simple } = req.query;

        try {
            let query = '';
            let params = [];

            if (simple) {
                query = 'SELECT id, descripcion, createdAt, cliente_id FROM recibos';
            } else {
                query = `
                    SELECT 
                        recibos.id, 
                        recibos.descripcion, 
                        recibos.createdAt, 
                        clientes.cliente AS cliente
                    FROM 
                        recibos
                    JOIN 
                        clientes 
                    ON 
                        recibos.cliente_id = clientes.id
                `;
            }

            const [rows] = await pool.query(query, params)
            res.status(200).json(rows)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'POST') {
        const { cliente_id, descripcion } = req.body

        try {
            const [result] = await pool.query(
                'INSERT INTO recibos (cliente_id, descripcion) VALUES (?, ?)',
                [cliente_id, descripcion]
            );
            res.status(201).json({ id: result.insertId })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.query;

        try {
            const [result] = await pool.query(
                'DELETE FROM recibos WHERE id = ?',
                [id]
            );

            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Nota eliminada correctamente' });
            } else {
                res.status(404).json({ message: 'Nota no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}


