import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '' });
  const [comments, setComments] = useState({});

  useEffect(() => {
    fetch('http://localhost:3001/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  const handleCreatePost = (e) => {
    e.preventDefault();
    
    if (!newPost.title || !newPost.content || !newPost.author) {
      alert('Todos los campos son requeridos');
      return;
    }

    fetch('http://localhost:3001/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(post => {
        setPosts([...posts, post]);
        setNewPost({ title: '', content: '', author: '' });
      });
  };

  const handleAddComment = (postId, e) => {
    e.preventDefault();
    
    const comment = comments[postId];
    if (!comment || !comment.author || !comment.content) {
      alert('Todos los campos son requeridos');
      return;
    }

    fetch(`http://localhost:3001/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment)
    })
      .then(res => res.json())
      .then(newComment => {
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        ));
        setComments({ ...comments, [postId]: { author: '', content: '' } });
      });
  };

  const updateComment = (postId, field, value) => {
    setComments({
      ...comments,
      [postId]: {
        ...comments[postId],
        [field]: value
      }
    });
  };

  return (
    <div className="App">
      <h1>Blog Personal</h1>

      <div className="new-post-form">
        <h2>Crear Nuevo Post</h2>
        <form onSubmit={handleCreatePost}>
          <input
            type="text"
            placeholder="Título"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <textarea
            placeholder="Contenido"
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
          <input
            type="text"
            placeholder="Autor"
            value={newPost.author}
            onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
          />
          <button type="submit">Publicar</button>
        </form>
      </div>

      <div className="posts-list">
        <h2>Posts</h2>
        {posts.map(post => (
          <div key={post.id} className="post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p className="post-meta">Por {post.author} - {new Date(post.createdAt).toLocaleString()}</p>
            
            <div className="comments-section">
              <h4>Comentarios</h4>
              {post.comments.map(comment => (
                <div key={comment.id} className="comment">
                  <p>{comment.content}</p>
                  <p className="comment-meta">Por {comment.author} - {new Date(comment.createdAt).toLocaleString()}</p>
                </div>
              ))}
              
              <form onSubmit={(e) => handleAddComment(post.id, e)} className="comment-form">
                <input
                  type="text"
                  placeholder="Autor del comentario"
                  value={comments[post.id]?.author || ''}
                  onChange={(e) => updateComment(post.id, 'author', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Contenido del comentario"
                  value={comments[post.id]?.content || ''}
                  onChange={(e) => updateComment(post.id, 'content', e.target.value)}
                />
                <button type="submit">Agregar Comentario</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
