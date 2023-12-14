const autoBind = require('auto-bind');
const LikeUnlikeUseCase =
    require('../../../../Applications/use_case/LikeUnlikeUseCase');

class LikesHandler {
  constructor(container) {
    this._container = container;

    autoBind(this);
  }

  async putCommentLikeHandler(request) {
    const {threadId, commentId} = request.params;
    const payload = {
      userId: request.auth.credentials.id,
      commentId,
      threadId,
    };

    const likeUnlikeUseCase = this._container
        .getInstance(LikeUnlikeUseCase.name);

    await likeUnlikeUseCase.execute(payload);

    return {status: 'success'};
  }
}

module.exports = LikesHandler;
