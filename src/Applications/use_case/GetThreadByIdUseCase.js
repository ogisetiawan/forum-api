const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailCommentLike = require('../../Domains/likes/entities/DetailCommentLike');
const DetailReply = require('../../Domains/replies/entities/DetailReply');

class GetThreadByIdUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(id) {
    const thread = await this._threadRepository.getThreadById(id);
    let comments = await this._commentRepository.getCommentsByThreadId(id);
    const likes = await this._likeRepository.getCommentLikesCountByThreadId(id);
    const replies = await this._replyRepository.getRepliesByThreadId(id);

    comments = comments.map((comment) => {
      return {
        ...new DetailComment(comment),
        likeCount: new DetailCommentLike(
            likes.filter((like) => like.comment_id === comment.id)[0],
        ).likes,
        replies: replies.filter((reply) => reply.comment_id === comment.id)
            .map((reply) => ({...new DetailReply(reply)})),
      };
    });

    return {...thread, comments};
  }
}

module.exports = GetThreadByIdUseCase;
