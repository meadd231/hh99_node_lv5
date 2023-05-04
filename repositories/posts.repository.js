class PostRepository {
  constructor (postsModel) {
    this.postsModel = postsModel;
  }
  create = async (input) => {
    await this.postsModel.create(input);
  }

  findAll = async () => {
    const posts = await this.postsModel.findAll();
    // const posts1 = await this.postsModel.findAll({
    //   order: [["createdAt", "desc"]],
    // });
    return posts;
  }

  findOne = async (postId) => {
    return await this.postsModel.findOne({
      where: { postId }
    });
  }

  // 어떤 값들을 매개변수로 받아와야 할까?
  update = async (updateValue, whereOption) => {
    await this.postsModel.update(updateValue, { where: whereOption });
  }

  delete = async (postId) => {
    await this.postsModel.destroy({
      where: { postId },
    });
  }

  // 좋아요 숫자를 감소시키는 메소드
  decrementLike = async (input) => {
    // 해당 colum의 by만큼 감소시킴.
    await this.postsModel.decrement('likes', {
      by: 1,
      // Op.and는 WHERE에서 AND를 사용하기 위해 쓰는 연산자임.
      where: input,
    });
  }

  // 좋아요 숫자를 증가시키는 메소드
  incrementLike = async (input) => {
    await this.postsModel.increment('likes', {
      by: 1,
      where: input,
    });
  }
}

module.exports = PostRepository;