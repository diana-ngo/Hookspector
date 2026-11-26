import pool from './postgres.ts';

export type Bin = {
  id: string;
  name: string;
  created_at: Date;
};

export async function createBin(name: string): Promise<Bin> {
  const result = await pool.query<Bin>(
    `INSERT INTO bins (name)
    VALUES ($1)
    RETURNING id, name, created_at;`, [name]
  );

  const bin = result.rows[0];

  if (!bin) throw new Error('Insert into bins returned no row');
  return bin;
}