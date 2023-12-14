class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {id, username, date, content, is_deleted: isDeleted} = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDeleted ? '**komentar telah dihapus**' : content;
  }

  _verifyPayload({id, username, date, content, is_deleted: isDeleted}) {
    if (!id || !username || !date || !content) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' ||
        typeof username !== 'string' ||
        typeof date !== 'object' ||
        typeof content !== 'string' ||
        typeof isDeleted !== 'boolean') {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
