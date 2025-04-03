import express, { Request, Response, NextFunction } from 'express';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite'; // Import Database from 'sqlite'

const app = express();
const port = 3000;

// Initialize SQLite database
let db: Database; 

(async () => {
  db = await open({
    filename: './mydb.sqlite',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT
    )
  `);

  console.log('Database initialized.');
})();

// Middleware example: Logging
const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

app.use(logger);

app.use(express.json());

// Routes
app.get('/items', async (req: Request, res: Response) => {
  try {
    const items = await db.all('SELECT * FROM items');
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

app.post('/items', async (req: Request, res: Response) => {
  const { name, description } = req.body;
  try {
    const result = await db.run('INSERT INTO items (name, description) VALUES (?, ?)', name, description);
    res.json({ id: result.lastID, name, description });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

app.get('/items/:id', async (req: Request, res: Response) => {
    try {
        const item = await db.get('SELECT * FROM items WHERE id = ?', req.params.id);
        if (item) {
            res.json(item);
        } else {
            res.status(404).send('Item not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }

});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
