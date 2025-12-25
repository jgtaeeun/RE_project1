# RE_project1
### 프로젝트 목표
- 첫 백엔드 프로젝트를 통해 개발의 기초를 다졌지만, 완성도 면에서 아쉬움이 남았습니다. 과거의 코드를 다시 마주하며 부족했던 예외 처리나 데이터베이스 설계를 보수하는 과정을 통해 보다 나은 코드를 만드는 경험을 하고자 했습니다.
- 요양 병원 정보와 건강 데이터를 제공하는 기능은 사회적으로 꼭 필요한 정보라고 판단했고, 단순히 개발 연습에 그치지 않고 실제 배포를 통해 사용자들에게 도움을 주는 서비스를 만들고 싶어 고도화를 결정했습니다.

|주요목표|자질|
|:--:|:--:|
|코드 분석 및 리팩토링 (기본기)|기존의 불안정한 코드를 안정적으로 바꾸기 위해 테스트 환경을 구축|
|기능 확장 및 DB 설계 (설계 능력)|데이터 무결성을 위해 정규화를 진행 <br> 검색 기능 구현 시 인덱스(Index)를 어떻게 활용했는지<br> 알고리즘 추천 시 어떤 기준으로 쿼리를 최적화했는지|
|다중 접속 및 로그 분석 (고급 역량)|JMeter나 nGrinder 같은 도구로 부하 테스트 <br>단순 저장이 아니라, ELK 스택 등을 활용해 의미 있는 데이터를 추출 |

### 프로젝트 진행계획

|주차|계획|
|:--:|:--:|
|1주차|프론트 코드 페이지별 분석(홈화면, 마이페이지, 병원검색, 건강정보) <br> 백엔드 코드 기능별 분석(컨트롤러, 서비스, REPO, CONFIG) <br>  백엔드 코드 수정 (토큰로그인/OAUTH로그인/마이페이지/데이터베이스)|
|2주차|기능 추가(게시판글에서는 댓댓글기능, 페이지이동기능/건강정보 기능에서는 알고리즘 추천, 음성검색기능, 동영상첨부나 링크 연결) <br>  DB 기능 추가(로그인 시 개인정보 보안, 효율을 위한 테이블 연결, 외래키, OAUTH로그인 시 보안측면 고려)|
|3주차|다중접속, 사용자기록 로그 분석, AI 추천기능 추가|

### 1주차 진행상황 기록
#### 1일차(12/23)
- 프론트 코드 페이지별 분석

|페이지|프론트코드|백엔드코드|수정사항|
|:--:|:--:|:--:|:--:|
|로그인|유효성검사|회원정보 중복확인|토큰방식 로그인|
|마이페이지|찜하기|찜하기|테이블 정규화|
|병원검색|조건입력, 카카오맵연동|조건출력|데이터공백확인|
|건강백과사전|api데이터 활용|||
|게시판/qna|제목,작성자,내용 카테고리별 검색기능, 미리보기기능,  페이징기능, 날짜내림차순정렬|게시글 입출력,로그인유무||

- 백엔드 코드 기능별 분석(컨트롤러, 서비스, REPO, CONFIG)
  
