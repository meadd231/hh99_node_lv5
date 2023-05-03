const PostsController = require("../../../controllers/posts.controller");


// posts.service.js 에서는 아래 5개의 Method만을 사용합니다.
let mockPostService = {
  findAllPost: jest.fn(),
  findPostById: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
}

let mockRequest = {
  body: jest.fn(),
};

let mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

let postsController = new PostsController();
// postsController의 Service를 Mock Service로 변경합니다.
postsController.postService = mockPostService;

describe('Layered Architecture Pattern Posts Controller Unit Test', () => {

  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    mockResponse.status = jest.fn(() => {
      return mockResponse
    });
  })

  test('Posts Controller getPosts Method by Success', async () => {
    // TODO: 여기에 코드를 작성해야합니다.
  });

  test('Posts Controller createPost Method by Success', async () => {
    // TODO: 여기에 코드를 작성해야합니다.
  });

  test('Posts Controller createPost Method by Invalid Params Error', async () => {
    // TODO: 여기에 코드를 작성해야합니다.
  });

});