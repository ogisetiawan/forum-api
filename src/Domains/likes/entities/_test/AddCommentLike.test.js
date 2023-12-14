const AddCommentLike = require('../AddCommentLike');

describe('an AddCommentLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new AddCommentLike(payload))
        .toThrowError('ADD_COMMENT_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spec', () => {
    const payload = {
      userId: 123,
      commentId: 'x',
      threadId: true,
    };

    expect(() => new AddCommentLike(payload))
        .toThrowError('ADD_COMMENT_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddCommentLike object correctly', () => {
    const payload = {
      userId: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    const {userId, commentId, threadId} = new AddCommentLike(payload);

    expect(userId).toEqual(payload.userId);
    expect(commentId).toEqual(payload.commentId);
    expect(threadId).toEqual(payload.threadId);
  });
});