```
project0819/src/main/java/edu/pnu
├── 📁 config
│   ├── CustomAuthenticationSuccessHandler.java  # OAuth2 로그인 성공 후 처리 로직
│   ├── CustomOAuth2UserService.java           # 구글 로그인 정보를 Member 테이블 규격에 맞게 변환
│   ├── JpaConfig.java                         # JpaTransactionManager 설정
│   └── SecurityConfig.java                    # CORS, 로그인/로그아웃, 세션 및 요청 권한 설정
├── 📁 controller
│   ├── BoardController.java                   # 게시글 및 댓글 CRUD API
│   ├── QnaController.java                     # Q&A 게시글 및 댓글 CRUD API
│   ├── CardDetailController.java              # 병원 조건 검색 및 요약 정보 리스트 조회
│   ├── FavoriteController.java                # 병원 찜하기/취소 및 즐겨찾기 목록 조회
│   ├── InformationController.java             # 지역·인력 조건 기반 병원 상세 검색
│   ├── LoginController.java                   # 일반/구글 로그인 처리 및 쿠키 관리
│   ├── MemberController.java                  # 회원가입 및 중복 회원 검증
│   └── SessionController.java                 # 로그인 상태 유지 체크 및 마이페이지 데이터
├── 📁 domain
│   ├── Board.java / BoardRe.java              # 게시판 및 댓글 엔티티
│   ├── Qna.java / QnaRe.java                  # Q&A 및 댓글 엔티티
│   ├── Sidosigungu.java                       # 시도/시군구 행정구역 정보
│   ├── Doctor.java / Person.java              # 병원 인력 및 관련 정보
│   ├── Information.java                       # 병원 기본 정보
│   ├── Level.java                             # 병원 등급
│   ├── Member.java                            # 회원 정보
│   ├── Favorites.java                         # 찜한 병원 (즐겨찾기)
│   └── LoginRequest.java                      # 로그인 요청 DTO
├── 📁 persistence
│   ├── BoardRepository.java                   # 게시판 데이터 접근
│   ├── BoardReRepository.java                 # 게시판 댓글 데이터 접근
│   ├── QnaRepository.java                     # Q&A 데이터 접근
│   ├── QnaReRepository.java                   # Q&A 댓글 데이터 접근
│   ├── SidosigunguRepository.java             # 행정구역 데이터 조회
│   ├── DoctorRepository.java                  # 의료진 데이터 조회
│   ├── PersonRepository.java                  # 인력 관련 데이터 조회
│   ├── InformationRepository.java             # 병원 정보 데이터 조회
│   ├── LevelRepository.java                   # 등급 데이터 조회
│   ├── MemberRepository.java                  # 회원 데이터 처리
│   └── FavoritesRepository.java               # 즐겨찾기 데이터 처리
└── 📁 service
    ├── BoardService.java                      # 게시판 비즈니스 로직
    ├── QnaService.java                        # Q&A 비즈니스 로직
    ├── InformationService.java                # 병원 정보 검색 및 필터링 로직
    ├── MemberService.java                     # 회원 가입 및 정보 관리
    ├── FavoriteService.java                   # 즐겨찾기 추가/삭제 로직
    └── LoginService.java                      # 비밀번호 암호화(BCrypt) 및 로그인 검증
```
#### 2일차(12/25)

- 계층형 아키텍처
  
|계층|역할|
|:--:|:--:|
|Domain |데이터베이스의 테이블과 1:1로 매핑되는 객체(Entity)|
|Repository|DB에 데이터를 저장, 조회, 수정, 삭제(CRUD)하는 작업을 수행합니다. <br> 스프링 데이터 JPA를 사용하면 인터페이스만 선언해도 구현체가 자동으로 생성됩니다. <br> 서비스(Service) 계층에서 요청을 받아 DB와 통신합니다.|
|Service|여러 레포지토리를 조합하거나, 복잡한 계산, 트랜잭션 처리를 담당합니다.<br>컨트롤러로부터 요청을 받아 비즈니스 로직을 수행한 후, 결과를 다시 컨트롤러에 넘겨줍니다.|
|Controller|사용자의 요청(HTTP Request)을 가장 먼저 받는 관문입니다.<br>클라이언트 ↔ 컨트롤러 ↔ 서비스.|
|Config (설정)|외부 라이브러리 설정<br>보안 설정(Spring Security)<br> CORS 설정<br>특정 빈(Bean)을 수동으로 등록할 때|

