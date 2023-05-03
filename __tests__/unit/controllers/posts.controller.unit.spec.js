const PostsController = require('../../../controllers/posts.controller');

// posts.controller.js 에서는 아래 5개의 Method만을 사용합니다.
let mockPostService = {
  getPosts: jest.fn(),
  getPost: jest.fn(),
  postPost: jest.fn(),
  putPost: jest.fn(),
  deletePost: jest.fn(),
};

let mockRequest = {
  body: jest.fn(),
};

let mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
  locals: {
    user: jest.fn(),
  },
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
      return mockResponse;
    });
  });


  /** PostsController.getPosts 비즈니스 로직 **/
  // 1. PostService의 findAllPost Method를 1회 호출합니다.
  // 2. res.status는 1번 호출되고, 200의 값을 반환합니다.
  // 3. findAllPost Method에서 반환된 posts 변수의 값을 res.json Method를 이용해 { data: posts }의 형식으로 반환합니다.
  test('Posts Controller getPosts Method by Success', async () => {
    // PostService의 findAllPost Method를 실행했을 때 Return 값을 변수로 선언합니다.
    const postsReturnValue = [
      {
        postId: 2,
        nickname: 'Nickname_2',
        title: 'Title_2',
        createdAt: new Date('07 October 2011 15:50 UTC'),
        updatedAt: new Date('07 October 2011 15:50 UTC'),
      },
      {
        postId: 1,
        nickname: 'Nickname_1',
        title: 'Title_1',
        createdAt: new Date('06 October 2011 15:50 UTC'),
        updatedAt: new Date('06 October 2011 15:50 UTC'),
      },
    ];

    // PostService의 findAllPost Method를 실행했을 때 Return 값을 postsReturnValue 변수로 설정합니다.
    mockPostService.getPosts = jest.fn(() => postsReturnValue);

    // PostsController의 getPosts Method를 실행합니다.
    await postsController.getPosts(mockRequest, mockResponse);

    // 1. PostService의 findAllPost Method를 1회 호출합니다.
    expect(mockPostService.getPosts).toHaveBeenCalledTimes(1);

    // 2. res.status는 1번 호출되고, 200의 값을 반환합니다.
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    // 3. findAllPost Method에서 반환된 posts 변수의 값을 res.json Method를 이용해 { data: posts }의 형식으로 반환합니다.
    expect(mockResponse.json).toHaveBeenCalledWith({
      posts: postsReturnValue,
    });
  });


  /** PostsController.createPost 성공 케이스 **/
  // 1. req.body에 들어있는 값을 바탕으로 PostService.cretePost가 호출됩니다.
  // 2. res.status는 1번 호출되고, 201의 값으로 호출됩니다.
  // 3. PostService.cretePost에서 반환된 createPostData 변수를 이용해 res.json Method가 호출됩니다.
  test('Posts Controller postPost Method by Success', async () => {
    // PostsController의 createPost Method가 실행되기 위한 Body 입력 인자들입니다.
    const requestBodyParams = {
      title: 'TitleSuccess',
      content: 'ContentSuccess',
    };

    mockResponse.locals.user = {
      userId: 1,
      nickname: 'test',
    };

    const { title, content } = requestBodyParams;
    const { userId, nickname } = mockResponse.locals.user;
    const postData = { title, content, userId, nickname };

    // 입력 인자를 createPost Method를 실행할 때 삽입하지않고, mockRequest의 body를 createPostRequestBodyParams 변수로 설정합니다.
    mockRequest.body = requestBodyParams;

    // PostService의 createPost의 Return 값을 설정하는 변수입니다.
    const createPostReturnValue = {
      postId: 90,
      nickname: 'Nickname_Success',
      title: 'Title_Success',
      content: 'Content_Success',
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };

    // PostService.createPost Method의 Return 값을 createPostReturnValue 변수로 설정합니다.
    mockPostService.postPost = jest.fn(() => createPostReturnValue);

    // PostsController의 createPost Method를 실행합니다.
    await postsController.postPost(mockRequest, mockResponse);

    // 1. req.body에 들어있는 값을 바탕으로 PostService.cretePost가 호출됩니다.
    expect(mockPostService.postPost).toHaveBeenCalledTimes(1);
    expect(mockPostService.postPost).toHaveBeenCalledWith(postData);

    // 2. res.status는 1번 호출되고, 201의 값으로 호출됩니다.
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);

    // 3. PostService.cretePost에서 반환된 createPostData 변수를 이용해 res.json Method가 호출됩니다.
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "게시글 작성에 성공하였습니다."
    });
  });


  /** PostsController.createPost 에러 케이스 by InvalidParamsError **/
  // 1-1. req.body에 들어있는 값을 바탕으로 각 변수들이 객체 구조분해 할당됩니다.
  // 1-2. 필수로 전달되어야 하는 title 값이 존재하지 않아 InvalidParamsError가 발생합니다.
  // 1-3. res.status는 1번 호출되고, 400번의 Http Status Code가 호출됩니다.
  // 2. res.json의 값은 { errorMessage: "InvalidParamsError" }의 형식을 가집니다.
  test('Posts Controller postPost Method by Invalid Params Error', async () => {

    // PostsController의 createPost Method가 실행될 때 에러가 발생하는 Body 입력 인자들입니다.
    const invalidParams = {
      nickname: 'Nickname_InvalidParamsError',
    };

    // 입력 인자를 createPost Method를 실행할 때 삽입하지않고, mockRequest의 body를 설정합니다.
    mockRequest.body = invalidParams;

    // PostsController의 createPost Method를 실행합니다.
    await postsController.postPost(mockRequest, mockResponse);

    // 1-3. res.status는 1번 호출되고, 400번의 Http Status Code가 호출됩니다.
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(412);

    // 2. res.json Method가 호출될 때 { errorMessage: "InvalidParamsError" }의 형식을 가집니다.
    expect(mockResponse.json).toHaveBeenCalledWith({ errorMessage: '데이터 형식이 올바르지 않습니다.' });

  });
});