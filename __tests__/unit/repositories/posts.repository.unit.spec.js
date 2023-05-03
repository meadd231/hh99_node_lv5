const PostRepository = require("../../../repositories/posts.repository");


// 가상 모델 생성
let mockPostsModel = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}

let postRepository = new PostRepository(mockPostsModel);

// 이건 뭐임? 잘 모르겠는데?
describe('Layered Architecture Pattern Posts Repository Unit Test', () => {

  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  })

  test('Posts Repository create Method', async () => {

    // create Mock의 Return 값을 "findAll String"으로 설정합니다.
    mockPostsModel.create = jest.fn(() => {
      return "create Return String"
    });

    // createPost Method를 실행하기 위해 필요한 Params 입니다.
    const createPostParams = {
      nickname: "createPostNickname",
      password: "createPostPassword",
      title: "createPostTitle",
      content: "createPostContent",
    }

    // postRepository의 createPost Method를 실행합니다.
    const createPostData = await postRepository.create(createPostParams);

    // createPostData는 postsModel의 create를 실행한 결과값을 바로 반환한 값인지 테스트합니다.
    expect(createPostData).toBe("create Return String");

    // postRepository의 createPost Method를 실행했을 때, postsModel의 create를 1번 실행합니다.
    expect(mockPostsModel.create).toHaveBeenCalledTimes(1);

    // postRepository의 createPost Method를 실행했을 때, postsModel의 create를 아래와 같은 값으로 호출합니다.
    expect(mockPostsModel.create).toHaveBeenCalledWith(createPostParams);
  });

  // 이거 테스트 하는 이유가 뭔지 모르겠음.
  /*
  뭘 테스트 하는 거임? 진짜 이유를 모르겠는데? Repository를 테스트 하는 거임?
  아 Repository에서 model의 함수를 제대로 호출하고 있는지를 확인하는 건가?
  제대로 호출하고 그 호출 값을 반환한다거나 이런 것들을 테스트 하는 게 아닐까?
  */
  test('Posts Repository findAll Method', async () => {

    // findAll Mock의 Return 값을 "findAll String"으로 설정합니다.
    mockPostsModel.findAll = jest.fn(() => {
      return "findAll String"
    });

    // postRepository의 findAllPost Method를 호출합니다.
    // posts는 postRepository의 함수다.
    const posts = await postRepository.findAll();

    // postsModel의 findAll은 1번만 호출 되었습니다.
    expect(postRepository.postsModel.findAll).toHaveBeenCalledTimes(1);

    // mockPostsModel의 Return과 출력된 findAll Method의 값이 일치하는지 비교합니다.
    expect(posts).toBe("findAll String");
  });

  // 나 지금 궁금한 게 테스트를 할 때 어떤 것들을 테스트해봐야 좋은 테스트가 되는 건지 궁금함.

  /**
   findOne test
   1. Model의 findOne Method를 호출한다.
   2. 한 번만 호출되는지 테스트
   3. 값이 제대로 호출되는지 테스트
   */
  test('Posts Repository findOne Method', async () => {
    mockPostsModel.findOne = jest.fn(() => {
      return 'findOne String'
    });
    const post = await postRepository.findOne();
    expect(postRepository.postsModel.findOne).toHaveBeenCalledTimes(1);
    expect(post).toBe('findOne String');
    expect(mockPostsModel.findOne).toHaveBeenCalledWith(createPostParams);
  });

  /**
   update test
   1. Model의 update Method를 호출한다.
   2. 한 번만 호출되는지 테스트
   */
  test('Posts Repository update Method', async () => {

  });

  test('Posts Repository delete Method', async () => {

  });

});