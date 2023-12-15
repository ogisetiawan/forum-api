const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository =
    require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('GetThreadByIdUseCase', () => {
  it('should orchestrating the get thread by id action correctly', async () => {
    const useCasePayload = {id: 'thread-123'};
    const currentDate = new Date();
    const expectedThread = {
      id: 'thread-123',
      title: 'some thread',
      body: 'anything',
      date: currentDate,
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: currentDate,
          content: 'x',
          likeCount: 1,
          replies: [
            {
              id: 'reply-123',
              content: 'some reply',
              date: currentDate,
              username: 'dicoding',
            },
          ],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(
        new DetailThread({
          id: 'thread-123',
          title: 'some thread',
          body: 'anything',
          date: currentDate,
          username: 'dicoding',
        }),
    ));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(
        [
          {
            id: 'comment-123',
            username: 'dicoding',
            date: currentDate,
            content: 'x',
            is_deleted: false,
          },
        ],
    ));
    mockLikeRepository.getCommentLikesCountByThreadId = jest
        .fn(() => Promise.resolve([
          {
            comment_id: 'comment-123',
            likes: 1,
          },
        ]));
    mockReplyRepository.getRepliesByThreadId = jest.fn(() => Promise.resolve(
        [
          {
            id: 'reply-123',
            comment_id: 'comment-123',
            content: 'some reply',
            date: currentDate,
            is_deleted: false,
            username: 'dicoding',
          },
        ],
    ));

    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const thread = await getThreadByIdUseCase.execute(useCasePayload.id);

    expect(thread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.getThreadById)
        .toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.getCommentsByThreadId)
        .toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.getRepliesByThreadId)
        .toBeCalledWith(useCasePayload.id);
  });

  it('should not display deleted content', async () => {
    const useCasePayload = {id: 'thread-123'};
    const currentDate = new Date();
    const expectedThread = {
      id: 'thread-123',
      title: 'some thread',
      body: 'anything',
      date: currentDate,
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding',
          date: currentDate,
          content: 'x',
          likeCount: 0,
          replies: [
            {
              id: 'reply-123',
              content: '**balasan telah dihapus**',
              date: currentDate,
              username: 'dicoding',
            },
          ],
        },
        {
          id: 'comment-124',
          username: 'dicoding',
          date: currentDate,
          content: '**komentar telah dihapus**',
          likeCount: 0,
          replies: [],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(
        new DetailThread({
          id: 'thread-123',
          title: 'some thread',
          body: 'anything',
          date: currentDate,
          username: 'dicoding',
        }),
    ));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(
        [
          {
            id: 'comment-123',
            username: 'dicoding',
            date: currentDate,
            content: 'x',
            is_deleted: false,
          },
          {
            id: 'comment-124',
            username: 'dicoding',
            date: currentDate,
            content: 'x',
            is_deleted: true,
          },
        ],
    ));
    mockLikeRepository.getCommentLikesCountByThreadId = jest
        .fn(() => Promise.resolve([
          {
            comment_id: 'comment-123',
            likes: 0,
          },
          {
            comment_id: 'comment-124',
            likes: 0,
          },
        ]));
    mockReplyRepository.getRepliesByThreadId = jest.fn(() => Promise.resolve(
        [
          {
            id: 'reply-123',
            comment_id: 'comment-123',
            content: 'some reply',
            date: currentDate,
            is_deleted: true,
            username: 'dicoding',
          },
        ],
    ));

    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    const thread = await getThreadByIdUseCase.execute(useCasePayload.id);

    expect(thread).toStrictEqual(expectedThread);
    expect(mockThreadRepository.getThreadById)
        .toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.getCommentsByThreadId)
        .toBeCalledWith(useCasePayload.id);
    expect(mockReplyRepository.getRepliesByThreadId)
        .toBeCalledWith(useCasePayload.id);
  });
});