- 주요 계층별로 반드시 알아야 할 핵심 어노테이션
  1. Controller
    - @CrossOrigin(origins = "http://localhost:3000"): 웹 브라우저는 보안상의 이유로, 다른 도메인으로 요청을 보내는 것을 기본적으로 차단합니다. 
    - @Controller: 해당 클래스가 Spring MVC 컨트롤러임을 나타냅니다. (View를 반환할 때 사용)
    - @RestController: @Controller + @ResponseBody의 조합입니다. 주로 JSON 형태로 데이터를 반환하는 REST API를 만들 때 사용합니다.
    - @RequiredArgsConstructor: 생성자 주입(Constructor Injection) 자동화
    - @RequestMapping: 특정 URL 패턴을 클래스나 메서드에 매핑합니다.
    - @GetMapping, @PostMapping, @PutMapping, @DeleteMapping: HTTP Method(GET, POST, PUT, DELETE)에 맞게 요청을 처리합니다.
    - @RequestBody: 클라이언트가 보낸 JSON 데이터를 객체로 변환하여 받을 때 사용합니다.
    
  2. Service
    - @Service: 해당 클래스가 서비스 계층임을 명시하고, 스프링 빈(Bean)으로 등록합니다.
    - @Transactional: 매우 중요합니다. 메서드 내의 작업들을 하나의 트랜잭션으로 묶어줍니다. 작업 중 오류가 발생하면 자동으로 롤백(Rollback)을 수행합니다.

  3. Repository 
    - @Repository: 해당 클래스가 데이터 저장소에 접근하는 클래스임을 명시합니다. DB 예외를 스프링의 예외 계층으로 변환해주는 역할도 합니다.

  4. Domain 
    - @Entity: 이 클래스가 DB 테이블과 매핑될 클래스임을 나타냅니다. (JPA 관리 대상)
    - @Id: 테이블의 기본키(PK)를 지정합니다.
    - @GeneratedValue: 기본키 생성 전략을 설정합니다. (예: IDENTITY는 DB에 생성을 위임)
    - @Table, @Column: 테이블이나 컬럼의 이름을 실제 DB와 다르게 설정하고 싶을 때 사용합니다.
    - @Getter / @Setter: Domain(Entity) 클래스에서 필드에 대한 Getter/Setter 메서드를 생성해줍니다.
    - @NoArgsConstructor: 파라미터가 없는 기본 생성자를 만들어줍니다. (JPA Entity에는 필수입니다.)
    - @AllArgsConstructor: 모든 필드를 파라미터로 받는 생성자를 만들어줍니다.
      
  5. Config
    - @Configuration: 해당 클래스가 스프링의 설정 정보임을 나타냅니다.
    - @Bean: 메서드가 반환하는 객체를 스프링 컨테이너에 빈으로 등록합니다. 주로 외부 라이브러리 객체를 등록할 때 씁니다.

- 보충 설명
  1. JpaRepository
     - 클래스가 아니라 인터페이스입니다. JpaRepository<Entity클래스, ID타입>을 상속받기만 하면 실체(구현체)는 스프링이 알아서 만들어줍니다.
     - INSERT, UPDATE, SELECT, DELETE 같은 뻔한 SQL을 직접 작성할 필요가 없습니다.|

    - Repository 
    ```
    ```

    - Service
    ```
    ```
  2. @Bean
    - 보통 SecurityFilterChain이나 PasswordEncoder 같은 객체를 만들 때 사용합니다.
    - 스프링이 만들고 관리하는 객체
    - 스프링에게 이 객체의 생명주기(생성, 관리, 소멸)를 네가 담당해줘라고 권한을 넘기는 것이라고 이해하시면 됩니다.
    ```

    ```
       
#### 3일차(12/26)

- 프론트코드 읽기(api호출 + 유효성 검사, 찜하기, 카카오맵연동, 건강백과사전 api, 검색기능, 미리보기기능, 페이지기능, 날짜내림차순 정렬)
- 백엔드코드 읽기(api호출 + 병원등급정보 level어디서 쓰지?)









  
### 2주차 진행상황 기록

### 3주차 진행상황 기록
