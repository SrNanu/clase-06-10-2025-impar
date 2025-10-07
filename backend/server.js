const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let posts = [];
let postIdCounter = 1;
let commentIdCounter = 1;

// GET /api/posts - Listar todos los posts con sus comentarios
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// POST /api/posts - Crear nuevo post
app.post('/api/posts', (req, res) => {
  const { title, content, author } = req.body;
  
  const newPost = {
    id: postIdCounter++,
    title,
    content,
    author,
    createdAt: new Date().toISOString(),
    comments: []
  };
  
  posts.push(newPost);
  res.status(201).json(newPost);
});

// POST /api/posts/:id/comments - Agregar comentario a un post
app.post('/api/posts/:id/comments', (req, res) => {
  const postId = parseInt(req.params.id);
  const { author, content } = req.body;
  
  const post = posts.find(p => p.id === postId);
  
  if (!post) {
    return res.status(404).json({ error: 'Post no encontrado' });
  }
  
  const newComment = {
    id: commentIdCounter++,
    author,
    content,
    createdAt: new Date().toISOString()
  };
  
  post.comments.push(newComment);
  res.status(201).json(newComment);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
