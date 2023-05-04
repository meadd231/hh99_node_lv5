const PostService = require("../../../services/posts.service");

// mock Repository <- 의존성 주입하는 건가봐. 아닌가. 아닌 거 같음. 
// 의존성 주입은 Repository에서 model을 생성자의 인자로 받는 부분이 아닌가?
let mockPostsRepository = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

let postService = new PostService();
// postService의 Repository를 Mock Repository로 변경합니다.
postService.postRepository = mockPostsRepository;

describe('Layered Architecture Pattern Posts Service Unit Test', () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  })

  test('Posts Service findAll Method', async () => {

    // findAllPost Method를 실행했을 때, Return 값 입니다.
    const findAllPostReturnValue = [
      {
        postId: 1,
        nickname: "Nickname_1",
        title: "Title_1",
        createdAt: new Date('06 October 2011 15:50 UTC'),
        updatedAt: new Date('06 October 2011 15:50 UTC'),
      },
      {
        postId: 2,
        nickname: "Nickname_2",
        title: "Title_2",
        createdAt: new Date('07 October 2011 15:50 UTC'),
        updatedAt: new Date('07 October 2011 15:50 UTC'),
      },
    ]

    // Repository의 findAllPost Method를 Mocking하고, findAllPostReturnValue를 Return 값으로 변경합니다.
    mockPostsRepository.findAll = jest.fn(() => {
      return findAllPostReturnValue;
    })

    // PostService의 findAllPost Method를 실행합니다.
    const allPost = await postService.getPosts();

    // allPost의 값이 postRepository의 findAllPost Method 결과값을 내림차순으로 정렬한 것이 맞는지 검증합니다.
    expect(allPost).toEqual(
      findAllPostReturnValue.sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
    );

    // PostRepository의 findAllPost Method는 1번 호출되었는지 검증합니다.
    expect(mockPostsRepository.findAll).toHaveBeenCalledTimes(1);

  });


  /** deletePost의 비즈니스 로직**/
  // 1. postId를 이용해 게시글을 찾고 (PostRepository.findPostById)
  // 2. postId, password를 이용해 게시글을 삭제한다. (PostRepository.deletePost)
  test('Posts Service delete Method By Success', async () => {

    // postRepository의 findPostById Method Return 값을 설정하는 변수입니다.
    const findPostByIdReturnValue = {
      postId: 1,
      userId: 1,
      nickname: "Nickname_1",
      title: "Title_1",
      content: "Content_1",
      createdAt: new Date('06 October 2011 15:50 UTC'),
      updatedAt: new Date('06 October 2011 15:50 UTC'),
    }

    // Mock Post Repository의 findPostById Method의 Return 값을 findPostByIdReturnValue 변수로 변경합니다.
    mockPostsRepository.findOne = jest.fn(() => {
      return findPostByIdReturnValue;
    });

    const postData = {
      postId: 1,
      userId: 1
    };

    await postService.deletePost(postData);

    // 1. postId를 이용해 게시글을 찾고 (PostRepository.findPostById)
    expect(mockPostsRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.findOne).toHaveBeenCalledWith(findPostByIdReturnValue.postId);


    // 2. postId, password를 이용해 게시글을 삭제한다. (PostRepository.deletePost)
    expect(mockPostsRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.delete).toHaveBeenCalledWith(postData.userId);
  });


  /** deletePost의 비즈니스 로직**/
  // 1. postId를 이용해 게시글을 찾고 (PostRepository.findPostById)
  // 2. 찾은 게시글이 없을 때, Error가 발생합니다. ("Post doesn't exist");
  test('Posts Service deletePost Method By Not Found Post Error', async () => {

    // findPostById Method를 실행했을 때, 아무런 Post를 찾지 못하도록 수정합니다.
    const findPostByIdReturnValue = null;

    // Mock Post Repository의 findPostById Method의 Return 값을 findPostByIdReturnValue 변수(null)로 변경합니다.
    mockPostsRepository.findPostById = jest.fn(() => {
      return findPostByIdReturnValue;
    });

    const postData = {
      postId: 8888,
      userId: '1234'
    };

    try {
      const deletePost = await postService.deletePost(postData);
    } catch (error) {
      // catch가 보통 error가 터졌을 때 여기에 코드 흐름이 실행되는 건가?
      // 1. postId를 이용해 게시글을 찾고 (PostRepository.findPostById)
      expect(mockPostsRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockPostsRepository.findOne).toHaveBeenCalledWith(8888);

      // 2. 찾은 게시글이 없을 때, Error가 발생합니다. ("Post doesn't exist");
      expect(error.errorMessage).toEqual('게시글이 존재하지 않습니다.');
    }

  });

  /**
   1. given
   2. when
   3. then
   구조를 통해 작성하자
   */
  test('PostsService putPost Success Test', async () => {
    const postData = {
      userId: 1,
      postId: 1,
      title: 'putPost Title',
      content: 'putPost Content'
    };
    mockPostsRepository.findOne = jest.fn(() => postData);

    const { title, content, userId, postId } = postData;
    const updateValue = { title, content, updatedAt: Date.now() };
    const whereOption = { userId, postId };

    await postService.putPost(postData);
    expect(mockPostsRepository.update).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.update).toHaveBeenCalledWith(updateValue, whereOption);
  });
});