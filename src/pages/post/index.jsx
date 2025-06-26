import { useNavigate } from 'react-router-dom';

const Post = () => {
  const navigate = useNavigate();

  return (
    <section>
      <h1> Bài viết - Post Page</h1>
      <button onClick={() => navigate('/post/1')}>Chi tiết</button>
    </section>
  );
};

export default Post;
