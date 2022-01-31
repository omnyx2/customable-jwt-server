<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Description  
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.  
  해당 프로젝트는 기능 추가가 용의하고 다른 사람이 수정을 하더라도 쉽게 수정이 가능하기 위한 구조를 고려하여 최대한 단순하게 만들었습니다.  
  MSA 단위에서 단단한 사용이 가능할 수 있도록 만들었습니다. 따라서 설치하고 즉시 실행하면 누구나 사용할 수 있도록 만들었습니다.
  가능하면 다양한 기능을 천천히 추가해나가고 싶습니다.
  사용 프레임워크는 Nestjs를 기반으로 작성되었습니다.

--- 

## 해당 프로젝트는 아래와 같은 기능을 가집니다.

### 동적 환경 변수
동적 환경 변수 변경, config 아래에서 .env 파일 아래에 있는 각 환경 설정을 실행 명령어에 따라 다르게 적용할수 있습니다.
  + yarn start:dev  #config/env/.development.env
  + yarn start:stage #config/env/.stage.env
  + yarn start:prod #config/env/.production.env

### 인증 및 인가 
+ 해당 서버는 인가를 자유롭게 설정이 가능합니다. user.entity.ts에서 AccessLevel은 인가의 레벨(number)의 형태이며, 이를 통해 url별로 인가에 대한 접근을 제어할 수 있습니다. 해당 접근의 레벨은 데코레이터 패턴을 이용한 @UseGuard를 사용해 적용할 수 있습니다.  
+ 해당 서버는 인증시 반드시 기관의 명칭이 포함되게 만들었습니다.소스 코드의 내부에는 affiliatedInstitution 항이 있는데 이부분이 서비스의 명칭 입니다. 이를 통해 요청시의 서비스가 어떤 서비스로 부터 왔는지 유추할 수 있게 하고 올바른 요청인지에 대해서 검토 합니다.
+ 해당 기능에 대해서는 많은 가능성을 열어 놓고 싶어 간단한 서비스 체크로만 끝을 냈습니다.
+ 리프레쉬 토큰 전략은 엑세스가 만료가 되면 리프레쉬를 통해 재발급이 가능하게 했습니다. 덧붙여,
    1. 리프레쉬 토큰은 디비에 저장됩니다. 
    2. 이는 유효기간동안 유효하며 다른 기기에서 로그인을 해도 리프레쉬가 있다면 추가 발급을 하지않고 넘겨줍니다. 
    3. 해당 로직 부분에 기기별 로그인 체크를 추가하셔될 듯합니다.
    4. 리프레쉬 토큰이 만료될시에 대해서는 401 에러를 던집니다. 
    5. 리프레쉬 토큰의 키와 엑세스 토큰의 키는 서로다른 값을 가질 수 있습니다.

### 로깅
+ 로깅에 대해 아직 미완인 기능 입니다.


--- 
# 실행

## Installation

```bash
$ yarn install
```

## DB 세팅
DB 연결에 대한 값은 ormconfig.json에서 설정해야 합니다.
typeORM프레임 워크를 사용했습니다. 따라서 다양한 DB와 설정이 가능합니다. 다만
typeORM 지원 레벨이 현재 Mongoose와는 잘 맞지않아 현재 있는 설정으로는 postgres, mysql과 같은 RDB 사용이 편합니다.
 

## Running the app

postgres 가 설치되어 있다는 가정하에 ormconfig.json설정후 config -> .env파일 수정후 구동할 프로덕션 레벨에 맞춰서 실행하면 됩니다.

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarnstart:prod
```


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
