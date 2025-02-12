import { users } from "../bd.js";

export const getUsers = async (req, res) => {
  const { rows } = await users.query("select * from users");
  res.json(rows);
};

export const getUser = async (req, res) => {
  const { id } = req.params;

  const { rows } = await users.query("select * from users where id = $1", [id]);
  if (rows.length == 0) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  res.json(rows[0]);
};

export const createUser = async (req, res) => {
  try {
    const data = req.body;
    const { rows } = await users.query(
      "insert into users (name, email) values ($1, $2) RETURNING *",
      [data.name, data.email]
    );

    res.json(rows[0]);
  } catch (error) {
    if (error == "23505") {
      return res.status(409).json({ message: "Error correo ya existente " });
    }
  }

  return res.status(500).json({ message: "internal server error" });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { rowCount } = await users.query("delete from users where id = $1 ", [
    id,
  ]);
  if (rowCount == 0) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  return res.status(204);
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const { rows } = await users.query(
    "update users set name = $2, email = $3 where id = $1 RETURNING *",
    [id, data.name, data.email]
  );
  res.json(rows[0]);
};
