import React, { useState } from 'react';
import AnimatedLikeButton from './ui/AnimatedLikeButton';

const Post = () => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <div>
      {/* ...existing code... */}
      <AnimatedLikeButton onClick={handleLike} liked={liked} />
      {/* ...existing code... */}
    </div>
  );
};

export default Post;