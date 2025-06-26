import { useParams } from 'react-router-dom';

const PostDetail = () => {
  const { id } = useParams();
  console.log('check id', id);
  return <div>Chi tiết bài viết: {id}</div>;
};

export default PostDetail;
