const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('./logs/logger');

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");

const router = require("./routes");

const app = express();
const port = 3000;

// swagger 미들웨어 사용
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
// 이거 안 써도 cookie를 받을 수는 있다고 알고 있음. 근대 cookies를 통해 쉽게 처리할 수 있게 해준다.
app.use(cookieParser());
// req.body에 json이 입력값으로 들어왔을 때 처리할 수 있게 해준다.
app.use(bodyParser.json());
// params나 query 같은 것을 해석한다는 느낌이긴 한데 정확히 모름.
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// 모든 요청을 indexRouter로 전달. 모든 요청을 routes/index.js에서 처리하기 위함.
app.use('/', router);

// HTTP 서버를 실행한다.
app.listen(port, () => {
  logger.info('Server is running on port 3000');
  console.log(port, '포트로 서버가 열렸어요!');
});
